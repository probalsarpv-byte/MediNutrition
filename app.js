
const state = {
  rows: [],
  counts: {},
  mode: localStorage.getItem("smn_mode") || "public",
  page: 1,
  pageSize: 30,
  browseType: "Allopathic",
  supplementCandidates: [],
  myMedicines: JSON.parse(localStorage.getItem("smn_meds_full") || "[]"),
  ddi: null
};

const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const norm=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/\s+/g," ").trim();

function setLoading(msg){
  let x=$("#loading");
  if(!x){
    document.body.insertAdjacentHTML("beforeend",`<div class="loading" id="loading"><div><div class="loader"></div><h2>Shuddho MedNutri</h2><p class="progress" id="loadingText"></p></div></div>`);
    x=$("#loading");
  }
  $("#loadingText").textContent=msg;
}
function removeLoading(){ $("#loading")?.remove(); }

function deriveCounts(rows){
  const c={total:rows.length,Allopathic:0,Ayurvedic:0,Unani:0,Herbal:0,Homeopathic:0};
  rows.forEach(r=>{const t=r.medicine_type||"Unknown"; c[t]=(c[t]||0)+1;});
  c.brands=new Set(rows.map(r=>norm(r.brand_name)).filter(Boolean)).size;
  c.generics=new Set(rows.map(r=>norm(r.generic_name)).filter(Boolean)).size;
  return c;
}
function makeSuppCandidates(rows){
  const rx=/(vitamin|multivit|mineral|calcium|magnesium|zinc|iron|ferrous|folic|folate|omega[- ]?3|fish oil|probiotic|lactobac|bifido|saccharomyces|biotin|coenzyme|coq|glucosamine|chondroitin|collagen|lysine|carnitine|inositol|melatonin|evening primrose|psyllium|electrolyte)/i;
  const seen=new Set(),out=[];
  for(const r of rows){
    if((r.medicine_type||"").toLowerCase()!=="allopathic")continue;
    const hay=[r.generic_name,r.brand_name,r.common_uses].join(" ");
    if(!rx.test(hay) && !/\bsupplements?\b/i.test(r.common_uses||""))continue;
    const k=[r.brand_name,r.generic_name,r.strength,r.dosage_form].map(norm).join("|");
    if(seen.has(k))continue;seen.add(k);out.push(r);
    if(out.length>=1000)break;
  }
  return out;
}
function searchRows(q,limit=14){
  q=norm(q); if(!q)return[];
  const out=[];
  for(const r of state.rows){
    const brand=norm(r.brand_name), gen=norm(r.generic_name), hay=r.__search||"";
    let score=0;
    if(brand===q||gen===q)score=120;
    else if(brand.startsWith(q))score=110;
    else if(gen.startsWith(q))score=105;
    else if(hay.includes(" "+q))score=80;
    else if(hay.includes(q))score=60;
    if(score){out.push({r,score}); if(out.length>180)break;}
  }
  return out.sort((a,b)=>b.score-a.score).slice(0,limit).map(x=>x.r);
}

function render(){
  const c=state.counts;
  $("#app").innerHTML=`
  <div class="shell">
    <header class="topbar">
      <div class="brand">SHUDDHO <span>MEDNUTRI</span></div>
      <nav class="nav">
        <button data-go="home">Home</button><button data-go="browse">Database</button><button data-go="supp">Supplements</button><button data-go="interaction">Interactions</button><button data-go="mylist">My List</button>
      </nav>
      <button class="ghost" id="modeBtn">${state.mode==="public"?"Public":"Professional"} Mode</button>
    </header>

    <section class="hero" id="home">
      <canvas id="heroCanvas"></canvas>
      <div class="hero-content">
        <span class="badge">FULL BANGLADESH MEDICINE REFERENCE CORPUS</span>
        <h1>Shuddho <span>MedNutri</span></h1>
        <p>Medicine, supplement, traditional medicine, interaction এবং nutrition intelligence — এক জায়গায়।</p>
        <div class="search-wrap">
          <input id="search" class="search" placeholder="একটি অক্ষর লিখুন — Brand, Generic, Manufacturer, Supplement..." autocomplete="off">
          <div id="suggest" class="suggest" hidden></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><h2>Database at a glance</h2><p>Live counts from the loaded corpus</p></div></div>
      <div class="grid">
        ${statCard("💊",c.total,"Total medicine rows","browse","Allopathic")}
        ${statCard("🏷️",c.brands,"Unique brand names","browse","Allopathic")}
        ${statCard("🧪",c.generics,"Unique generic names","browse","Allopathic")}
        ${statCard("🧴",state.supplementCandidates.length,"Nutrition / supplement candidates","supp","")}
        ${statCard("🪷",c.Ayurvedic||0,"Ayurvedic","browse","Ayurvedic")}
        ${statCard("🌙",c.Unani||0,"Unani","browse","Unani")}
        ${statCard("🌿",c.Herbal||0,"Herbal","browse","Herbal")}
        ${statCard("⚪",c.Homeopathic||0,"Homeopathic","browse","Homeopathic")}
      </div>
    </section>

    <section class="section" id="browse">
      <div class="section-head"><div><h2>Medicine Database</h2><p>Food Database-এর মতো group-wise browsing</p></div></div>
      <div class="panel">
        <div class="filters">
          <select id="typeFilter">
            ${["Allopathic","Ayurvedic","Unani","Herbal","Homeopathic"].map(x=>`<option ${state.browseType===x?"selected":""}>${x}</option>`).join("")}
          </select>
          <input id="browseSearch" placeholder="এই group-এর মধ্যে search">
        </div>
        <div id="browseList" class="list" style="margin-top:12px"></div>
        <div id="pager" class="pagination"></div>
      </div>
    </section>

    <section class="section" id="supp">
      <div class="section-head"><div><h2>Supplement / Nutrition Formulations</h2><p>1000 nutrition-related formulation candidates from the Bangladesh corpus</p></div></div>
      <div class="notice">এই section-এর কিছু item medicine corpus থেকে nutrition-formulation keyword দিয়ে শনাক্ত করা। Regulatory dietary-supplement status আলাদাভাবে verify করতে হবে।</div>
      <div id="suppList" class="list" style="margin-top:12px"></div>
    </section>

    <section class="section" id="interaction">
      <div class="section-head"><div><h2>Drug–Drug Interaction Checker</h2><p>FDA DailyMed-derived 2026 DDI dataset lazy-load হবে</p></div></div>
      <div class="panel cols">
        <div>
          <input id="ddiA" placeholder="Generic 1, যেমন metformin">
          <br><br>
          <input id="ddiB" placeholder="Generic 2">
          <div style="margin-top:12px"><button class="primary" id="ddiBtn">Check Interaction</button></div>
        </div>
        <div id="ddiResult" class="list"><div class="row"><small>দুটি generic name লিখুন। Interaction dataset প্রয়োজন হলে তখনই load হবে।</small></div></div>
      </div>
    </section>

    <section class="section" id="mylist">
      <div class="section-head"><div><h2>My Medicine List</h2><p>Public user বা clinician — browser-এ locally save হবে</p></div></div>
      <div class="panel" id="myListPanel">${myListHTML()}</div>
    </section>

    <section class="section">
      <div class="notice">
        <b>Data provenance:</b> Bangladesh medicine corpus is loaded from the Medora consolidated reference corpus. It must not be described as an official DGDA database.
        Some source fields are directory/search metadata and should not be treated as individualized prescribing guidance.
      </div>
    </section>

    <div class="footer">© Shuddho Academy • Medicine reference + supplement/nutrition intelligence • Educational decision support only.</div>
  </div>
  <div class="bottom">
    <button data-go="home"><b>⌂</b>Home</button><button id="bottomSearch"><b>⌕</b>Search</button><button data-go="browse"><b>💊</b>Database</button><button data-go="mylist"><b>🧾</b>My List</button>
  </div>`;
  bind();
  renderBrowse();
  renderSupp();
}
function statCard(icon,n,label,target,type){
  return `<article class="card"><div class="icon">${icon}</div><div class="kpi">${Number(n||0).toLocaleString()}<small>${esc(label)}</small></div><button class="primary" data-stat-target="${target}" data-stat-type="${esc(type)}">Explore</button></article>`;
}
function bind(){
  $("#modeBtn").onclick=()=>{state.mode=state.mode==="public"?"professional":"public";localStorage.setItem("smn_mode",state.mode);render();initThree();};
  $$("#search").forEach(()=>{});
  $("#search").oninput=e=>showSuggest(e.target.value);
  $("#search").onkeydown=e=>{if(e.key==="Escape")$("#suggest").hidden=true};
  $("#typeFilter").onchange=e=>{state.browseType=e.target.value;state.page=1;renderBrowse()};
  $("#browseSearch").oninput=()=>{state.page=1;renderBrowse()};
  $("#ddiBtn").onclick=checkDDI;
  $("#bottomSearch").onclick=()=>{$("#home").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("#search").focus(),350)};
  document.onclick=e=>{
    const go=e.target.closest("[data-go]"); if(go)$("#"+go.dataset.go)?.scrollIntoView({behavior:"smooth"});
    const st=e.target.closest("[data-stat-target]"); if(st){if(st.dataset.statType){state.browseType=st.dataset.statType;state.page=1;$("#typeFilter").value=state.browseType;renderBrowse()} $("#"+st.dataset.statTarget)?.scrollIntoView({behavior:"smooth"});}
    const sr=e.target.closest("[data-row-id]"); if(sr)openMedicine(sr.dataset.rowId);
    const pg=e.target.closest("[data-page]"); if(pg){state.page=Number(pg.dataset.page);renderBrowse();$("#browse").scrollIntoView({behavior:"smooth"})}
    const add=e.target.closest("[data-add-row]"); if(add){addToMyList(add.dataset.addRow);}
    const rm=e.target.closest("[data-remove-row]"); if(rm){removeFromMyList(rm.dataset.removeRow);}
  };
}
function showSuggest(q){
  const box=$("#suggest"),list=searchRows(q);
  if(!q||!list.length){box.hidden=true;box.innerHTML="";return}
  box.hidden=false;
  box.innerHTML=list.map(r=>`<div class="srow" data-row-id="${r.__id}">
    <div class="icon" style="font-size:22px">${r.medicine_type==="Allopathic"?"💊":r.medicine_type==="Herbal"?"🌿":r.medicine_type==="Ayurvedic"?"🪷":r.medicine_type==="Unani"?"🌙":"⚪"}</div>
    <div><b>${esc(r.brand_name||r.generic_name)}</b><small>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.manufacturer)}</small></div>
    <span class="meta">${esc(r.medicine_type)}</span>
  </div>`).join("");
}
function groupRows(){
  const q=norm($("#browseSearch")?.value||"");
  return state.rows.filter(r=>(r.medicine_type||"")===state.browseType && (!q || (r.__search||"").includes(q)));
}
function renderBrowse(){
  const all=groupRows(),pages=Math.max(1,Math.ceil(all.length/state.pageSize));
  if(state.page>pages)state.page=pages;
  const start=(state.page-1)*state.pageSize, page=all.slice(start,start+state.pageSize);
  $("#browseList").innerHTML=page.map(r=>rowHTML(r)).join("")||`<div class="row"><small>No results.</small></div>`;
  const nums=[1,state.page-1,state.page,state.page+1,pages].filter((x,i,a)=>x>=1&&x<=pages&&a.indexOf(x)===i);
  $("#pager").innerHTML=nums.map(n=>`<button data-page="${n}">${n===state.page?"• ":""}${n}</button>`).join("");
}
function rowHTML(r){
  return `<div class="row">
    <div><b>${esc(r.brand_name||"Unnamed brand")}</b><small>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.dosage_form)}<br>${esc(r.manufacturer)}</small></div>
    <div class="row-actions"><button class="ghost" data-row-id="${r.__id}">Open</button><button class="ghost" data-add-row="${r.__id}">＋</button></div>
  </div>`;
}
function renderSupp(){
  $("#suppList").innerHTML=state.supplementCandidates.slice(0,60).map(rowHTML).join("");
}
function openMedicine(id){
  $("#suggest").hidden=true;
  const r=state.rows.find(x=>x.__id===id);if(!r)return;
  const commonUse=(r.common_uses||"").trim();
  const commonUseHTML=commonUse?`<div class="fact"><span>Common use metadata</span>${esc(commonUse)}</div>`:"";
  const publicView=`
    <div class="data-grid">
      <div class="fact"><span>Generic</span>${esc(r.generic_name)}</div>
      <div class="fact"><span>Brand</span>${esc(r.brand_name)}</div>
      <div class="fact"><span>Strength</span>${esc(r.strength)}</div>
      <div class="fact"><span>Dosage form</span>${esc(r.dosage_form)}</div>
      <div class="fact"><span>Manufacturer</span>${esc(r.manufacturer)}</div>
      <div class="fact"><span>Medicine system</span>${esc(r.medicine_type)}</div>
      ${commonUseHTML}
    </div>
    <p class="notice">এই entry কোনো diagnosis বা prescription নির্দেশনা নয়। খাবারের আগে/পরে, dose change বা medicine stop/start করার জন্য product label/clinician-এর নির্দেশনা অনুসরণ করুন।</p>`;
  const professionalView=`
    <div class="data-grid">
      <div class="fact"><span>Generic name</span>${esc(r.generic_name)}</div>
      <div class="fact"><span>Brand name</span>${esc(r.brand_name)}</div>
      <div class="fact"><span>Strength</span>${esc(r.strength)}</div>
      <div class="fact"><span>Dosage form</span>${esc(r.dosage_form)}</div>
      <div class="fact"><span>Manufacturer</span>${esc(r.manufacturer)}</div>
      <div class="fact"><span>Usage type</span>${esc(r.usage_type)}</div>
      <div class="fact"><span>Country</span>${esc(r.country_code)}</div>
      <div class="fact"><span>Medicine type</span>${esc(r.medicine_type)}</div>
      ${commonUseHTML}
    </div>
    <h3>Clinical workspace</h3>
    <p>Professional mode doctor/nutritionist/pharmacist-এর জন্য। এই corpus mechanism, renal dosing, monitoring বা full interaction monograph নিজে সরবরাহ করে না; যেখানে source-supported data নেই সেখানে system তা বানিয়ে দেখায় না।</p>
    <div class="row"><div><b>Interaction check</b><small>এই generic নাম Interaction Checker-এ ব্যবহার করুন: ${esc(r.generic_name)}</small></div></div>`;
  document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="medModal"><div class="modal-card">
    <div class="modal-head"><div><span class="badge">${esc(r.medicine_type)}</span><h2>${esc(r.brand_name||r.generic_name)}</h2><p>${esc(r.generic_name)} • ${esc(r.strength)}</p></div><button class="close" onclick="document.getElementById('medModal').remove()">×</button></div>
    ${state.mode==="professional"?professionalView:publicView}
    <div style="margin-top:14px"><button class="primary" data-add-row="${r.__id}">＋ Add to My Medicine List</button></div>
  </div></div>`);
}
function addToMyList(id){
  if(!state.myMedicines.includes(id))state.myMedicines.push(id);
  localStorage.setItem("smn_meds_full",JSON.stringify(state.myMedicines));
  if($("#myListPanel"))$("#myListPanel").innerHTML=myListHTML();
}
function removeFromMyList(id){
  state.myMedicines=state.myMedicines.filter(x=>x!==id);
  localStorage.setItem("smn_meds_full",JSON.stringify(state.myMedicines));
  $("#myListPanel").innerHTML=myListHTML();
}
function myListHTML(){
  if(!state.myMedicines.length)return `<p>No medicines saved yet.</p>`;
  return `<div class="list">${state.myMedicines.map(id=>{
    const r=state.rows.find(x=>x.__id===id); if(!r)return"";
    return `<div class="row"><div><b>${esc(r.brand_name||r.generic_name)}</b><small>${esc(r.generic_name)} • ${esc(r.strength)}</small></div><button class="ghost" data-remove-row="${id}">Remove</button></div>`;
  }).join("")}</div>`;
}
async function checkDDI(){
  const a=norm($("#ddiA").value),b=norm($("#ddiB").value),box=$("#ddiResult");
  if(!a||!b){box.innerHTML=`<div class="row"><small>দুটি generic name দিন।</small></div>`;return}
  box.innerHTML=`<div class="row"><small>Interaction dataset check হচ্ছে…</small></div>`;
  try{
    if(!state.ddi)state.ddi=await SMN_DATA.loadDDI(msg=>box.innerHTML=`<div class="row"><small>${esc(msg)}</small></div>`);
    const rows=state.ddi;
    const hdr=rows.length?Object.keys(rows[0]):[];
    const candA=hdr.filter(x=>/(drug.?1|drug.?a|subject|primary|precipitant)/i.test(x));
    const candB=hdr.filter(x=>/(drug.?2|drug.?b|affected|secondary|object)/i.test(x));
    const descCols=hdr.filter(x=>/(interaction|description|sentence|label|text)/i.test(x));
    const hits=[];
    for(const r of rows){
      const valsA=(candA.length?candA:hdr).map(k=>norm(r[k])).join(" ");
      const valsB=(candB.length?candB:hdr).map(k=>norm(r[k])).join(" ");
      const whole=hdr.map(k=>norm(r[k])).join(" ");
      const pair=((valsA.includes(a)&&valsB.includes(b))||(valsA.includes(b)&&valsB.includes(a)));
      const fallback=whole.includes(a)&&whole.includes(b);
      if(pair||fallback){hits.push(r);if(hits.length>=10)break}
    }
    if(!hits.length){box.innerHTML=`<div class="row"><div><b>No direct match found</b><small>এটা interaction নেই—এমন প্রমাণ নয়। Dataset naming/mapping ভিন্ন হতে পারে।</small></div></div>`;return}
    box.innerHTML=hits.map(r=>{
      const txt=(descCols.map(k=>r[k]).find(Boolean)||JSON.stringify(r)).slice(0,850);
      return `<div class="row"><div><b>Potential label-derived interaction</b><small>${esc(txt)}</small></div></div>`;
    }).join("");
  }catch(err){
    box.innerHTML=`<div class="row"><div><b>Interaction dataset load হয়নি</b><small>${esc(err.message)}. Medicine database তবুও ব্যবহার করা যাবে।</small></div></div>`;
  }
}
function initThree(){
  const canvas=$("#heroCanvas"); if(!canvas||!window.THREE)return;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,canvas.clientWidth/Math.max(canvas.clientHeight,1),.1,100);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  const g=new THREE.Group();scene.add(g);
  for(let i=0;i<65;i++){
    const geo=new THREE.IcosahedronGeometry(.10+Math.random()*.05,1);
    const mat=new THREE.MeshBasicMaterial({color:i%2?0x32e0c4:0x8f6bff});
    const m=new THREE.Mesh(geo,mat);m.position.set((Math.random()-.5)*7,(Math.random()-.5)*4,(Math.random()-.5)*3);g.add(m)
  }
  camera.position.z=5;
  function rs(){const w=canvas.clientWidth,h=canvas.clientHeight||420;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}rs();addEventListener("resize",rs);
  let t=0;(function loop(){t+=.0035;g.rotation.y=t;g.rotation.x=Math.sin(t*.8)*.15;renderer.render(scene,camera);requestAnimationFrame(loop)})();
}
async function start(){
  setLoading("বাংলাদেশ medicine corpus load হচ্ছে…");
  try{
    state.rows=await SMN_DATA.loadMedicineCorpus(setLoading);
    state.counts=deriveCounts(state.rows);
    state.supplementCandidates=makeSuppCandidates(state.rows);
    removeLoading();render();initThree();
  }catch(err){
    setLoading("Dataset load করা যায়নি: "+err.message+" — GitHub Pages থেকে আবার refresh করুন।");
  }
}
start();
