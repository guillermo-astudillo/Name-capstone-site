const steps = ["Profile", "Scenario", "Identity Map", "Decide", "Action Plan"];
const scenarioCopy = {
  applications: {
    title: "Application cleanup",
    text: "Prepare a cleaner public identity before graduate, job, fellowship, or housing applications.",
  },
  collision: {
    title: "Wrong-person collision",
    text: "Separate your identity from results that likely belong to somebody else.",
  },
  cleanup: {
    title: "General privacy cleanup",
    text: "Reduce visibility of old profiles, broker listings, and stale public traces.",
  },
};

const fakeResults = [
  {
    id: 1,
    title: "Old student profile",
    source: "University Directory",
    type: "Institutional",
    confidence: "High confidence",
    risk: "Medium",
    summary: "Outdated biography and old email still appear when your name is searched.",
    action: "Correction packet",
  },
  {
    id: 2,
    title: "People-search listing",
    source: "Data Broker",
    type: "Broker",
    confidence: "High confidence",
    risk: "High",
    summary: "Home-city history and contact details are visible in an aggregator listing.",
    action: "Removal request",
  },
  {
    id: 3,
    title: "Wrong-person criminal article",
    source: "News Archive",
    type: "Search Result",
    confidence: "Uncertain match",
    risk: "High",
    summary: "A result appears attached to your name but likely refers to another person.",
    action: "Correction packet",
  },
  {
    id: 4,
    title: "Old X account",
    source: "Social Platform",
    type: "Social",
    confidence: "Medium confidence",
    risk: "Low",
    summary: "An inactive social account from years ago is still indexed in search.",
    action: "Preventive settings",
  },
];

const state = {
  currentStep: 0,
  scenario: "applications",
  selectedId: 2,
  decision: "remove",
};

function selectedTrace() {
  return fakeResults.find((item) => item.id === state.selectedId) || fakeResults[0];
}

function actionPlan() {
  const trace = selectedTrace();
  if (state.decision === "keep") {
    return [
      "Keep trace attached to identity record",
      "Add note explaining why it remains relevant",
      "Monitor changes monthly",
    ];
  }
  if (state.decision === "limit") {
    return [
      "Reduce visibility where possible",
      "Adjust profile tags and indexing settings",
      "Track whether search position drops over time",
    ];
  }
  return [
    `Prepare ${trace.action.toLowerCase()}`,
    "Gather proof of identity and screenshots",
    "Submit request and track timeline",
  ];
}

function badgeClass(risk) {
  if (risk === "High") return "badge red";
  if (risk === "Medium") return "badge amber";
  return "badge green";
}

function flowDescription() {
  if (state.currentStep === 0) return "Users begin with a visible workflow and a concrete privacy objective.";
  if (state.currentStep === 1) return scenarioCopy[state.scenario].text;
  if (state.currentStep === 2) return "The identity map displays likely traces, uncertain matches, and where each item came from.";
  if (state.currentStep === 3) return "The decision layer turns judgment into a simple choice: keep, limit, or remove.";
  return "The action plan translates one selected trace into next steps and documentation needs.";
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
  fakeResults.forEach((item) => {
    const card = document.createElement("button");
    card.className = `trace-card ${state.selectedId === item.id ? "active" : ""}`;
    card.innerHTML = `
      <div class="row between start gap16">
        <div class="trace-title">${item.title}</div>
        <span class="${badgeClass(item.risk)}">${item.risk} risk</span>
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
    ["keep", "Keep", "This stays attached to your identity record."],
    ["limit", "Limit", "Reduce visibility and lower prominence."],
    ["remove", "Remove", "Challenge or remove the association."],
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
  document.getElementById("plan-trace").textContent = trace.title;
  document.getElementById("plan-decision").textContent = state.decision === "keep" ? "Keep" : state.decision === "limit" ? "Limit" : "Remove";
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
