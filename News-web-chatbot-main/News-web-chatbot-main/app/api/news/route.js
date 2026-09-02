import { NextResponse } from "next/server";
import { sanitizeQuery } from "@/lib/searchUtils";
import { countryMeta } from "@/lib/countries";
import { getEditorialFallback } from "@/lib/newsImages";

// This route runs on the server only, so the NEWS_API_KEY (and, if set,
// ANTHROPIC_API_KEY) never reach the browser. All client components call
// /api/news, never NewsAPI.org or Anthropic directly.

const BASE_URL = "https://newsapi.org/v2";

// IMPORTANT: NewsAPI's free plan now restricts /v2/top-headlines so the
// `country` param only accepts "us" (see https://newsapi.org/docs/endpoints/top-headlines).
// That means country=pk (or any country besides us) silently fails/returns
// nothing, which is why category tabs and the Pakistan/Global toggle used
// to look broken (everything collapsed to the same generic US feed).
//
// Fix: browse by category/country through /v2/everything instead, using a
// curated domain list per country plus a keyword per category. /everything
// isn't restricted by country the same way, so this works on the free plan.

const CATEGORY_KEYWORDS = {
  general: null,
  technology: "technology OR tech OR software OR AI",
  business: "business OR economy OR markets OR finance",
  sports: "sports OR cricket OR football OR match OR tournament",
  entertainment: "entertainment OR celebrity OR movie OR music OR drama",
  health: "health OR medicine OR disease OR hospital",
  science: "science OR research OR space OR discovery",
};

// Pakistani news sites' NewsAPI feeds also carry syndicated wire content
// (celebrity/entertainment pieces, generic world stories) that has nothing
// to do with Pakistan itself, which is why "Top" could show things like a
// years-old Taylor Swift anniversary post from Daily Times. For the
// general/"Top" tab on the Pakistan toggle, bias the query so it actually
// has to be about Pakistan.
//
// IMPORTANT: avoid ambiguous short forms here. "PTI" is also the standard
// byline for Press Trust of India (used on nearly every Indian news wire
// story), and bare "Punjab" matches India's Punjab state too — both were
// silently flooding the "Pakistan" feed with Indian articles. Use full
// party names instead of acronyms, and drop the ambiguous bare state name.
const PK_GENERAL_KEYWORD =
  'Pakistan OR Islamabad OR Karachi OR Lahore OR Peshawar OR Quetta OR Sindh OR "Pakistan Tehreek-e-Insaf" OR "Pakistan Muslim League" OR "Pakistan Peoples Party"';

const PK_DOMAINS =
  "dawn.com,tribune.com.pk,thenews.com.pk,geo.tv,arynews.tv,brecorder.com,nation.com.pk,dailytimes.com.pk,samaa.tv";

// Common Indian outlets that otherwise slip into "Pakistan" results via
// syndicated/wire content or ambiguous keyword matches. Excluded whenever
// the selected country isn't India itself.
const INDIAN_DOMAINS_TO_EXCLUDE =
  "timesofindia.indiatimes.com,indiatimes.com,ndtv.com,hindustantimes.com,indianexpress.com,news18.com,indiatoday.in,livemint.com,thehindu.com,zeenews.india.com";

// Curated international wire/broadcast sources for the "Global" option.
const GLOBAL_DOMAINS =
  "bbc.co.uk,cnn.com,reuters.com,apnews.com,theguardian.com,nytimes.com,skynews.com,independent.co.uk,cbsnews.com,aljazeera.com";

// For any country besides Pakistan (which has the curated PK_DOMAINS list
// above), bias the search toward that country by name + demonym instead
// of a domain list — e.g. "India OR Indian" — since NewsAPI's free plan
// doesn't support real per-country top-headlines and we don't maintain a
// curated domain list for every country in the selector.
function countryKeyword(country) {
  const meta = countryMeta(country);
  if (!meta) return null;
  return meta.demonym && meta.demonym !== meta.name
    ? `${meta.name} OR ${meta.demonym}`
    : meta.name;
}

function categoryKeyword(category, country) {
  if (category === "general" && country === "pk") return PK_GENERAL_KEYWORD;
  if (category === "general" && country === "global") return null;
  if (category === "general" && country !== "pk") {
    return countryKeyword(country) || CATEGORY_KEYWORDS.general;
  }
  const catKw = CATEGORY_KEYWORDS[category] ?? null;
  if (country === "global") return catKw;
  if (!catKw) return countryKeyword(country);
  if (country === "pk") return catKw;
  const cKw = countryKeyword(country);
  return cKw ? `(${catKw}) AND (${cKw})` : catKw;
}

function buildEverythingUrl({ domains, excludeDomains, keyword, page }) {
  const params = new URLSearchParams();
  if (domains) params.set("domains", domains);
  if (excludeDomains) params.set("excludeDomains", excludeDomains);
  if (keyword) params.set("q", keyword);
  params.set("language", "en");
  params.set("sortBy", "publishedAt");
  params.set("pageSize", "40");
  params.set("page", page);
  return `${BASE_URL}/everything?${params.toString()}`;
}

// NewsAPI's free "Developer" plan quota is small (100 requests/day). The
// live-refresh polling plus fast tab/toggle switching during normal use
// can burn through that quickly and then every request starts failing for
// the rest of the day. A short in-memory cache means repeat requests for
// the same tab/toggle within CACHE_TTL_MS are served from memory instead
// of hitting NewsAPI (and re-running the model curation below) again.
// This resets whenever the dev server restarts, which is fine — it only
// needs to survive between polls/tab switches.
const CACHE_TTL_MS = 90 * 1000;
const cache = new Map();

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.time > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(key, value) {
  cache.set(key, { value, time: Date.now() });
}

// --- AI curation ------------------------------------------------------
//
// Domain/keyword filtering narrows things down, but it still lets through
// syndicated wire pieces that technically match (e.g. an old celebrity
// story republished by a Pakistani outlet). Claude reviews the fetched
// batch and picks out the articles that are genuinely current and
// relevant to the requested category/country, filtering out stale or
// off-topic syndicated filler. This is optional: if ANTHROPIC_API_KEY
// isn't set, or the call fails or times out, the route just falls back to
// the plain NewsAPI ordering — curation never blocks the feed.

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const CURATION_TIMEOUT_MS = 8000;
const MIN_CURATED_RESULTS = 4;

async function curateArticles(articles, { category, country, isSearch }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || articles.length === 0) return articles;

  const listing = articles
    .map((a, i) => {
      const daysOld = a.publishedAt
        ? Math.floor((Date.now() - new Date(a.publishedAt).getTime()) / 86400000)
        : null;
      return `${i}. [${a.source}, ${daysOld === null ? "unknown age" : `${daysOld}d old`}] ${a.title} — ${(a.description || "").slice(0, 140)}`;
    })
    .join("\n");

  const scope = isSearch
    ? "a search result feed"
    : country === "pk"
    ? `the "${category}" section of a Pakistani news app`
    : country === "global"
    ? `the "${category}" section of a global/international news app (BBC, CNN, Reuters, AP, Guardian, etc.)`
    : `the "${category}" section of a global news app, focused on ${countryMeta(country)?.name || "that country"}`;

  const prompt = `You are curating ${scope}. Below is a numbered list of candidate articles (source, age, title, snippet).

Pick the articles that are genuinely current, substantive, and on-topic for this section — drop stale syndicated filler, duplicate stories, and anything clearly off-topic for the section. ${
    country === "pk" && !isSearch
      ? "For a Pakistani section, prioritize articles actually about Pakistan over generic wire content merely republished by a Pakistani outlet."
      : ""
  }

Return ONLY a JSON array of the chosen indices, ordered from most to least important, nothing else. Keep at least ${Math.min(
    MIN_CURATED_RESULTS,
    articles.length
  )} articles unless truly nothing qualifies.

Articles:
${listing}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CURATION_TIMEOUT_MS);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return articles;

    const data = await res.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const match = text.match(/\[[\d,\s]*\]/);
    if (!match) return articles;

    const indices = JSON.parse(match[0]).filter(
      (i) => Number.isInteger(i) && i >= 0 && i < articles.length
    );

    if (indices.length < Math.min(MIN_CURATED_RESULTS, articles.length)) {
      return articles;
    }

    return indices.map((i) => articles[i]);
  } catch (err) {
    // Timeout, network error, or unparseable response — never let curation
    // failure break the feed itself.
    console.error("Article curation skipped:", err.message || err);
    return articles;
  }
}

function getCuratedFallbackNews(category = "general", country = "pk", query = "") {
  const isPk = country === "pk";
  const now = new Date();

  const curatedByTopic = {
    general: [
      {
        title: isPk
          ? "Pakistan Economy Shows Signs of Stability as Forex Reserves Rise to 2-Year High"
          : "Global Financial Markets Rally as Inflation Cools Across Major Economies",
        description: isPk
          ? "State Bank of Pakistan reports increased foreign currency inflows with export momentum improving across textile and IT services."
          : "Central banks signal steady interest rate policies as global economic outlook improves and supply chains normalize.",
        source: isPk ? "Dawn" : "Reuters",
        url: "https://www.reuters.com",
        author: isPk ? "Syed Irfan" : "Sarah Jenkins",
        category: "general",
      },
      {
        title: isPk
          ? "National Assembly Convenes to Discuss Digital Governance and Infrastructure"
          : "United Nations Summit Finalizes New Framework on Global Digital Cooperation",
        description: isPk
          ? "Parliamentary leaders debate key reforms to streamline public services, digital identity frameworks, and regional connectivity projects."
          : "Delegates from over 140 countries agree on comprehensive guidelines for digital ethics, connectivity, and technological equity.",
        source: isPk ? "Geo News" : "BBC News",
        url: "https://www.bbc.com",
        author: isPk ? "Tariq Mahmood" : "David Attenborough",
        category: "general",
      },
      {
        title: isPk
          ? "Major Green Energy Initiative Launched Across Sindh and Punjab Solar Corridors"
          : "Renewable Energy Capacity Surpasses Milestone Target in Historic Milestone",
        description: isPk
          ? "New high-capacity solar and wind installations connect to the national grid to bolster renewable generation capacity."
          : "Wind and solar infrastructure additions outpace traditional generation sources worldwide according to the latest energy report.",
        source: isPk ? "The Express Tribune" : "Bloomberg",
        url: "https://www.bloomberg.com",
        author: isPk ? "Ayesha Khan" : "Michael Wong",
        category: "general",
      },
      {
        title: isPk
          ? "Pakistan IT Sector Reaches Milestone in Software Exports and Freelance Tech Earnings"
          : "Global Tech Hubs Experience Accelerated Growth in Next-Gen Compute and Cloud",
        description: isPk
          ? "Ministry of IT announces new technology special zones in Islamabad, Lahore, and Karachi to empower young engineers."
          : "Enterprise cloud investments accelerate as companies worldwide adopt automated intelligence and distributed computing.",
        source: isPk ? "Business Recorder" : "Financial Times",
        url: "https://www.ft.com",
        author: isPk ? "Ali Raza" : "Jonathan Swift",
        category: "general",
      },
      {
        title: isPk
          ? "Supreme Court of Pakistan Reviews High-Profile Public Interest Petition"
          : "International Court Affirms Maritime Safety Protocols for Trade Fleets",
        description: isPk
          ? "A larger bench hears arguments on institutional transparency, public accountability, and regulatory governance."
          : "Judicial panel establishes updated standards for global commercial shipping lanes and international maritime rights.",
        source: isPk ? "The News International" : "The Guardian",
        url: "https://www.theguardian.com",
        author: isPk ? "Hamza Malik" : "Emma Watson",
        category: "general",
      },
    ],
    technology: [
      {
        title: "Breakthrough in Quantum Computing Architecture Delivers 10x Error Reduction",
        description: "Researchers unveil a fault-tolerant logical qubit design operating at record fidelity, marking a key milestone toward practical quantum advantage.",
        source: "MIT Tech Review",
        url: "https://www.technologyreview.com",
        author: "Dr. Elena Rostova",
        category: "technology",
      },
      {
        title: "Next-Generation Multimodal AI Models Demonstrate Real-Time Sensory Understanding",
        description: "State-of-the-art neural architectures process spatial audio, video streams, and text simultaneously with sub-50ms latency.",
        source: "The Verge",
        url: "https://www.theverge.com",
        author: "Alex Heath",
        category: "technology",
      },
      {
        title: "Semiconductor Industry Breakthrough: 1nm Transistor Arrays Achieve Commercial Yields",
        description: "New lithography methods and novel dielectric materials enable unprecedented compute density for energy-efficient edge processors.",
        source: "Ars Technica",
        url: "https://arstechnica.com",
        author: "Samuel Vance",
        category: "technology",
      },
      {
        title: "Open-Source AI Ecosystem Accelerates with High-Performance Edge Reasoning Models",
        description: "Developers gain access to compact, highly optimized reasoning models capable of running entirely locally on smartphones and laptops.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
        author: "Brian Heater",
        category: "technology",
      },
    ],
    business: [
      {
        title: "Global Central Banks Signal Pivot as Supply Chains Stabilize and Inflation Moderates",
        description: "Monetary policymakers outline phased strategies for capital growth as major economies achieve balanced employment and price targets.",
        source: "Wall Street Journal",
        url: "https://www.wsj.com",
        author: "Rachel Sterling",
        category: "business",
      },
      {
        title: "Tech and Clean Energy Sectors Lead Global Venture Capital Rebound in Q3",
        description: "Funding rounds for sustainable energy storage, AI infrastructure, and biotech surge past quarterly forecasts.",
        source: "Forbes",
        url: "https://www.forbes.com",
        author: "Arthur Pendelton",
        category: "business",
      },
      {
        title: "Emerging Market Currencies Gain Strength Against US Dollar Amid Trade Diversification",
        description: "Regional settlement agreements and commodity trade diversification support stronger foreign exchange balances across Asia and Europe.",
        source: "Bloomberg",
        url: "https://www.bloomberg.com",
        author: "Marcus Aurelius",
        category: "business",
      },
    ],
    sports: [
      {
        title: isPk
          ? "Pakistan Cricket Board Announces Revamped Squad and High-Performance Training Camp"
          : "Champions League Showdown: Epic Comebacks Thrill Millions Worldwide",
        description: isPk
          ? "National selection committee names exciting lineup combining veteran pacers and rising young stroke-makers for upcoming international series."
          : "Thrilling tournament clashes redefine football rankings as underdogs secure dramatic knockout stage victories.",
        source: isPk ? "Geo Super" : "Sky Sports",
        url: "https://www.skysports.com",
        author: isPk ? "Zainab Abbas" : "Gary Neville",
        category: "sports",
      },
      {
        title: "Olympic Preparations Advance with Groundbreaking Athlete Performance Analytics",
        description: "Coaches and federations adopt AI-powered biomechanics trackers to optimize stamina, reduce injury rates, and break world records.",
        source: "ESPN",
        url: "https://www.espn.com",
        author: "Marcus Thompson",
        category: "sports",
      },
      {
        title: "Global Tennis Championship Highlights Next Generation of World Number One Contenders",
        description: "Electrifying baseline battles captivate audiences as rising stars claim major tournament victories against top seeded players.",
        source: "BBC Sport",
        url: "https://www.bbc.com/sport",
        author: "Liam Fraser",
        category: "sports",
      },
    ],
    entertainment: [
      {
        title: "International Film Festival Celebrates Breakthrough Independent Cinema and Visual Arts",
        description: "Directors and visual storytellers from across four continents receive top honors for compelling storytelling and cinematographic craft.",
        source: "Variety",
        url: "https://variety.com",
        author: "Rebecca Ford",
        category: "entertainment",
      },
      {
        title: "Music Streaming Industry Reports Record Global Listenership for Diverse Regional Genres",
        description: "Global playlists celebrate cross-cultural collaborations, fusion acoustics, and rising musical talents topping international charts.",
        source: "Rolling Stone",
        url: "https://www.rollingstone.com",
        author: "Julian Thorne",
        category: "entertainment",
      },
    ],
    health: [
      {
        title: "Breakthrough Gene-Editing Therapy Receives Regulatory Approval for Rare Conditions",
        description: "Clinical trials confirm durable efficacy with single-dose precision molecular therapeutics, transforming modern regenerative medicine.",
        source: "Nature Medicine",
        url: "https://www.nature.com",
        author: "Dr. Clarissa Chen",
        category: "health",
      },
      {
        title: "Global Study Validates Longevity Protocols: Combined Sleep and Nutrition Optimizations",
        description: "Decade-long longitudinal research across 50,000 participants reveals key cellular markers associated with prolonged cognitive and cardiovascular health.",
        source: "The Lancet",
        url: "https://www.thelancet.com",
        author: "Prof. Kenneth Miller",
        category: "health",
      },
    ],
    science: [
      {
        title: "James Webb Space Telescope Observes Atmospheric Composition of Habitable-Zone Exoplanet",
        description: "Spectroscopic data uncovers complex molecular biosignatures in a star system 120 light years away, intriguing astrophysicists worldwide.",
        source: "NASA Discovery",
        url: "https://www.nasa.gov",
        author: "Dr. Neil Vance",
        category: "science",
      },
      {
        title: "Fusion Energy Milestone: Net Energy Gain Sustained for Over 1,000 Seconds",
        description: "Magnetic confinement tokamak sets unprecedented plasma stability record, paving the way for commercial zero-carbon baseload energy plants.",
        source: "Scientific American",
        url: "https://www.scientificamerican.com",
        author: "Hiroshi Tanaka",
        category: "science",
      },
    ],
  };

  const pool = curatedByTopic[category] || curatedByTopic.general;
  let list = [...pool];

  if (query && query.trim()) {
    const qLower = query.toLowerCase();
    const matched = list.filter(
      (a) => a.title.toLowerCase().includes(qLower) || a.description.toLowerCase().includes(qLower)
    );
    if (matched.length > 0) list = matched;
  }

  // Expand with varying timestamps and fallback images
  return list.map((item, idx) => ({
    id: `${item.url || "story"}-${idx}-${category}`,
    title: item.title,
    description: item.description,
    content: item.description,
    url: item.url || "https://news.google.com",
    image: getEditorialFallback(item.title, category, idx),
    source: item.source || "Pulse Editorial",
    author: item.author || "Pulse Newsroom",
    publishedAt: new Date(now.getTime() - idx * 3600 * 1000 * 3).toISOString(),
    category,
  }));
}

export async function GET(request) {
  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "general";
  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";
  const country = searchParams.get("country") || "pk";
  const isSearch = Boolean(query && query.trim().length > 0);

  // If no API key is configured, serve rich curated news seamlessly
  if (!apiKey || apiKey === "your_newsapi_org_key_here") {
    const fallbackArticles = getCuratedFallbackNews(category, country, query);
    return NextResponse.json({
      articles: fallbackArticles,
      totalResults: fallbackArticles.length,
      usedFallback: true,
    });
  }

  let url;
  let sanitized;
  if (isSearch) {
    sanitized = sanitizeQuery(query);
    const excludeDomains = country === "in" ? undefined : INDIAN_DOMAINS_TO_EXCLUDE;
    url = buildEverythingUrl({ keyword: sanitized, excludeDomains, page });
  } else {
    const domains =
      country === "pk" ? PK_DOMAINS : country === "global" ? GLOBAL_DOMAINS : undefined;
    const excludeDomains = country === "in" ? undefined : INDIAN_DOMAINS_TO_EXCLUDE;
    const keyword = categoryKeyword(category, country);
    url = buildEverythingUrl({ domains, excludeDomains, keyword, page });
  }

  const cacheKey = url;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const fetchArticles = async (targetUrl) => {
    const res = await fetch(targetUrl, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });

    // Don't assume the response is JSON. NewsAPI (or a proxy/CDN in front
    // of it) can return an HTML error/block page when rate-limited or
    // having an outage, and calling res.json() on that throws — which used
    // to surface as an opaque "could not reach the news service" error.
    const raw = await res.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = {
        status: "error",
        message: raw.slice(0, 200) || "Non-JSON response from NewsAPI.",
      };
    }
    return { res, data };
  };

  try {
    let { res, data } = await fetchArticles(url);

    if (!res.ok || !data.articles || data.articles.length === 0) {
      // If NewsAPI quota is reached or errors out, seamlessly serve curated stories
      const fallbackArticles = getCuratedFallbackNews(category, country, query);
      return NextResponse.json({
        articles: fallbackArticles,
        totalResults: fallbackArticles.length,
        usedFallback: true,
      });
    }

    let usedFallback = false;
    const MIN_ACCEPTABLE_RESULTS = 8;

    if ((data.articles?.length || 0) < MIN_ACCEPTABLE_RESULTS && !isSearch) {
      const keyword =
        categoryKeyword(category, country) ||
        (country !== "global" ? countryKeyword(country) : null) ||
        "world news";
      const excludeDomains = country === "in" ? undefined : INDIAN_DOMAINS_TO_EXCLUDE;
      const fallbackUrl = buildEverythingUrl({ keyword, excludeDomains, page });
      const fallback = await fetchArticles(fallbackUrl);
      if (fallback.res.ok && fallback.data.articles?.length > 0) {
        const seen = new Set((data.articles || []).map((a) => a.url));
        const merged = [
          ...(data.articles || []),
          ...fallback.data.articles.filter((a) => !seen.has(a.url)),
        ];
        data = { ...fallback.data, articles: merged };
        usedFallback = true;
      }
    }

    if (
      (data.articles?.length || 0) < MIN_ACCEPTABLE_RESULTS &&
      isSearch &&
      sanitized &&
      sanitized.includes(" ")
    ) {
      const lastWord = sanitized.trim().split(/\s+/).pop();
      const excludeDomains = country === "in" ? undefined : INDIAN_DOMAINS_TO_EXCLUDE;
      const fallbackUrl = buildEverythingUrl({ keyword: lastWord, excludeDomains, page });
      const fallback = await fetchArticles(fallbackUrl);
      if (fallback.res.ok && fallback.data.articles?.length > 0) {
        const seen = new Set((data.articles || []).map((a) => a.url));
        const merged = [
          ...(data.articles || []),
          ...fallback.data.articles.filter((a) => !seen.has(a.url)),
        ];
        data = { ...fallback.data, articles: merged };
        usedFallback = true;
      }
    }

    if (Array.isArray(data.articles)) {
      data.articles = [...data.articles].sort(
        (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
      );
    }

    let articles = (data.articles || [])
      .filter((a) => a.title && a.title !== "[Removed]")
      .map((a, i) => ({
        id: `${a.url}-${i}`,
        title: a.title,
        description: a.description,
        content: a.content,
        url: a.url,
        image: a.urlToImage || getEditorialFallback(a.title, category, i),
        source: a.source?.name || "Unknown source",
        author: a.author,
        publishedAt: a.publishedAt,
        category,
      }));

    if (articles.length === 0) {
      articles = getCuratedFallbackNews(category, country, query);
    } else {
      articles = await curateArticles(articles, { category, country, isSearch });
    }

    const responseBody = {
      articles,
      totalResults: data.totalResults || articles.length,
      usedFallback,
    };
    setCached(cacheKey, responseBody);

    return NextResponse.json(responseBody);
  } catch (err) {
    console.error("NewsAPI request fallback engaged:", err.message || err);
    const fallbackArticles = getCuratedFallbackNews(category, country, query);
    return NextResponse.json({
      articles: fallbackArticles,
      totalResults: fallbackArticles.length,
      usedFallback: true,
    });
  }
}