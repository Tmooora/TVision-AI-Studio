// ==========================
// عناصر أساسية
// ==========================
let fileInput = document.getElementById("fileInput");
let promptInput = document.getElementById("prompt");
let preset = document.getElementById("preset");
let tUpload = document.getElementById("tUpload");
let tPrompt = document.getElementById("tPrompt");
let preview = document.getElementById("preview");
let log = document.getElementById("log");
let creditsEl = document.getElementById("credits");
let timeline = document.getElementById("timeline");
let projectList = document.getElementById("projectList");

let credits = localStorage.getItem("credits") || 20;
creditsEl.innerText = credits;

let projects = JSON.parse(localStorage.getItem("projects")) || {};
let currentProject = null;
let isEn = false;

// ==========================
// رفع الملفات
// ==========================
fileInput.onchange = e => {
  let file = e.target.files[0];
  showPreview(file);
  logMsg("✔ ملف مرفوع: " + file.name);
  saveSession();
};

function showPreview(file){
  preview.innerHTML="";
  if(file.type.startsWith("image")){
    let img=document.createElement("img");
    img.src=URL.createObjectURL(file);
    img.onload=()=>{preview.appendChild(img);addWatermark();addTimelineItem(file.name);}
  } else {
    let v=document.createElement("video");
    v.src=URL.createObjectURL(file);
    v.controls=true;
    preview.appendChild(v);
    addTimelineItem(file.name);
  }
}

// ==========================
// وظائف الأزرار
// ==========================
document.getElementById("runAI").addEventListener("click", ()=>{
  if(credits<=0){alert("خلصت Credits"); return;}
  credits--; localStorage.setItem("credits",credits);
  creditsEl.innerText=credits;
  logMsg("🤖 AI Processing: "+promptInput.value);
  saveSession();
});

document.getElementById("applyPreset").addEventListener("click", ()=>{
  let p=preset.value;
  if(p!="اختر Preset / Choose Preset"){logMsg("🎨 Preset Applied: "+p);}
});

document.getElementById("grayscale").addEventListener("click", ()=>{
  let img=preview.querySelector("img");
  if(!img){alert("No image");return;}
  let c=document.createElement("canvas");
  let x=c.getContext("2d");
  c.width=img.width;c.height=img.height;
  x.drawImage(img,0,0);
  let d=x.getImageData(0,0,c.width,c.height);
  for(let i=0;i<d.data.length;i+=4){
    let avg=(d.data[i]+d.data[i+1]+d.data[i+2])/3;
    d.data[i]=d.data[i+1]=d.data[i+2]=avg;
  }
  x.putImageData(d,0,0);
  preview.innerHTML=""; preview.appendChild(c); addWatermark();
  logMsg("⚫ تحويل أبيض وأسود");
});

document.getElementById("speakPrompt").addEventListener("click", ()=>{
  let utter=new SpeechSynthesisUtterance(promptInput.value);
  utter.lang=isEn?'en-US':'ar-SA';
  speechSynthesis.speak(utter);
});

// ==========================
// Timeline
// ==========================
function addTimelineItem(name){
  let t=document.createElement("div");
  t.className="timeline-item"; t.innerText=name;
  timeline.appendChild(t);
}

// ==========================
// إدارة المشاريع
// ==========================
function saveSession(){
  if(!currentProject) currentProject="Project_"+Date.now();
  projects[currentProject]={prompt:promptInput.value};
  localStorage.setItem("projects",JSON.stringify(projects));
  updateProjectList();
}

function updateProjectList(){
  projectList.innerHTML="";
  for(let p in projects){
    let o=document.createElement("option"); o.innerText=p; projectList.appendChild(o);
  }
}

document.getElementById("loadProject").addEventListener("click", ()=>{
  let p=projectList.value;
  if(!p)return; alert("Loaded: "+p);
  promptInput.value=projects[p].prompt;
  currentProject=p;
  logMsg("📂 تم تحميل المشروع: "+p);
});

document.getElementById("newProject").addEventListener("click", ()=>{
  currentProject="Project_"+Date.now(); promptInput.value=""; logMsg("🆕 مشروع جديد"); saveSession();
});

document.getElementById("deleteProject").addEventListener("click", ()=>{
  let p=projectList.value;
  if(!p){alert("اختر مشروع"); return;}
  delete projects[p];
  localStorage.setItem("projects",JSON.stringify(projects));
  updateProjectList();
  logMsg("🗑️ تم حذف المشروع: "+p);
});

// ==========================
// Export
// ==========================
document.getElementById("exportImage").addEventListener("click", ()=>{
  alert("🚀 Image Exported (Simulation)");
  logMsg("📦 Image Exported");
});

document.getElementById("exportVideo").addEventListener("click", ()=>{
  alert("🚀 Video Exported (Simulation)");
  logMsg("📦 Video Exported");
});

// ==========================
// Language toggle
// ==========================
document.getElementById("langToggle").addEventListener("click", ()=>{
  isEn=!isEn;
  tUpload.innerText=isEn?"Upload File":"📂 ارفع ملفك";
  tPrompt.innerText=isEn?"Describe Your Idea":"🧠 صف فكرتك";
  logMsg(isEn?"🌐 Language switched to English":"🌐 تم التحويل للعربية");
});

// ==========================
// Tabs
// ==========================
document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".panel").forEach(p=>p.style.display="none");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).style.display="block";
  });
});

// =================  currentProject="Project_"+Date.now(); promptInput.value=""; logMsg("🆕 مشروع جديد"); saveSession();
});

document.getElementById("deleteProject").addEventListener("click", ()=>{
  let p=projectList.value;
  if(!p){alert("اختر مشروع"); return;}
  delete projects[p];
  localStorage.setItem("projects",JSON.stringify(projects));
  updateProjectList();
  logMsg("🗑️ تم حذف المشروع: "+p);
});

// Export
document.getElementById("exportImage").addEventListener("click", ()=>{
  alert("🚀 Image Exported (Simulation)");
  logMsg("📦 Image Exported");
});

document.getElementById("exportVideo").addEventListener("click", ()=>{
  alert("🚀 Video Exported (Simulation)");
  logMsg("📦 Video Exported");
});

// Language toggle
document.getElementById("langToggle").addEventListener("click", ()=>{
  isEn=!isEn;
  tUpload.innerText=isEn?"Upload File":"📂 ارفع ملفك";
  tPrompt.innerText=isEn?"Describe Your Idea":"🧠 صف فكرتك";
});

// Tabs
document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".panel").forEach(p=>p.style.display="none");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).style.display="block";
  });
});

// Log helper
function logMsg(msg){
  let p=document.createElement("p");
  p.innerText=new Date().toLocaleTimeString()+" - "+msg;
  log.appendChild(p); log.scrollTop=log.scrollHeight;
}

function addWatermark(){
  let w=document.createElement("div");
  w.id="w
