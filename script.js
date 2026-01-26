let file, projects = {}, currentProject = null;
let preview = document.getElementById("preview");
let log = document.getElementById("log");
let creditsEl = document.getElementById("credits");
let credits = localStorage.getItem("credits") || 20;
creditsEl.innerText = credits;
let timeline = document.getElementById("timeline");
let projectList = document.getElementById("projectList");

fileInput.onchange = e => {
  file = e.target.files[0];
  showPreview(file);
  logMsg("✔ ملف مرفوع: " + file.name);
  saveSession();
};

function showPreview(file) {
  preview.innerHTML = "";
  if (file.type.startsWith("image")) {
    let img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      preview.appendChild(img);
      addWatermark();
      addTimelineItem(file.name);
    };
  } else {
    let v = document.createElement("video");
    v.src = URL.createObjectURL(file);
    v.controls = true;
    preview.appendChild(v);
    addTimelineItem(file.name);
  }
}

function runAI() {
  if (credits <= 0) { alert("خلصت Credits"); return; }
  credits--; localStorage.setItem("credits", credits);
  creditsEl.innerText = credits;
  logMsg("🤖 AI Processing: " + prompt.value);
  saveSession();
}

function applyPreset() {
  let p = preset.value;
  if (p != "اختر Preset / Choose Preset") {
    logMsg("🎨 Preset Applied: " + p);
  }
}

function grayscale() {
  let img = preview.querySelector("img");
  if (!img) { alert("No image"); return; }
  let c = document.createElement("canvas");
  let x = c.getContext("2d");
  c.width = img.width; c.height = img.height;
  x.drawImage(img, 0, 0);
  let d = x.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < d.data.length; i += 4) {
    let avg = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = avg;
  }
  x.putImageData(d, 0, 0);
  preview.innerHTML = ""; preview.appendChild(c); addWatermark();
  logMsg("⚫ تحويل أبيض وأسود");
}

function logMsg(msg) {
  let p = document.createElement("p");
  p.innerText = new Date().toLocaleTimeString() + " - " + msg;
  log.appendChild(p); log.scrollTop = log.scrollHeight;
}

function addWatermark() {
  let w = document.createElement("div");
  w.id = "wmark";
  w.innerText = "TVision Alpha";
  preview.appendChild(w);
}

function speakPrompt() {
  let utter = new SpeechSynthesisUtterance(prompt.value);
  utter.lang = isEn ? 'en-US' : 'ar-SA';
  speechSynthesis.speak(utter);
}

function addTimelineItem(name) {
  let t = document.createElement("div");
  t.className = "timeline-item";
  t.innerText = name;
  timeline.appendChild(t);
}

function saveSession() {
  if (!currentProject) currentProject = "Project_" + Date.now();
  projects[currentProject] = { prompt: prompt.value };
  localStorage.setItem("projects", JSON.stringify(projects));
  updateProjectList();
}

function updateProjectList() {
  projectList.innerHTML = "";
  for (let p in projects) {
    let o = document.createElement("option");
    o.innerText = p;
    projectList.appendChild(o);
  }
}

function loadProject() {
  let p = projectList.value;
  if (!p) return;
  alert("Loaded: " + p);
  prompt.value = projects[p].prompt;
  currentProject = p;
}

function newProject() {
  currentProject = "Project_" + Date.now();
  prompt.value = "";
  logMsg("🆕 مشروع جديد");
  saveSession();
}

function deleteProject() {
  let p = projectList.value;
  if (!p) return alert("اختر مشروع");
}

function exportImage() {
  alert("🚀 Image Exported (Simulation)");
  logMsg("📦 Image Exported");
}

function exportVideo() {
  alert("🚀 Video Exported (Simulation)");
  logMsg("📦 Video Exported");
}

let isEn = false;
function toggleLanguage() {
  isEn = !isEn;
  tUpload.innerText = isEn ? "Upload File" : "📂 ارفع ملفك";
  tPrompt.innerText = isEn ? "Describe Your Idea" : "🧠 صف فكرتك";
}
