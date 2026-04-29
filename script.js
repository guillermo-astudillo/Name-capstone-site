const steps = ["Learn", "Start", "Map", "Decide", "Act", "Track"];

const scenarioCopy = {
  applications: {
    title: "Applications or career review",
    objective: "Prepare a cleaner digital identity before school, job, fellowship, housing, or professional applications.",
    text: "Use this path when you want to understand what someone may see before making a decision about you.",
  },
  collision: {
    title: "Wrong-person result",
    objective: "Separate your identity from a result that may belong to someone else.",
    text: "Use this path when a search result appears under your name but may refer to another person.",
  },
  cleanup: {
    title: "General privacy cleanup",
    objective: "Reduce unnecessary exposure from old profiles, data broker pages, and stale public traces.",
    text: "Use this path when the information may be accurate but feels too visible or no longer useful.",
  },
};

const exampleTraces = [
  {
    id: 1,
    title: "Outdated student profile",
    source: "University or program page",
    type: "Institutional",
    confidence: "High confidence",
    risk: "Medium",
    summary: "An old biography, outdated affiliation, or unused email still appears when your name is searched before applications.",
    action: "Correction packet",
  },
  {
    id: 2,
    title: "People-search broker listing",
    source: "Data broker",
    type: "Broker",
    confidence: "High confidence",
    risk: "High",
    summary: "A broker page displays contact details, location history, relatives, or other personal information that may increase exposure.",
    action: "Removal request",
  },
  {
    id: 3,
    title: "Wrong-person article",
    source: "News archive or search result",
    type: "Search result",
    confidence: "Uncertain match",
    risk: "High",
    summary: "A result appears near your name but may refer to another person. NAME marks this as uncertain before any request is created.",
    action: "Correction packet",
  },
  {
    id: 4,
    title: "Old social profile",
    source: "Social platform",
    type: "Social",
    confidence: "Medium confidence",
    risk: "Low",
    summary: "An inactive account, old handle, or public profile still appears in search and may no longer represent you.",
    action: "Preventive settings",
  },
];

const state = {
  currentStep: 0,
  scenario: "applications",
  selectedId: 2,
  decision: "limit",
};

function selectedTrace() {
  return exampleTraces.find((item) => item.id === state.selectedId) || exampleTraces[0];
}

function actionPlan() {
  const trace = selectedTrace();
  if (state.decision === "keep") {
    return [
      "Keep this trace attached to your public identity for now.",
      "Add a note explaining why it still represents you accurately.",
      "Set a reminder to review it again before your next application cycle.",
    ];
  }
  if (state.decision === "limit") {
    return [
      "Reduce visibility where the source allows it.",
      "Change profile, indexing, or privacy settings when available.",
      "Track whether the trace becomes less prominent over time.",
    ];
  }
  return [
    `Prepare a ${trace.action.toLowerCase()} with clear evidence.`,
    "Collect screenshots, URLs, dates, and proof that the information concerns you or is wrongly connected to you.",
    "Submit the request, record the date, and follow up if the source does not respond.",
  ];
}

function badgeClass(risk) {
  if (risk === "High") return "badge red";
  if (risk === "Medium") return "badge amber";
  return "badge green";
}

function flowDescription() {
  if (state.currentStep === 0) return "Learn what NAME can do: organize your digital identity repair without promising universal deletion.";
  if (state.currentStep === 1) return scenarioCopy[state.scenario].text;
  if (state.currentStep === 2) return "Map the traces attached to your name, including source, risk, priority, and confidence level.";
  if (state.currentStep === 3) return "Decide whether each trace should be kept, limited, or severed from your searchable identity.";
  if (state.currentStep === 4) return "Choose a pathway: removal, correction, de-indexing, broker opt-out, settings, or adviser handoff.";
  return "Track what you submitted, what evidence you used, when to follow up, and what to export.";
}

function renderStepButtons() {
  const container = document.getElementById("step-buttons");
  container.innerHTML = "";
  steps.forEach((step, index) => {
    const btn = document.createElement("button");
    btn.className = `step-btn ${state.currentStep === index ? "active" : ""}`;
    btn.innerHTML = `<span class="step-index">${index + 1}</span>${step}`;
    btn.onclick = () => {
      state.currentStep = index;
      render();
    };
    container.appendChild(btn);
  });
}

function renderScenarios() {
  const container = document.getElementById("scenario-buttons");
  container.innerHTML = "";
  Object.entries(scenarioCopy).forEach(([key, value]) => {
    const btn = document.createElement("button");
    btn.className = `scenario-btn ${state.scenario === key ? "active" : ""}`;
    btn.innerHTML = `<div class="scenario-title">${value.title}</div><div class="scenario-text">${value.text}</div>`;
    btn.onclick = () => {
      state.scenario = key;
      state.currentStep = 1;
      render();
    };
    container.appendChild(btn);
  });
}

function renderTraces() {
  const container = document.getElementById("trace-list");
  container.innerHTML = "";
  exampleTraces.forEach((item) => {
    const card = document.createElement("button");
    card.className = `trace-card ${state.selectedId === item.id ? "active" : ""}`;
    card.innerHTML = `
      <div class="row between start gap16">
        <div class="trace-title">${item.title}</div>
        <span class="${badgeClass(item.risk)}">${item.risk} priority</span>
      </div>
      <div class="trace-meta">
        <span>${item.source}</span><span>•</span><span>${item.type}</span><span>•</span><span>${item.confidence}</span>
      </div>
      <div class="trace-summary">${item.summary}</div>
    `;
    card.onclick = () => {
      state.selectedId = item.id;
      state.currentStep = 2;
      render();
    };
    container.appendChild(card);
  });
}

function renderSelected() {
  const trace = selectedTrace();
  document.getElementById("selected-title").textContent = trace.title;
  const confidence = document.getElementById("selected-confidence");
  confidence.textContent = trace.confidence;
  confidence.className = trace.confidence.includes("Uncertain") ? "badge amber" : "badge blue";
  document.getElementById("selected-summary").textContent = trace.summary;
  document.getElementById("selected-source").textContent = trace.source;
  document.getElementById("selected-action").textContent = trace.action;
}

function renderDecisions() {
  const decisions = [
    ["keep", "Keep", "This still represents you and can remain visible."],
    ["limit", "Limit", "This may stay online, but should be less visible or less connected to your name."],
    ["sever", "Sever", "This should be corrected, removed, de-indexed, or separated from your identity."],
  ];
  const container = document.getElementById("decision-buttons");
  container.innerHTML = "";
  decisions.forEach(([value, title, text]) => {
    const btn = document.createElement("button");
    btn.className = `decision-btn ${state.decision === value ? "active" : ""}`;
    btn.innerHTML = `<div class="decision-title">${title}</div><div class="decision-text">${text}</div>`;
    btn.onclick = () => {
      state.decision = value;
      state.currentStep = 3;
      render();
    };
    container.appendChild(btn);
  });
}

function renderPlan() {
  const trace = selectedTrace();
  const scenario = scenarioCopy[state.scenario];
  document.getElementById("plan-objective").textContent = scenario.objective;
  document.getElementById("plan-trace").textContent = trace.title;
  document.getElementById("plan-decision").textContent = state.decision === "keep" ? "Keep" : state.decision === "limit" ? "Limit" : "Sever";
  const container = document.getElementById("plan-steps");
  container.innerHTML = "";
  actionPlan().forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "plan-step";
    row.innerHTML = `<div class="plan-step-index">${index + 1}</div><div class="plan-text">${item}</div>`;
    container.appendChild(row);
  });
}

function renderFlow() {
  document.getElementById("current-flow").textContent = steps[state.currentStep];
  document.getElementById("flow-description").textContent = flowDescription();
}

function renderHeroButtons() {
  document.querySelectorAll("[data-step]").forEach((btn) => {
    btn.onclick = () => {
      state.currentStep = Number(btn.getAttribute("data-step"));
      render();
    };
  });
}

function render() {
  renderFlow();
  renderStepButtons();
  renderScenarios();
  renderTraces();
  renderSelected();
  renderDecisions();
  renderPlan();
}

renderHeroButtons();
render();
