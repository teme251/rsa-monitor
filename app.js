// ===== Weights & Checklist (1–10 ratings) =====
const WEIGHTS = {
  customerInteraction: 0.2,
  upsellCompliance: 0.25,
  productKnowledge: 0.15,
  transparencyEthics: 0.2,
  efficiency: 0.1,
  teamCollab: 0.1,
};

const CHECKLIST_ITEMS = [
  "Greeted customer warmly within 10 seconds",
  "Verified driver’s license & payment method clearly",
  "Disclosed insurance options neutrally (no pressure)",
  "Explained fuel/EV charging policy accurately",
  "Offered appropriate upgrade only if beneficial",
  "Reviewed total cost and taxes before payment",
  "Asked for additional questions, closed courteously"
];

// ===== Demo Data (1–10 scale) =====
const DATA = [
  {
    name: "John Smith",
    shift: "Morning",
    customersServed: 27,
    lastEvaluated: "2025-10-28",
    scores: { customerInteraction: 9, upsellCompliance: 8, productKnowledge: 8, transparencyEthics: 9, efficiency: 8, teamCollab: 9 },
    checklist: [true,true,true,true,false,true,true],
    notes: "Excellent tone and clarity. Offered GPS only when relevant. Could propose upgrades a bit more confidently."
  },
  {
    name: "Amina Yusuf",
    shift: "Evening",
    customersServed: 22,
    lastEvaluated: "2025-10-27",
    scores: { customerInteraction: 8, upsellCompliance: 9, productKnowledge: 9, transparencyEthics: 8, efficiency: 8, teamCollab: 8 },
    checklist: [true,true,true,true,true,true,true],
    notes: "Strong product knowledge. Maintain neutral tone when discussing protection packages."
  },
  {
    name: "Carlos Rodriguez",
    shift: "Morning",
    customersServed: 30,
    lastEvaluated: "2025-10-29",
    scores: { customerInteraction: 6, upsellCompliance: 5, productKnowledge: 6, transparencyEthics: 6, efficiency: 7, teamCollab: 7 },
    checklist: [true,true,false,true,false,true,true],
    notes: "Avoid pushing upgrades. Focus on transparent disclosures and benefit-matching."
  },
  {
    name: "Li Wei",
    shift: "Evening",
    customersServed: 19,
    lastEvaluated: "2025-10-29",
    scores: { customerInteraction: 10, upsellCompliance: 10, productKnowledge: 9, transparencyEthics: 10, efficiency: 10, teamCollab: 10 },
    checklist: [true,true,true,true,true,true,true],
    notes: "Model behavior—balanced upsell and customer-first approach. Great efficiency."
  },
  {
    name: "Sarah Johnson",
    shift: "Overnight",
    customersServed: 14,
    lastEvaluated: "2025-10-26",
    scores: { customerInteraction: 8, upsellCompliance: 6, productKnowledge: 8, transparencyEthics: 8, efficiency: 6, teamCollab: 8 },
    checklist: [true,true,true,false,false,true,true],
    notes: "Ensure full disclosure on fuel/EV policies. Work on pacing during rush."
  },
  {
    name: "Mohammed Ali",
    shift: "Morning",
    customersServed: 24,
    lastEvaluated: "2025-10-28",
    scores: { customerInteraction: 5, upsellCompliance: 5, productKnowledge: 6, transparencyEthics: 6, efficiency: 6, teamCollab: 6 },
    checklist: [true,true,false,false,false,true,false],
    notes: "Coaching needed: neutral language and accurate policy explanations. Shadow Li for one shift."
  },
  {
    name: "Emily Davis",
    shift: "Evening",
    customersServed: 26,
    lastEvaluated: "2025-10-28",
    scores: { customerInteraction: 8, upsellCompliance: 8, productKnowledge: 8, transparencyEthics: 8, efficiency: 8, teamCollab: 8 },
    checklist: [true,true,true,true,true,true,true],
    notes: "Consistent performer. Keep up the balanced approach."
  },
  {
    name: "Noah Brown",
    shift: "Morning",
    customersServed: 18,
    lastEvaluated: "2025-10-27",
    scores: { customerInteraction: 6, upsellCompliance: 6, productKnowledge: 6, transparencyEthics: 6, efficiency: 6, teamCollab: 6 },
    checklist: [true,true,true,false,false,true,true],
    notes: "Neutral. Improve clarity on costs and fuel policy; avoid assumed add-ons."
  }
];

// ===== Scoring Helpers (normalize 1–10 to 0–100 using weights) =====
function weightedScore(s) {
  let sum = 0;
  for (const [k, w] of Object.entries(WEIGHTS)) {
    const v = s[k] ?? 0; // 1–10
    sum += (v / 10) * w; // normalize by 10
  }
  return +(sum * 100).toFixed(1); // scale to 0–100
}

function statusFromScore(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "On Track";
  return "Needs Coaching";
}

function fmt(n){ return new Intl.NumberFormat().format(n); }

function computeStrengths(scores){
  return Object.entries(scores)
    .filter(([k,v]) => v >= 9)
    .map(([k]) => labelFor(k));
}
function computeImprovements(scores){
  return Object.entries(scores)
    .filter(([k,v]) => v <= 6)
    .map(([k]) => labelFor(k));
}

function labelFor(key){
  return {
    customerInteraction: "Customer Interaction",
    upsellCompliance: "Upselling Compliance (policy-aligned)",
    productKnowledge: "Product Knowledge",
    transparencyEthics: "Transparency & Ethics",
    efficiency: "Efficiency",
    teamCollab: "Team Collaboration"
  }[key] || key;
}

// ===== Render Table =====
let sortKey = "overall", sortDir = "desc", filtered = DATA.slice();

function render(){
  // Compute derived
  const rows = filtered.map(item => {
    const overall = weightedScore(item.scores);
    return {...item, overall, status: statusFromScore(overall)};
  }).sort((a,b)=>{
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name" || sortKey === "shift" || sortKey === "status") {
      return a[sortKey].localeCompare(b[sortKey]) * dir;
    }
    return (a[sortKey] - b[sortKey]) * dir;
  });

  // KPIs
  const avg = rows.reduce((acc,r)=>acc+r.overall,0) / (rows.length || 1);
  const excellent = rows.filter(r=>r.status==="Excellent").length;
  const needs = rows.filter(r=>r.status==="Needs Coaching").length;
  document.getElementById("kpiAssociates").textContent = fmt(rows.length);
  document.getElementById("kpiAvgScore").textContent = isFinite(avg)? avg.toFixed(1): "—";
  document.getElementById("kpiExcellent").textContent = fmt(excellent);
  document.getElementById("kpiNeeds").textContent = fmt(needs);

  // Body
  const tbody = document.getElementById("rsaTbody");
  tbody.innerHTML = "";
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.shift}</td>
      <td>${fmt(r.customersServed)}</td>
      <td><span class="score">${r.overall.toFixed(1)}</span></td>
      <td>${statusBadge(r.status)}</td>
      <td>${r.lastEvaluated}</td>
    `;
    tr.addEventListener("click", ()=> openDrawer(r));
    tbody.appendChild(tr);
  });

  document.getElementById("emptyState").style.display = rows.length ? "none" : "block";
}

function statusBadge(status){
  if (status === "Excellent") return `<span class="badge excellent">Excellent</span>`;
  if (status === "Needs Coaching") return `<span class="badge needs">Needs Coaching</span>`;
  return `<span class="badge track">On Track</span>`;
}

// ===== Filters & Sorting =====
function applyFilters(){
  const q = document.getElementById("search").value.toLowerCase();
  const shift = document.getElementById("shiftFilter").value;
  const stat = document.getElementById("statusFilter").value;
  filtered = DATA.filter(d => {
    const matchName = d.name.toLowerCase().includes(q);
    const matchShift = !shift || d.shift === shift;
    const overall = weightedScore(d.scores);
    const status = statusFromScore(overall);
    const matchStatus = !stat || status === stat;
    return matchName && matchShift && matchStatus;
  });
  render();
}

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("shiftFilter").addEventListener("change", applyFilters);
document.getElementById("statusFilter").addEventListener("change", applyFilters);
document.getElementById("resetBtn").addEventListener("click", ()=>{
  document.getElementById("search").value = "";
  document.getElementById("shiftFilter").value = "";
  document.getElementById("statusFilter").value = "";
  filtered = DATA.slice();
  render();
});

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", ()=>{
    const key = th.getAttribute("data-sort");
    if (sortKey === key) sortDir = sortDir === "asc" ? "desc" : "asc";
    else { sortKey = key; sortDir = "desc"; }
    render();
  });
});

// ===== Drawer =====
const drawer = document.getElementById("detailDrawer");
document.getElementById("closeDrawer").addEventListener("click", ()=> drawer.classList.remove("open"));

function openDrawer(row){
  drawer.classList.add("open");
  document.getElementById("drawerName").textContent = row.name;
  document.getElementById("drawerShift").textContent = row.shift;
  const overall = weightedScore(row.scores);
  document.getElementById("drawerStatus").textContent = statusFromScore(overall);
  document.getElementById("drawerScore").textContent = `Score: ${overall.toFixed(1)}`;

  // Metrics
  const metricList = document.getElementById("metricList");
  metricList.innerHTML = "";
  const labels = Object.keys(WEIGHTS);
  labels.forEach(k => {
    const li = document.createElement("li");
    const label = labelFor(k);
    const val = row.scores[k] ?? 0;
    li.innerHTML = `<span class="metric-label">${label}</span><span class="metric-score">${val}/10</span>`;
    metricList.appendChild(li);
  });

  // Checklist
  const cl = document.getElementById("checklist");
  cl.innerHTML = "";
  CHECKLIST_ITEMS.forEach((txt, idx) => {
    const li = document.createElement("li");
    const checked = !!row.checklist?.[idx];
    li.innerHTML = `<input type="checkbox" disabled ${checked ? "checked": ""} /><span>${txt}</span>`;
    cl.appendChild(li);
  });

  // Strengths & Improvements
  const strengths = computeStrengths(row.scores);
  const improves = computeImprovements(row.scores);
  const sUL = document.getElementById("strengthsList");
  const iUL = document.getElementById("improveList");
  sUL.innerHTML = strengths.length ? strengths.map(t=>`<li>${t}</li>`).join("") : "<li>—</li>";
  iUL.innerHTML = improves.length ? improves.map(t=>`<li>${t}</li>`).join("") : "<li>—</li>";

  // Notes
  document.getElementById("drawerNotes").textContent = row.notes || "—";
}

// Initial render
render();
