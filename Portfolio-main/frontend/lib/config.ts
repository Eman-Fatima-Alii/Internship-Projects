import { getAbsoluteUrl } from "@/lib/opengraph-utils";

export const siteConfig = {
    name: 'Eman Fatima',
    // We use the utility to get the absolute URL for the homepage
    url: getAbsoluteUrl("/"),
    title: 'Eman Fatima | Full Stack AI Engineer',
    description: 'Explore my AI systems, full-stack projects, skills, and experience by chatting with my digital AI twin in real time.',
    author: 'Eman Fatima',
    twitterHandle: '@emanfatima',
    links: {
        twitter: 'https://twitter.com',
        github: 'https://github.com/Eman-Fatima-Alii',
        linkedin: 'https://www.linkedin.com/in/eman-fatima-34468a356',
    },
    // Using the local image in public/og-image.png
    // We add ?v=1 to force social media platforms to clear their cache and fetch the new image
    ogImage: "/og-image.png?v=1",
};
