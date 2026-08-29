const DISCORD_URL="https://discord.gg/2Fk9XUjEy";
const ADMIN_PASSWORD="CHANGE-THIS-TO-YOUR-PRIVATE-PASSWORD";

const blankLevels=Array.from({length:75},(_,i)=>({
  rank:i+1,name:"",creator:"",verifier:"",publisher:"",
  points:"",id:"",password:"",qualify:"",video:""
}));

let levels=JSON.parse(localStorage.getItem("bbtsl_levels")||"null")||blankLevels;
let current=0;

const app=document.getElementById("app");

function esc(v){
  return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function save(){localStorage.setItem("bbtsl_levels",JSON.stringify(levels));}

function sidebar(){
  return `<aside class="levels">
    <div class="search">Search levels...</div>
    <div id="levels">${levels.map((l,i)=>`
      <button class="level ${i===current?"active":""}" data-i="${i}">
        <span class="num">#${i+1}</span><span>${esc(l.name||"Empty slot")}</span>
      </button>`).join("")}</div>
  </aside>`;
}
function rightbar(){
  return `<aside class="right">
    <div class="card"><h3>List Editors</h3>
      <div class="editor"><span class="avatar">K</span><div><b>Krøwn</b><small>List Editor</small></div></div>
    </div>
    <div class="card"><h3>Submission Requirements</h3>
      <p>• Submit a clear video of the attempt.</p>
      <p>• No cheats or unauthorized modifications.</p>
      <p>• The record must be verifiable.</p>
      <p>• Submit records through the official Discord.</p>
    </div>
  </aside>`;
}
function listPage(){
  const l=levels[current];
  return `<div class="page">${sidebar()}<main class="main">
    <div class="title"><div class="eyebrow">BEAT BOUNCE TOP STAR LIST</div>
      <h1>${esc(l.name||"Empty Level Slot")}</h1>
      <span class="rank">#${current+1}</span>
    </div>
    <div class="people">
      <div><label>CREATOR</label><span>${esc(l.creator||"—")}</span></div>
      <div><label>VERIFIER</label><span>${esc(l.verifier||"—")}</span></div>
      <div><label>PUBLISHER</label><span>${esc(l.publisher||"—")}</span></div>
    </div>
    <div class="video">${l.video?`<a href="${esc(l.video)}" target="_blank" rel="noopener">▶ Watch YouTube</a>`:"<span>No video added</span>"}</div>
    <div class="info">
      <div><label>POINTS WHEN COMPLETED</label><strong>${esc(l.points||"—")}</strong></div>
      <div><label>ID</label><strong>${esc(l.id||"—")}</strong></div>
      <div><label>PASSWORD</label><strong>${esc(l.password||"—")}</strong></div>
    </div>
    <section><div class="section-head"><h2>Records</h2><span>${esc(l.qualify||"No requirement set")}</span></div>
      <div class="table"><div class="tr th"><span>#</span><span>PLAYER</span><span>PROGRESS</span></div>
      <div class="tr"><span>—</span><span>No records yet</span><span>—</span></div></div>
    </section>
  </main>${rightbar()}</div>`;
}
function leaderboardPage(){
  return `<div class="center"><h1>Leaderboard</h1>
    <p>Player rankings will appear here when BBTSL records are added.</p>
    <div class="table"><div class="tr th"><span>#</span><span>PLAYER</span><span>POINTS</span></div>
    <div class="tr"><span>—</span><span>No players yet</span><span>—</span></div></div>
  </div>`;
}
function submitPage(){
  return `<div class="center"><h1>Submit Record</h1>
    <p>Read the requirements, then submit your record directly to the BBTSL Discord.</p>
    <a class="discord" href="${DISCORD_URL}" target="_blank" rel="noopener">Open BBTSL Discord</a>
  </div>`;
}
function roulettePage(){
  return `<div class="center"><h1>Roulette</h1><p>Randomly select a level from #1–#75.</p>
    <button class="primary big" id="spin">Spin</button><div id="rouletteResult"></div>
  </div>`;
}
function render(page="list"){
  document.querySelectorAll(".navlink").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  app.innerHTML=page==="list"?listPage():page==="leaderboard"?leaderboardPage():page==="submit"?submitPage():roulettePage();

  document.querySelectorAll(".level").forEach(b=>b.onclick=()=>{
    current=Number(b.dataset.i); render("list");
  });
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>render(b.dataset.page));

  const spin=document.getElementById("spin");
  if(spin) spin.onclick=()=>{
    current=Math.floor(Math.random()*75);
    const l=levels[current];
    document.getElementById("rouletteResult").innerHTML=
      `<div class="roulette-result">#${current+1} — ${esc(l.name||"Empty Level Slot")}</div>`;
  };
}
render();

const modal=document.getElementById("adminModal");
document.getElementById("adminOpen").onclick=()=>modal.classList.remove("hidden");
document.getElementById("closeAdmin").onclick=()=>modal.classList.add("hidden");

document.getElementById("adminLogin").onclick=()=>{
  if(document.getElementById("adminPassword").value!==ADMIN_PASSWORD){
    alert("Incorrect admin password.");
    return;
  }
  document.getElementById("adminPanel").classList.remove("hidden");
  fillSelect();
};
function fillSelect(){
  levelSelect.innerHTML=levels.map((l,i)=>`<option value="${i}">#${i+1} — ${esc(l.name||"Empty slot")}</option>`).join("");
  loadFields();
}
function loadFields(){
  const l=levels[Number(levelSelect.value)];
  editName.value=l.name; editCreator.value=l.creator; editVerifier.value=l.verifier;
  editPublisher.value=l.publisher; editPoints.value=l.points; editId.value=l.id;
  editPassword.value=l.password; editQualify.value=l.qualify; editVideo.value=l.video;
}
levelSelect.onchange=loadFields;
saveLevel.onclick=()=>{
  const i=Number(levelSelect.value),l=levels[i];
  l.name=editName.value.trim();l.creator=editCreator.value.trim();l.verifier=editVerifier.value.trim();
  l.publisher=editPublisher.value.trim();l.points=editPoints.value.trim();l.id=editId.value.trim();
  l.password=editPassword.value.trim();l.qualify=editQualify.value.trim();l.video=editVideo.value.trim();
  save();current=i;fillSelect();render("list");alert("Level saved.");
};
clearLevel.onclick=()=>{
  const i=Number(levelSelect.value);
  levels[i]={rank:i+1,name:"",creator:"",verifier:"",publisher:"",points:"",id:"",password:"",qualify:"",video:""};
  save();fillSelect();render("list");
};

const themeToggle=document.getElementById("themeToggle");
if(localStorage.getItem("bbtsl_theme")==="dark") document.body.classList.add("dark");
themeToggle.textContent=document.body.classList.contains("dark")?"☀":"◐";
themeToggle.onclick=()=>{
  document.body.classList.toggle("dark");
  const dark=document.body.classList.contains("dark");
  localStorage.setItem("bbtsl_theme",dark?"dark":"light");
  themeToggle.textContent=dark?"☀":"◐";
};
