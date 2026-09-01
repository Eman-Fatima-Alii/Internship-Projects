/**
 * BasicPython Suite - Application Controller & Interactive Playground
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentModuleId: "atm-mockup",
    selectedCategory: "all",
    searchQuery: "",
    selectedTag: null,
    currentTab: "visual",
    theme: localStorage.getItem("basicpython_theme") || "dark",
    recentRuns: 0,
    pyodide: null,
    isPyodideLoading: false
  };

  // DOM Cache
  const DOM = {
    categoryList: document.getElementById("categoryNavList"),
    tagCloud: document.getElementById("tagCloud"),
    modulesGrid: document.getElementById("modulesGrid"),
    searchWrapper: document.querySelector(".search-wrapper"),
    searchInput: document.getElementById("globalSearchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    totalModulesCount: document.getElementById("totalModulesCount"),
    totalCategoriesCount: document.getElementById("totalCategoriesCount"),
    heroTotalCount: document.getElementById("heroTotalCount"),

    // Workspace DOM
    workspaceIcon: document.getElementById("workspaceIcon"),
    workspaceTitle: document.getElementById("workspaceTitle"),
    workspaceFilename: document.getElementById("workspaceFilename"),
    workspaceDesc: document.getElementById("workspaceDesc"),
    inputsForm: document.getElementById("inputsForm"),
    btnRunModule: document.getElementById("btnRunModule"),
    btnResetInputs: document.getElementById("btnResetInputs"),

    // Workspace Tabs
    tabButtons: document.querySelectorAll(".tab-btn"),
    tabPanes: document.querySelectorAll(".tab-pane"),

    // Output views
    visualContainer: document.getElementById("visualContainer"),
    terminalOutput: document.getElementById("terminalOutput"),
    codeDisplay: document.getElementById("codeDisplay"),
    btnCopyCode: document.getElementById("btnCopyCode"),
    btnRunPythonWasm: document.getElementById("btnRunPythonWasm"),
    wasmStatusPill: document.getElementById("wasmStatusPill")
  };

  /**
   * Initialize Application
   */
  function init() {
    applyTheme(state.theme);
    renderCategoryNav();
    renderTagsCloud();
    updateStats();
    setupEventListeners();
    
    // Initial Render of default module
    selectModule(state.currentModuleId);
    filterAndRenderGrid();
  }

  /**
   * Apply Theme
   */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("basicpython_theme", theme);
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  /**
   * Update Global Stats
   */
  function updateStats() {
    if (DOM.totalModulesCount) DOM.totalModulesCount.textContent = `${MODULES_DATA.length} Modules`;
    if (DOM.heroTotalCount) DOM.heroTotalCount.textContent = MODULES_DATA.length;
    if (DOM.totalCategoriesCount) DOM.totalCategoriesCount.textContent = CATEGORIES.length - 1;
  }

  /**
   * Render Category Navigation in Sidebar
   */
  function renderCategoryNav() {
    if (!DOM.categoryList) return;
    DOM.categoryList.innerHTML = "";

    CATEGORIES.forEach(cat => {
      const count = cat.id === "all" 
        ? MODULES_DATA.length 
        : MODULES_DATA.filter(m => m.category === cat.id).length;

      const li = document.createElement("li");
      li.className = `category-nav-item ${state.selectedCategory === cat.id ? "active" : ""}`;
      li.dataset.categoryId = cat.id;

      li.innerHTML = `
        <div class="cat-item-left">
          <span>${cat.icon}</span>
          <span>${cat.label}</span>
        </div>
        <span class="cat-count">${count}</span>
      `;

      li.addEventListener("click", () => {
        state.selectedCategory = cat.id;
        state.selectedTag = null;
        updateActiveCategoryUI();
        filterAndRenderGrid();
      });

      DOM.categoryList.appendChild(li);
    });
  }

  function updateActiveCategoryUI() {
    const items = DOM.categoryList.querySelectorAll(".category-nav-item");
    items.forEach(item => {
      if (item.dataset.categoryId === state.selectedCategory) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  /**
   * Render Tag Cloud in Sidebar
   */
  function renderTagsCloud() {
    if (!DOM.tagCloud) return;
    const allTags = new Set();
    MODULES_DATA.forEach(m => m.tags.forEach(t => allTags.add(t)));

    DOM.tagCloud.innerHTML = "";
    Array.from(allTags).sort().forEach(tag => {
      const chip = document.createElement("button");
      chip.className = `tag-chip ${state.selectedTag === tag ? "active" : ""}`;
      chip.textContent = `#${tag}`;
      chip.addEventListener("click", () => {
        if (state.selectedTag === tag) {
          state.selectedTag = null;
        } else {
          state.selectedTag = tag;
        }
        renderTagsCloud();
        filterAndRenderGrid();
      });
      DOM.tagCloud.appendChild(chip);
    });
  }

  /**
   * Filter Modules & Render Catalog Grid
   */
  function filterAndRenderGrid() {
    if (!DOM.modulesGrid) return;

    let filtered = MODULES_DATA.filter(module => {
      // Category check
      if (state.selectedCategory !== "all" && module.category !== state.selectedCategory) {
        return false;
      }
      // Tag check
      if (state.selectedTag && !module.tags.includes(state.selectedTag)) {
        return false;
      }
      // Search query check
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        const matchesTitle = module.title.toLowerCase().includes(query);
        const matchesDesc = module.description.toLowerCase().includes(query);
        const matchesFile = module.filename.toLowerCase().includes(query);
        const matchesTag = module.tags.some(t => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesFile || matchesTag;
      }
      return true;
    });

    DOM.modulesGrid.innerHTML = "";

    if (filtered.length === 0) {
      DOM.modulesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <p>No modules found matching "<strong>${escapeHtml(state.searchQuery || state.selectedTag || '')}</strong>"</p>
          <button class="btn-secondary" style="margin-top: 1rem;" id="btnResetFilters">Clear Filters</button>
        </div>
      `;
      const btn = document.getElementById("btnResetFilters");
      if (btn) {
        btn.addEventListener("click", () => {
          state.searchQuery = "";
          state.selectedCategory = "all";
          state.selectedTag = null;
          if (DOM.searchInput) DOM.searchInput.value = "";
          DOM.searchWrapper.classList.remove("has-query");
          updateActiveCategoryUI();
          renderTagsCloud();
          filterAndRenderGrid();
        });
      }
      return;
    }

    filtered.forEach(mod => {
      const card = document.createElement("div");
      card.className = `module-card ${mod.id === state.currentModuleId ? "active" : ""}`;
      card.innerHTML = `
        <div class="card-top">
          <div class="card-icon">${mod.icon}</div>
          <div class="card-title-group">
            <h4>${escapeHtml(mod.title)}</h4>
            <div class="card-desc">${escapeHtml(mod.description)}</div>
          </div>
        </div>
        <div class="card-bottom">
          <div class="card-tags">
            ${mod.tags.slice(0, 2).map(t => `<span class="card-tag">#${escapeHtml(t)}</span>`).join("")}
          </div>
          <div class="card-btn">Open Playground ⚡</div>
        </div>
      `;

      card.addEventListener("click", () => {
        selectModule(mod.id);
        window.scrollTo({ top: document.querySelector(".module-workspace").offsetTop - 80, behavior: "smooth" });
      });

      DOM.modulesGrid.appendChild(card);
    });
  }

  /**
   * Select and Display a Module in Workspace
   */
  function selectModule(moduleId) {
    const mod = MODULES_DATA.find(m => m.id === moduleId);
    if (!mod) return;

    state.currentModuleId = moduleId;

    // Update workspace UI
    DOM.workspaceIcon.textContent = mod.icon;
    DOM.workspaceTitle.textContent = mod.title;
    DOM.workspaceFilename.textContent = `📄 ${mod.filename}`;
    DOM.workspaceDesc.textContent = mod.description;

    // Update Code Display
    DOM.codeDisplay.textContent = mod.code;

    // Render Input Fields
    renderInputFields(mod);

    // Update Card Active states in grid
    document.querySelectorAll(".module-card").forEach(c => {
      c.classList.toggle("active", c.querySelector("h4")?.textContent === mod.title);
    });

    // Execute Module by default with initial inputs
    executeModule(mod);
  }

  /**
   * Render Dynamic Input Controls
   */
  function renderInputFields(mod) {
    if (!DOM.inputsForm) return;
    DOM.inputsForm.innerHTML = "";

    if (!mod.inputs || mod.inputs.length === 0) {
      DOM.inputsForm.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">This module runs automatically without requiring manual input parameters.</p>`;
      return;
    }

    mod.inputs.forEach(inp => {
      const group = document.createElement("div");
      group.className = "input-group";

      const label = document.createElement("label");
      label.textContent = inp.label;
      label.setAttribute("for", `inp_${inp.name}`);
      group.appendChild(label);

      let inputEl;
      if (inp.type === "select") {
        inputEl = document.createElement("select");
        inputEl.className = "input-field";
        inputEl.id = `inp_${inp.name}`;
        inputEl.name = inp.name;
        inp.options.forEach(opt => {
          const optEl = document.createElement("option");
          optEl.value = opt;
          optEl.textContent = opt;
          if (opt === inp.default) optEl.selected = true;
          inputEl.appendChild(optEl);
        });
      } else {
        inputEl = document.createElement("input");
        inputEl.className = "input-field";
        inputEl.id = `inp_${inp.name}`;
        inputEl.name = inp.name;
        inputEl.type = inp.type || "text";
        inputEl.value = inp.default !== undefined ? inp.default : "";
        if (inp.placeholder) inputEl.placeholder = inp.placeholder;
        if (inp.min !== undefined) inputEl.min = inp.min;
        if (inp.max !== undefined) inputEl.max = inp.max;
        if (inp.step !== undefined) inputEl.step = inp.step;
      }

      // Auto run on change / input
      inputEl.addEventListener("input", () => {
        executeModule(mod);
      });

      group.appendChild(inputEl);

      if (inp.help) {
        const help = document.createElement("span");
        help.className = "input-help";
        help.textContent = inp.help;
        group.appendChild(help);
      }

      DOM.inputsForm.appendChild(group);
    });
  }

  /**
   * Collect Input Form Data
   */
  function collectFormData() {
    const data = {};
    if (!DOM.inputsForm) return data;
    const inputs = DOM.inputsForm.querySelectorAll(".input-field");
    inputs.forEach(inp => {
      data[inp.name] = inp.value;
    });
    return data;
  }

  /**
   * Execute Module & Update Visual / Terminal Output
   */
  function executeModule(mod) {
    const args = collectFormData();
    state.recentRuns++;

    try {
      const result = mod.run(args);
      
      // Update Terminal
      renderTerminalOutput(mod, args, result.output);

      // Render Visualizer
      renderVisualizer(mod, result.visualData);
    } catch (err) {
      renderTerminalOutput(mod, args, `Execution Error: ${err.message}`);
    }
  }

  /**
   * Render Terminal Window Output
   */
  function renderTerminalOutput(mod, args, output) {
    if (!DOM.terminalOutput) return;

    let inputEcho = "";
    if (mod.inputs && mod.inputs.length > 0) {
      inputEcho = Object.entries(args).map(([k, v]) => `$ [Input: ${k}] => ${v}`).join("\n") + "\n";
    }

    DOM.terminalOutput.innerHTML = `
<span class="term-prompt">user@antigravity:~/BasicPython$</span> python3 "${escapeHtml(mod.filename)}"
${inputEcho ? `<span style="color: #64748b;">${escapeHtml(inputEcho)}</span>` : ''}
<span class="term-highlight">${escapeHtml(output)}</span>
<span class="term-prompt">user@antigravity:~/BasicPython$</span> <span style="animation: pulse 1s infinite;">▌</span>
    `.trim();
  }

  /**
   * Render Custom Visualizers for Modules
   */
  function renderVisualizer(mod, data) {
    if (!DOM.visualContainer) return;
    DOM.visualContainer.innerHTML = "";

    if (!data) {
      DOM.visualContainer.innerHTML = `<p style="color: var(--text-muted);">No visual representation available for this module.</p>`;
      return;
    }

    switch (mod.visualType) {
      case "traffic-light": {
        const lightBox = document.createElement("div");
        lightBox.className = "traffic-light-box";
        lightBox.innerHTML = `
          <div class="traffic-bulb red ${data.activeColor === 'red' ? 'active' : ''}"></div>
          <div class="traffic-bulb yellow ${data.activeColor === 'yellow' ? 'active' : ''}"></div>
          <div class="traffic-bulb green ${data.activeColor === 'green' ? 'active' : ''}"></div>
        `;
        const wrap = document.createElement("div");
        wrap.style.display = "flex";
        wrap.style.flexDirection = "column";
        wrap.style.alignItems = "center";
        wrap.appendChild(lightBox);
        const label = document.createElement("div");
        label.className = "traffic-status-label";
        label.style.color = data.activeColor === 'red' ? '#ef4444' : (data.activeColor === 'yellow' ? '#eab308' : (data.activeColor === 'green' ? '#10b981' : '#94a3b8'));
        label.textContent = `Action: ${data.action}`;
        wrap.appendChild(label);
        DOM.visualContainer.appendChild(wrap);
        break;
      }

      case "atm": {
        const card = document.createElement("div");
        card.className = "atm-card-ui";
        card.innerHTML = `
          <div class="atm-chip"></div>
          <div class="atm-balance-title">Account Balance</div>
          <div class="atm-balance-amount">$${data.balance.toLocaleString()}</div>
          <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.75rem;">
            Withdrawal Request: <strong>$${data.withdraw.toLocaleString()}</strong>
          </div>
          <div class="atm-status-badge ${data.status}">
            <span>${data.status === 'success' ? '✓' : '✗'}</span>
            <span>${escapeHtml(data.message)}</span>
          </div>
        `;
        DOM.visualContainer.appendChild(card);
        break;
      }

      case "rocket": {
        const arena = document.createElement("div");
        arena.className = "rocket-arena";
        arena.innerHTML = `
          <div class="rocket-icon-anim">🚀</div>
          <div class="countdown-badge">${data.steps[data.steps.length - 1] === 0 ? 'T-Minus 0: BLAST OFF!' : `T-${data.steps[0]}`}</div>
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; justify-content: center;">
            ${data.steps.map(s => `<span style="font-family: var(--font-mono); background: var(--bg-input); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; border: 1px solid var(--border-subtle);">${s}</span>`).join("")}
          </div>
        `;
        DOM.visualContainer.appendChild(arena);
        break;
      }

      case "tweet": {
        const tweetBox = document.createElement("div");
        tweetBox.className = "tweet-stats-box";
        const vPct = data.letters ? ((data.vowels / data.letters) * 100).toFixed(1) : 0;
        const cPct = data.letters ? ((data.consonants / data.letters) * 100).toFixed(1) : 0;

        tweetBox.innerHTML = `
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-style: italic; font-size: 0.85rem;">
            "${escapeHtml(data.text)}"
          </div>
          <div class="stat-bar-group">
            <div class="stat-bar-label">
              <span style="color: var(--accent-emerald);">Vowels (${data.vowels})</span>
              <span>${vPct}%</span>
            </div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill vowels" style="width: ${vPct}%;"></div>
            </div>
          </div>
          <div class="stat-bar-group">
            <div class="stat-bar-label">
              <span style="color: var(--accent-primary);">Consonants (${data.consonants})</span>
              <span>${cPct}%</span>
            </div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill consonants" style="width: ${cPct}%;"></div>
            </div>
          </div>
        `;
        DOM.visualContainer.appendChild(tweetBox);
        break;
      }

      case "grade": {
        const gradeBox = document.createElement("div");
        gradeBox.style.display = "flex";
        gradeBox.style.flexDirection = "column";
        gradeBox.style.alignItems = "center";
        gradeBox.style.gap = "0.75rem";
        gradeBox.innerHTML = `
          <div class="grade-badge-card ${data.badgeClass}">
            ${escapeHtml(data.grade.replace("Grade ", ""))}
          </div>
          <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">
            Score: ${data.marks}% | ${escapeHtml(data.grade)}
          </div>
        `;
        DOM.visualContainer.appendChild(gradeBox);
        break;
      }

      case "cart": {
        const cartBox = document.createElement("div");
        cartBox.style.width = "100%";
        cartBox.style.display = "flex";
        cartBox.style.flexDirection = "column";
        cartBox.style.gap = "0.75rem";
        cartBox.innerHTML = `
          <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">
            Cart Items (${data.cart.length})
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${data.cart.map((item, i) => `
              <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem; background: var(--bg-surface); border: 1px solid var(--border-highlight); border-radius: var(--radius-full); font-size: 0.85rem; color: var(--text-primary);">
                <span>#${i+1}</span>
                <strong>${escapeHtml(item)}</strong>
              </div>
            `).join("")}
          </div>
        `;
        DOM.visualContainer.appendChild(cartBox);
        break;
      }

      case "tags": {
        const tagBox = document.createElement("div");
        tagBox.style.width = "100%";
        tagBox.style.display = "flex";
        tagBox.style.flexDirection = "column";
        tagBox.style.gap = "0.75rem";
        tagBox.innerHTML = `
          <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">
            Deduplicated Set (${data.uniqueCount} unique items)
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${data.tags.map(t => `
              <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">
                #${escapeHtml(t)}
              </span>
            `).join("")}
          </div>
        `;
        DOM.visualContainer.appendChild(tagBox);
        break;
      }

      case "leaderboard": {
        const lbBox = document.createElement("div");
        lbBox.style.width = "100%";
        lbBox.style.display = "flex";
        lbBox.style.flexDirection = "column";
        lbBox.style.gap = "0.75rem";
        lbBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">
            <span>Max: <strong style="color: var(--accent-emerald);">${data.highest}</strong></span>
            <span>Min: <strong style="color: var(--accent-rose);">${data.lowest}</strong></span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: flex-end; height: 100px; padding-top: 10px;">
            ${data.items.map((val, idx) => {
              const max = Math.max(...data.items, 1);
              const heightPct = Math.max(15, (val / max) * 100);
              const isMax = val === data.highest;
              return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                  <span style="font-size: 0.75rem; font-family: var(--font-mono);">${val}</span>
                  <div style="width: 100%; height: ${heightPct}px; background: ${isMax ? 'var(--gradient-brand)' : 'var(--bg-surface-hover)'}; border-radius: 4px 4px 0 0; border: 1px solid var(--border-subtle);"></div>
                  <span style="font-size: 0.7rem; color: var(--text-muted);">#${idx+1}</span>
                </div>
              `;
            }).join("")}
          </div>
        `;
        DOM.visualContainer.appendChild(lbBox);
        break;
      }

      case "ping": {
        const pingBox = document.createElement("div");
        pingBox.style.width = "100%";
        pingBox.style.display = "grid";
        pingBox.style.gridTemplateColumns = "repeat(auto-fit, minmax(140px, 1fr))";
        pingBox.style.gap = "0.75rem";
        pingBox.innerHTML = data.servers.map(s => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-emerald);">● Online</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${s.latency}ms</span>
            </div>
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary);">${s.name}</div>
          </div>
        `).join("");
        DOM.visualContainer.appendChild(pingBox);
        break;
      }

      case "dictionary": {
        const dictBox = document.createElement("div");
        dictBox.className = "general-info-card";
        dictBox.innerHTML = `
          <div class="general-badge info">DICTIONARY STATE</div>
          <div class="general-detail-text">${JSON.stringify(data.data, null, 2)}</div>
          ${data.redactedKey ? `<div style="font-size: 0.75rem; color: var(--accent-rose);">🔒 Key "${data.redactedKey}" (Value: ${data.redactedValue}) was popped/removed for privacy.</div>` : ''}
        `;
        DOM.visualContainer.appendChild(dictBox);
        break;
      }

      case "doorbell": {
        const dbBox = document.createElement("div");
        dbBox.style.display = "flex";
        dbBox.style.flexDirection = "column";
        dbBox.style.alignItems = "center";
        dbBox.style.gap = "0.75rem";
        dbBox.innerHTML = `
          <div style="font-size: 3rem;">${data.isSilent ? '🔕' : '🔔'}</div>
          <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: ${data.isSilent ? '#94a3b8' : 'var(--accent-emerald)'};">
            ${data.modeText}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Time Registered: ${data.formattedTime} (24-Hour Clock)</div>
        `;
        DOM.visualContainer.appendChild(dbBox);
        break;
      }

      case "general":
      default: {
        const card = document.createElement("div");
        card.className = "general-info-card";
        card.innerHTML = `
          <div class="general-badge ${data.status || 'info'}">${escapeHtml(data.badge || 'RESULTS')}</div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${escapeHtml(data.title || 'Summary')}</div>
          <div class="general-detail-text">${escapeHtml(data.detail || '')}</div>
        `;
        DOM.visualContainer.appendChild(card);
        break;
      }
    }
  }

  /**
   * Pyodide In-Browser Execution Integration
   */
  async function runCodeInPythonWasm() {
    const mod = MODULES_DATA.find(m => m.id === state.currentModuleId);
    if (!mod) return;

    if (!state.pyodide) {
      if (state.isPyodideLoading) {
        alert("Python runtime is currently initializing. Please wait a moment...");
        return;
      }
      state.isPyodideLoading = true;
      if (DOM.wasmStatusPill) DOM.wasmStatusPill.textContent = "⚡ Initializing Pyodide WASM...";

      try {
        // Dynamically load Pyodide CDN
        if (!window.loadPyodide) {
          await loadScript("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");
        }
        state.pyodide = await window.loadPyodide();
        if (DOM.wasmStatusPill) DOM.wasmStatusPill.textContent = "🟢 Pyodide Python 3.11 Ready";
      } catch (e) {
        if (DOM.wasmStatusPill) DOM.wasmStatusPill.textContent = "⚠️ WASM offline (using native JS engine)";
        console.warn("Pyodide could not be initialized from CDN (offline mode):", e);
      } finally {
        state.isPyodideLoading = false;
      }
    }

    if (state.pyodide) {
      try {
        // Redirect stdout
        state.pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
        `);
        state.pyodide.runPython(mod.code);
        const stdout = state.pyodide.runPython("sys.stdout.getvalue()");
        renderTerminalOutput(mod, {}, stdout || "[Python executed successfully with no stdout output]");
        switchTab("terminal");
      } catch (err) {
        renderTerminalOutput(mod, {}, `Python Traceback:\n${err}`);
        switchTab("terminal");
      }
    } else {
      // Fallback to our JS logic
      executeModule(mod);
      switchTab("terminal");
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  /**
   * Tab Switching
   */
  function switchTab(tabId) {
    state.currentTab = tabId;
    DOM.tabButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    DOM.tabPanes.forEach(pane => {
      pane.classList.toggle("active", pane.id === `tab-${tabId}`);
    });
  }

  /**
   * Event Listeners Setup
   */
  function setupEventListeners() {
    // Theme Toggle
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.addEventListener("click", () => {
        applyTheme(state.theme === "dark" ? "light" : "dark");
      });
    }

    // Search Input
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        DOM.searchWrapper.classList.toggle("has-query", state.searchQuery.length > 0);
        filterAndRenderGrid();
      });
    }

    // Search Clear
    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.addEventListener("click", () => {
        state.searchQuery = "";
        DOM.searchInput.value = "";
        DOM.searchWrapper.classList.remove("has-query");
        filterAndRenderGrid();
      });
    }

    // Tab Navigation
    DOM.tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        switchTab(btn.dataset.tab);
      });
    });

    // Run Logic Button
    if (DOM.btnRunModule) {
      DOM.btnRunModule.addEventListener("click", () => {
        const mod = MODULES_DATA.find(m => m.id === state.currentModuleId);
        if (mod) executeModule(mod);
      });
    }

    // Reset Inputs Button
    if (DOM.btnResetInputs) {
      DOM.btnResetInputs.addEventListener("click", () => {
        const mod = MODULES_DATA.find(m => m.id === state.currentModuleId);
        if (mod) {
          renderInputFields(mod);
          executeModule(mod);
        }
      });
    }

    // Copy Code Button
    if (DOM.btnCopyCode) {
      DOM.btnCopyCode.addEventListener("click", () => {
        const mod = MODULES_DATA.find(m => m.id === state.currentModuleId);
        if (mod) {
          navigator.clipboard.writeText(mod.code).then(() => {
            const originalText = DOM.btnCopyCode.textContent;
            DOM.btnCopyCode.textContent = "✓ Copied!";
            setTimeout(() => {
              DOM.btnCopyCode.textContent = originalText;
            }, 2000);
          });
        }
      });
    }

    // Run Python WASM Button
    if (DOM.btnRunPythonWasm) {
      DOM.btnRunPythonWasm.addEventListener("click", runCodeInPythonWasm);
    }
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Start app when DOM is ready
  document.addEventListener("DOMContentLoaded", init);
})();
