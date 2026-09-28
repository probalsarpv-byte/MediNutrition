
const state={
  rows:[],counts:{},lang:localStorage.getItem("smn_lang")||"bn",
  mode:localStorage.getItem("smn_mode")||"public",view:"home",
  page:1,pageSize:40,browseType:"Allopathic",suppCandidates:[],
  curated:[],myMedicines:JSON.parse(localStorage.getItem("smn_meds_v4")||"[]"),
  interactionSelection:[]
};
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const norm=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/\s+/g," ").trim();
const T=k=>window.SMN_I18N?.[k]?.[state.lang]||k;

function setLoading(msg){let x=$("#loading");if(!x){document.body.insertAdjacentHTML("beforeend",`<div class="loading" id="loading"><div><div class="loader"></div><h2>Shuddho MedNutri</h2><p class="progress" id="loadingText"></p></div></div>`)}$("#loadingText").textContent=msg}
function removeLoading(){$("#loading")?.remove()}
function calcCounts(rows){const c={total:rows.length};rows.forEach(r=>c[r.medicine_type]=(c[r.medicine_type]||0)+1);c.brands=new Set(rows.map(r=>norm(r.brand_name)).filter(Boolean)).size;c.generics=new Set(rows.map(r=>norm(r.generic_name)).filter(Boolean)).size;return c}
function makeSupp(rows){const rx=/(vitamin|multivit|mineral|calcium|magnesium|zinc|iron|ferrous|folic|folate|omega[- ]?3|fish oil|probiotic|lactobac|bifido|saccharomyces|biotin|coenzyme|coq|glucosamine|chondroitin|collagen|lysine|carnitine|inositol|melatonin|evening primrose|psyllium|electrolyte)/i,seen=new Set(),out=[];for(const r of rows){if(norm(r.medicine_type)!=="allopathic")continue;const h=[r.generic_name,r.brand_name,r.common_uses].join(" ");if(!rx.test(h)&&!/\bsupplements?\b/i.test(r.common_uses||""))continue;const k=[r.brand_name,r.generic_name,r.strength,r.dosage_form].map(norm).join("|");if(seen.has(k))continue;seen.add(k);out.push(r);if(out.length>=1000)break}return out}
function searchRows(q,limit=18){q=norm(q);if(!q)return[];const out=[];for(const r of state.rows){const b=norm(r.brand_name),g=norm(r.generic_name),h=r.__search||"";let s=0;if(b===q||g===q)s=130;else if(b.startsWith(q))s=115;else if(g.startsWith(q))s=110;else if(h.includes(" "+q))s=82;else if(h.includes(q))s=60;if(s){out.push({r,s});if(out.length>260)break}}return out.sort((a,b)=>b.s-a.s).slice(0,limit).map(x=>x.r)}
function findCurated(){const out=[],seen=new Set();for(const g of window.SMN_CURATED||[]){const n=norm(g);let r=state.rows.find(x=>norm(x.generic_name)===n&&norm(x.medicine_type)==="allopathic");if(!r)r=state.rows.find(x=>norm(x.generic_name).includes(n)&&norm(x.medicine_type)==="allopathic");if(r&&!seen.has(norm(r.generic_name))){seen.add(norm(r.generic_name));out.push(r)}if(out.length>=50)break}return out}
function localRules(g){const n=norm(g);return (window.SMN_RULES||[]).filter(r=>(r.generic||[]).some(x=>n.includes(norm(x))||norm(x).includes(n)))}
function iconFor(r){return r.medicine_type==="Allopathic"?"💊":r.medicine_type==="Herbal"?"🌿":r.medicine_type==="Ayurvedic"?"🪷":r.medicine_type==="Unani"?"🌙":"⚪"}

function navLabel(id){
  const map={home:["হোম","Home"],database:["ডাটাবেজ","Database"],interactions:["ইন্টারঅ্যাকশন","Interactions"],supplements:["সাপ্লিমেন্ট","Supplements"],mylist:["আমার ওষুধ","My Medicines"]};
  return map[id][state.lang==="bn"?0:1];
}
function setView(view,push=true){
  state.view=view;
  if(push)history.pushState({view},"","#"+view);
  $$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));
  $$(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  window.scrollTo({top:0,behavior:"smooth"});
  if(view==="database")renderBrowse();
  if(view==="supplements")renderSupp();
  if(view==="interactions")renderInteractionWorkspace();
  if(view==="mylist")renderMyListView();
}
function render(){
  const c=state.counts;
  $("#app").innerHTML=`<div class="shell">
    <header class="topbar">
      <div class="brand">SHUDDHO <span>MEDNUTRI</span></div>
      <nav class="nav">
        ${["home","database","interactions","supplements","mylist"].map(v=>`<button data-view="${v}" class="${state.view===v?"active":""}">${navLabel(v)}</button>`).join("")}
      </nav>
      <div class="actions"><button class="ghost" id="langBtn">${state.lang==="bn"?"EN":"বাংলা"}</button><button class="ghost" id="modeBtn">${state.mode==="public"?T("public_mode"):T("professional_mode")}</button></div>
    </header>

    <main>
      <section class="view ${state.view==="home"?"active":""}" id="view-home">
        <section class="hero">
          <canvas id="heroCanvas"></canvas>
          <div class="hero-content">
            <div class="actions"><span class="badge">FULL BANGLADESH MEDICINE CORPUS</span><span class="badge gold">AUTO INTERACTION</span></div>
            <h1>Shuddho <span>MedNutri</span></h1>
            <p>${state.lang==="bn"?"ওষুধ, সাপ্লিমেন্ট, খাবার, পুষ্টি ও ইন্টারঅ্যাকশন—একটি প্রিমিয়াম bilingual health-tech প্ল্যাটফর্ম।":"A premium bilingual health-tech platform for medicines, supplements, food, nutrition and interactions."}</p>
            <div class="search-wrap"><input id="homeSearch" class="search" placeholder="${esc(T("search_placeholder"))}" autocomplete="off"><div class="suggest" id="homeSuggest" hidden></div></div>
          </div>
        </section>

        <section class="section">
          <div class="section-head"><div><h2>${state.lang==="bn"?"ডাটাবেজ সারাংশ":"Database Overview"}</h2><p>${state.lang==="bn"?"পূর্ণ ডাটাবেজ ব্যাকগ্রাউন্ডে; হোমে শুধু সারাংশ।":"The full database stays in the background; home shows only the summary."}</p></div></div>
          <div class="grid">
            ${stat("💊",c.total,state.lang==="bn"?"মোট মেডিসিন রো":"Total medicine rows","database","Allopathic")}
            ${stat("🏷️",c.brands,state.lang==="bn"?"ইউনিক ব্র্যান্ড":"Unique brands","database","Allopathic")}
            ${stat("🧪",c.generics,state.lang==="bn"?"ইউনিক জেনেরিক":"Unique generics","database","Allopathic")}
            ${stat("🧴",state.suppCandidates.length,state.lang==="bn"?"নিউট্রিশন/সাপ্লিমেন্ট":"Nutrition/Supplement","supplements","")}
            ${stat("🪷",c.Ayurvedic||0,"Ayurvedic","database","Ayurvedic")}
            ${stat("🌙",c.Unani||0,"Unani","database","Unani")}
            ${stat("🌿",c.Herbal||0,"Herbal","database","Herbal")}
            ${stat("⚪",c.Homeopathic||0,"Homeopathic","database","Homeopathic")}
          </div>
        </section>

        <section class="section">
          <div class="section-head"><div><h2>${state.lang==="bn"?"কুইক টুলস":"Quick Tools"}</h2><p>${state.lang==="bn"?"এক ক্লিকে প্রয়োজনীয় কাজ।":"Common actions in one tap."}</p></div></div>
          <div class="quick-tools">
            ${quick("⚡",state.lang==="bn"?"ইন্টারঅ্যাকশন চেক":"Interaction Check",state.lang==="bn"?"ডাটাবেজ থেকে medicine বেছে add করুন।":"Add medicines directly from the database.","interactions")}
            ${quick("🧾",state.lang==="bn"?"আমার ওষুধ":"My Medicines",state.lang==="bn"?"সেভ করা ওষুধের auto review.":"Automatic review of saved medicines.","mylist")}
            ${quick("🧴",state.lang==="bn"?"সাপ্লিমেন্ট":"Supplements",state.lang==="bn"?"Nutrition formulation explorer.":"Nutrition formulation explorer.","supplements")}
            ${quick("🔎",state.lang==="bn"?"পূর্ণ ডাটাবেজ":"Full Database",state.lang==="bn"?"সব category/search এক জায়গায়।":"All categories and search in one place.","database")}
          </div>
        </section>

        <section class="section">
          <div class="section-head"><div><h2>${T("common_medicines")}</h2><p>${T("common_sub")}</p></div></div>
          <div class="notice">${T("featured_note")}</div>
          <div class="grid" style="margin-top:14px">${state.curated.map(homeCard).join("")}</div>
        </section>

        <div class="footer">© Shuddho Academy</div>
      </section>

      <section class="view ${state.view==="database"?"active":""}" id="view-database">
        <section class="section">
          <div class="section-head"><div><h2>${state.lang==="bn"?"পূর্ণ মেডিসিন ডাটাবেজ":"Full Medicine Database"}</h2><p>${state.lang==="bn"?"Category + search + pagination.":"Category + search + pagination."}</p></div><button class="secondary" data-view="home">← ${navLabel("home")}</button></div>
          <div class="panel">
            <div class="filters"><select id="typeFilter">${["Allopathic","Ayurvedic","Unani","Herbal","Homeopathic"].map(x=>`<option ${state.browseType===x?"selected":""}>${x}</option>`).join("")}</select><input id="browseSearch" placeholder="${state.lang==="bn"?"এই গ্রুপে সার্চ":"Search this group"}"></div>
            <div id="browseList" class="list" style="margin-top:12px"></div><div id="pager" class="pagination"></div>
          </div>
        </section>
      </section>

      <section class="view ${state.view==="interactions"?"active":""}" id="view-interactions">
        <section class="section">
          <div class="section-head"><div><h2>${state.lang==="bn"?"অটোমেটিক ইন্টারঅ্যাকশন ওয়ার্কস্পেস":"Automatic Interaction Workspace"}</h2><p>${state.lang==="bn"?"টাইপ করে generic দিতে হবে না—সার্চ result/medicine card থেকে Add to Interaction করুন।":"No need to type generic names manually—add directly from search results or medicine cards."}</p></div><button class="secondary" data-view="home">← ${navLabel("home")}</button></div>
          <div class="panel">
            <div class="search-wrap"><input id="interactionSearch" class="search" placeholder="${state.lang==="bn"?"ওষুধ সার্চ করে Add করুন":"Search a medicine and add it"}"><div id="interactionSuggest" class="suggest" hidden></div></div>
            <div class="selected-chips" id="interactionSelected"></div>
            <div class="actions"><button class="primary" id="runInteraction">${state.lang==="bn"?"অটোমেটিক রিভিউ চালান":"Run Automatic Review"}</button><button class="secondary" id="addMyMeds">${state.lang==="bn"?"My Medicine থেকে যোগ করুন":"Add from My Medicines"}</button><button class="secondary" id="clearInteractions">${state.lang==="bn"?"ক্লিয়ার":"Clear"}</button></div>
          </div>
          <div class="section two-col">
            <div class="interaction-stage"><canvas id="interactionCanvas"></canvas></div>
            <div class="panel"><div id="interactionResults" class="list"><div class="row"><small>${state.lang==="bn"?"কমপক্ষে ২টি medicine add করুন।":"Add at least two medicines."}</small></div></div></div>
          </div>
        </section>
      </section>

      <section class="view ${state.view==="supplements"?"active":""}" id="view-supplements">
        <section class="section"><div class="section-head"><div><h2>${T("supp_candidates")}</h2><p>${state.lang==="bn"?"Nutrition-related formulation candidates.":"Nutrition-related formulation candidates."}</p></div><button class="secondary" data-view="home">← ${navLabel("home")}</button></div><div class="notice">${state.lang==="bn"?"Regulatory supplement status item-by-item verify করা প্রয়োজন।":"Regulatory supplement status requires item-by-item verification."}</div><div id="suppList" class="list" style="margin-top:12px"></div></section>
      </section>

      <section class="view ${state.view==="mylist"?"active":""}" id="view-mylist">
        <section class="section"><div class="section-head"><div><h2>${T("my_list")}</h2><p>${state.lang==="bn"?"সেভ করা medicine list এবং auto interaction review.":"Saved medicines with automatic interaction review."}</p></div><button class="secondary" data-view="home">← ${navLabel("home")}</button></div><div class="panel" id="myListPanel"></div></section>
      </section>
    </main>
  </div>

  <div class="bottom">
    ${["home","database","interactions","mylist"].map(v=>`<button data-view="${v}"><b>${v==="home"?"⌂":v==="database"?"💊":v==="interactions"?"⚡":"🧾"}</b>${navLabel(v)}</button>`).join("")}
  </div>`;
  bindGlobal();
  renderBrowse();renderSupp();renderMyListView();
  if(state.view==="home")initHeroThree();
  if(state.view==="interactions")renderInteractionWorkspace();
}
function stat(i,n,l,target,type){return `<article class="card"><div class="icon">${i}</div><div class="kpi">${Number(n||0).toLocaleString()}<small>${esc(l)}</small></div><button class="primary" data-stat-target="${target}" data-stat-type="${esc(type)}">${state.lang==="bn"?"দেখুন":"Explore"}</button></article>`}
function quick(i,t,d,v){return `<article class="tool-card"><div class="icon">${i}</div><h3>${esc(t)}</h3><p>${esc(d)}</p><button class="primary" data-view="${v}">${state.lang==="bn"?"খুলুন":"Open"}</button></article>`}
function homeCard(r){const rules=localRules(r.generic_name),badges=[...new Set(rules.map(x=>x.type))].slice(0,3);return `<article class="card stack-card"><div class="icon">💊</div><span class="badge">${esc(r.generic_name)}</span><h3>${esc(r.brand_name||r.generic_name)}</h3><p>${esc(r.strength)} • ${esc(r.dosage_form)}</p><div class="actions">${badges.map(x=>`<span class="badge gold">${esc(x)}</span>`).join("")}</div><div class="actions"><button class="primary" data-row-id="${r.__id}">${T("view_details")}</button><button class="secondary" data-add-row="${r.__id}">${T("save")}</button><button class="secondary" data-add-interaction="${r.__id}">⚡</button></div></article>`}

function bindGlobal(){
 $("#langBtn").onclick=()=>{state.lang=state.lang==="bn"?"en":"bn";localStorage.setItem("smn_lang",state.lang);render()};
 $("#modeBtn").onclick=()=>{state.mode=state.mode==="public"?"professional":"public";localStorage.setItem("smn_mode",state.mode);render()};
 document.onclick=e=>{
   const v=e.target.closest("[data-view]");if(v){setView(v.dataset.view);return}
   const st=e.target.closest("[data-stat-target]");if(st){if(st.dataset.statType)state.browseType=st.dataset.statType;setView(st.dataset.statTarget);return}
   const row=e.target.closest("[data-row-id]");if(row){openMedicine(row.dataset.rowId);return}
   const add=e.target.closest("[data-add-row]");if(add){addToMyList(add.dataset.addRow);return}
   const ai=e.target.closest("[data-add-interaction]");if(ai){addInteraction(ai.dataset.addInteraction);return}
   const rm=e.target.closest("[data-remove-row]");if(rm){removeFromMyList(rm.dataset.removeRow);return}
   const ri=e.target.closest("[data-remove-interaction]");if(ri){state.interactionSelection=state.interactionSelection.filter(x=>x!==ri.dataset.removeInteraction);renderInteractionWorkspace();return}
   const pg=e.target.closest("[data-page]");if(pg){state.page=Number(pg.dataset.page);renderBrowse();return}
   const share=e.target.closest("[data-share-row]");if(share){downloadShareCard(share.dataset.shareRow);return}
 };
 $("#homeSearch")?.addEventListener("input",e=>showSuggest(e.target.value,$("#homeSuggest"),false));
 $("#typeFilter")?.addEventListener("change",e=>{state.browseType=e.target.value;state.page=1;renderBrowse()});
 $("#browseSearch")?.addEventListener("input",()=>{state.page=1;renderBrowse()});
 $("#interactionSearch")?.addEventListener("input",e=>showSuggest(e.target.value,$("#interactionSuggest"),true));
 $("#runInteraction")?.addEventListener("click",runInteractionReview);
 $("#addMyMeds")?.addEventListener("click",()=>{for(const id of state.myMedicines)if(!state.interactionSelection.includes(id))state.interactionSelection.push(id);renderInteractionWorkspace()});
 $("#clearInteractions")?.addEventListener("click",()=>{state.interactionSelection=[];renderInteractionWorkspace()});
 $("#reviewMyList")?.addEventListener("click",()=>{state.interactionSelection=[...state.myMedicines];setView("interactions")});
}
function showSuggest(q,box,interactionMode){
 const list=searchRows(q);if(!q||!list.length){box.hidden=true;box.innerHTML="";return}
 box.hidden=false;box.innerHTML=list.map(r=>`<div class="srow"><div class="icon" style="font-size:22px">${iconFor(r)}</div><div><b>${esc(r.brand_name||r.generic_name)}</b><small>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.manufacturer)}</small></div>${interactionMode?`<button class="primary" data-add-interaction="${r.__id}">＋</button>`:`<button class="secondary" data-row-id="${r.__id}">${T("view_details")}</button>`}</div>`).join("")
}
function groupRows(){const q=norm($("#browseSearch")?.value||"");return state.rows.filter(r=>(r.medicine_type||"")===state.browseType&&(!q||(r.__search||"").includes(q)))}
function renderBrowse(){if(!$("#browseList"))return;const all=groupRows(),pages=Math.max(1,Math.ceil(all.length/state.pageSize));if(state.page>pages)state.page=pages;const start=(state.page-1)*state.pageSize,page=all.slice(start,start+state.pageSize);$("#browseList").innerHTML=page.map(rowHTML).join("")||`<div class="row">No results</div>`;const nums=[1,state.page-1,state.page,state.page+1,pages].filter((x,i,a)=>x>=1&&x<=pages&&a.indexOf(x)===i);$("#pager").innerHTML=nums.map(n=>`<button data-page="${n}">${n===state.page?"• ":""}${n}</button>`).join("")}
function rowHTML(r){return `<div class="row"><div><b>${esc(r.brand_name||"Unnamed")}</b><small>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.dosage_form)}<br>${esc(r.manufacturer)}</small></div><div class="row-actions"><button class="secondary" data-row-id="${r.__id}">${T("view_details")}</button><button class="secondary" data-add-row="${r.__id}">＋ ${T("save")}</button><button class="primary" data-add-interaction="${r.__id}">⚡ ${state.lang==="bn"?"ইন্টারঅ্যাকশন":"Interaction"}</button></div></div>`}
function renderSupp(){if($("#suppList"))$("#suppList").innerHTML=state.suppCandidates.slice(0,120).map(rowHTML).join("")}
function addToMyList(id){if(!state.myMedicines.includes(id))state.myMedicines.push(id);localStorage.setItem("smn_meds_v4",JSON.stringify(state.myMedicines));renderMyListView()}
function removeFromMyList(id){state.myMedicines=state.myMedicines.filter(x=>x!==id);localStorage.setItem("smn_meds_v4",JSON.stringify(state.myMedicines));renderMyListView()}
function renderMyListView(){const box=$("#myListPanel");if(!box)return;if(!state.myMedicines.length){box.innerHTML=`<p>${state.lang==="bn"?"কোনো ওষুধ সেভ করা হয়নি।":"No medicines saved yet."}</p>`;return}box.innerHTML=`<div class="list">${state.myMedicines.map(id=>{const r=state.rows.find(x=>x.__id===id);return r?`<div class="row"><div><b>${esc(r.brand_name||r.generic_name)}</b><small>${esc(r.generic_name)} • ${esc(r.strength)}</small></div><div class="row-actions"><button class="secondary" data-row-id="${id}">${T("view_details")}</button><button class="primary" data-add-interaction="${id}">⚡</button><button class="secondary" data-remove-row="${id}">Remove</button></div></div>`:""}).join("")}</div><div class="actions"><button class="primary" id="reviewMyList">${state.lang==="bn"?"সব ইন্টারঅ্যাকশন চেক করুন":"Check All Interactions"}</button></div>`;$("#reviewMyList")?.addEventListener("click",()=>{state.interactionSelection=[...state.myMedicines];setView("interactions")})}
function addInteraction(id){if(!state.interactionSelection.includes(id))state.interactionSelection.push(id);$("#interactionSuggest")?.setAttribute("hidden","");if(state.view!=="interactions")setView("interactions");else renderInteractionWorkspace()}
function renderInteractionWorkspace(){
 if(!$("#interactionSelected"))return;
 $("#interactionSelected").innerHTML=state.interactionSelection.map(id=>{const r=state.rows.find(x=>x.__id===id);return r?`<span class="chip">${esc(r.brand_name||r.generic_name)} <button class="ghost" data-remove-interaction="${id}">×</button></span>`:""}).join("");
 drawInteractionGraph([]);
}
async function runInteractionReview(){
 const box=$("#interactionResults");if(state.interactionSelection.length<2){box.innerHTML=`<div class="row"><small>${state.lang==="bn"?"কমপক্ষে ২টি medicine add করুন।":"Add at least two medicines."}</small></div>`;return}
 const meds=state.interactionSelection.map(id=>state.rows.find(x=>x.__id===id)).filter(Boolean),results=[];
 box.innerHTML=`<div class="row"><small>${state.lang==="bn"?"ইন্টারঅ্যাকশন স্ক্যান হচ্ছে…":"Scanning interactions…"}</small></div>`;
 for(let i=0;i<meds.length;i++){
   const rules=localRules(meds[i].generic_name);
   results.push({type:"rules",med:meds[i],rules});
   for(let j=i+1;j<meds.length;j++){
     try{const h=await SMN_DATA.checkPair(meds[i].generic_name,meds[j].generic_name,null,3);if(h.length)results.push({type:"ddi",a:meds[i],b:meds[j],hits:h})}catch(e){}
   }
 }
 const html=[];
 for(const x of results){
   if(x.type==="ddi")html.push(`<div class="row"><div><b>${esc(x.a.generic_name)} ↔ ${esc(x.b.generic_name)}</b><small>${esc(x.hits[0].description||"Drug–drug interaction pair found")}</small></div><span class="badge gold">${esc(x.hits[0].severity||"review")}</span></div>`);
   else for(const r of x.rules)html.push(`<div class="row"><div><b>${esc(x.med.generic_name)} — ${esc(state.lang==="bn"?r.with_bn:r.with_en)}</b><small>${esc(state.mode==="professional"?r.pro:(state.lang==="bn"?r.bn:r.en))}<br>${esc(state.lang==="bn"?r.action_bn:r.action_en)}</small></div><span class="badge ${r.severity==="major"?"red":"gold"}">${esc(r.type)}</span></div>`)
 }
 box.innerHTML=html.length?html.join(""):`<div class="row"><small>${T("no_match")}</small></div>`;
 drawInteractionGraph(results);
}
function drawInteractionGraph(results){
 const canvas=$("#interactionCanvas");if(!canvas||!window.THREE)return;
 const old=canvas.__renderer;if(old){try{old.dispose()}catch(e){}}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(55,canvas.clientWidth/360,.1,100),renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});canvas.__renderer=renderer;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(canvas.clientWidth,360,false);camera.position.z=8;
 const group=new THREE.Group();scene.add(group);const meds=state.interactionSelection.map(id=>state.rows.find(x=>x.__id===id)).filter(Boolean);const pos=[];
 meds.forEach((m,i)=>{const a=(i/Math.max(meds.length,1))*Math.PI*2,p=new THREE.Vector3(Math.cos(a)*2.7,Math.sin(a)*2.2,0);pos.push(p);const geo=new THREE.SphereGeometry(.28,24,24),mat=new THREE.MeshBasicMaterial({color:0x69e7b9}),mesh=new THREE.Mesh(geo,mat);mesh.position.copy(p);group.add(mesh)});
 results.filter(x=>x.type==="ddi").forEach(x=>{const ia=meds.indexOf(x.a),ib=meds.indexOf(x.b);if(ia<0||ib<0)return;const g=new THREE.BufferGeometry().setFromPoints([pos[ia],pos[ib]]),m=new THREE.LineBasicMaterial({color:0xd4b96c}),line=new THREE.Line(g,m);group.add(line)});
 let t=0;(function loop(){if(!document.body.contains(canvas)){renderer.dispose();return}t+=.004;group.rotation.z=Math.sin(t)*.04;renderer.render(scene,camera);requestAnimationFrame(loop)})();
}
function labelText(l,k){const v=l?.[k];return Array.isArray(v)?v.join("\n\n"):String(v||"")}
function nutritionSupport(text){const t=norm(text),out=[];if(/nausea|vomit/.test(t))out.push(["Nausea","Small meals, hydration, avoid strong odors; with food only if label allows."]);if(/diarr/.test(t))out.push(["Diarrhea","Fluid/electrolyte support; seek care for dehydration, blood, or high fever."]);if(/constipat/.test(t))out.push(["Constipation","Gradually increase fibre and fluid if appropriate."]);if(/dry mouth|xerostomia/.test(t))out.push(["Dry mouth","Small sips, moist foods, oral care."]);if(/appetite|anorexia/.test(t))out.push(["Appetite loss","Small nutrient-dense meals and weight monitoring."]);return out}
async function openMedicine(id){
 const r=state.rows.find(x=>x.__id===id);if(!r)return;
 document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="medModal"><div class="modal-card"><div class="modal-head"><div><span class="badge">${esc(r.medicine_type)}</span><h2>${esc(r.brand_name||r.generic_name)}</h2><p>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.manufacturer)}</p></div><button class="close" onclick="document.getElementById('medModal').remove()">×</button></div><div id="medBody"><div class="row"><small>Loading details & interactions…</small></div></div></div></div>`);
 const [label,ddi]=await Promise.all([SMN_DATA.loadOpenFDALabel(r.generic_name),SMN_DATA.findDDIForGeneric(r.generic_name,null,60).catch(()=>[])]);
 renderMedicineBody(r,label,ddi);
}
function renderMedicineBody(r,label,ddi){
 const rules=localRules(r.generic_name),food=rules.filter(x=>x.type==="food"),nut=rules.filter(x=>x.type==="nutrient"),supp=rules.filter(x=>x.type==="supplement");
 const indications=labelText(label,"indications_and_usage"),mechanism=labelText(label,"mechanism_of_action")||labelText(label,"clinical_pharmacology"),dosage=labelText(label,"dosage_and_administration"),adverse=labelText(label,"adverse_reactions"),warnings=labelText(label,"warnings_and_cautions"),side=nutritionSupport(adverse+" "+warnings);
 const ruleHTML=arr=>arr.length?arr.map(x=>`<div class="row"><div><b>${esc(state.lang==="bn"?x.with_bn:x.with_en)}</b><small>${esc(state.mode==="professional"?x.pro:(state.lang==="bn"?x.bn:x.en))}<br>${esc(state.lang==="bn"?x.action_bn:x.action_en)}</small></div><span class="badge ${x.severity==="major"?"red":"gold"}">${esc(x.severity)}</span></div>`).join(""):`<div class="row"><small>${T("no_match")}</small></div>`;
 const ddiHTML=ddi.length?ddi.slice(0,30).map(x=>`<div class="row"><div><b>${esc(x.other||"Interaction match")}</b><small>${esc(x.description||"FDA DailyMed-derived interaction pair")}</small></div><span class="badge gold">${esc(x.severity||"review")}</span></div>`).join(""):`<div class="row"><small>${T("no_match")}</small></div>`;
 $("#medBody").innerHTML=`<div class="data-grid"><div class="fact"><span>Generic</span>${esc(r.generic_name)}</div><div class="fact"><span>Brand</span>${esc(r.brand_name)}</div><div class="fact"><span>Strength / Form</span>${esc(r.strength)} • ${esc(r.dosage_form)}</div><div class="fact"><span>Manufacturer</span>${esc(r.manufacturer)}</div><div class="fact"><span>System</span>${esc(r.medicine_type)}</div><div class="fact"><span>Use metadata</span>${esc(r.common_uses||"—")}</div></div>
 <div class="tabs">${["overview","uses","mechanism","drug_drug","food","nutrient","supp_herbal","timing","side_effects","nutrition_support","monitoring","sources"].map((k,i)=>`<button class="${i===0?"active":""}" data-tab="${k}">${T(k)}</button>`).join("")}</div>
 <div id="tab-overview" class="tabpane"><div class="notice">${state.lang==="bn"?"Medicine details + interaction intelligence একসাথে।":"Medicine details + interaction intelligence in one place."}</div></div>
 <div id="tab-uses" class="tabpane" hidden><div class="list"><div class="row"><small>${esc(indications||r.common_uses||T("no_match"))}</small></div></div></div>
 <div id="tab-mechanism" class="tabpane" hidden><div class="list"><div class="row"><small>${esc(mechanism||T("no_match"))}</small></div></div></div>
 <div id="tab-drug_drug" class="tabpane" hidden><div class="list">${ddiHTML}</div></div>
 <div id="tab-food" class="tabpane" hidden><div class="list">${ruleHTML(food)}</div></div>
 <div id="tab-nutrient" class="tabpane" hidden><div class="list">${ruleHTML(nut)}</div></div>
 <div id="tab-supp_herbal" class="tabpane" hidden><div class="list">${ruleHTML(supp)}</div></div>
 <div id="tab-timing" class="tabpane" hidden><div class="list">${dosage?`<div class="row"><small>${esc(dosage.slice(0,2400))}</small></div>`:ruleHTML(rules.filter(x=>x.severity==="timing"))}</div></div>
 <div id="tab-side_effects" class="tabpane" hidden><div class="list"><div class="row"><small>${esc(adverse?adverse.slice(0,2400):T("no_match"))}</small></div></div></div>
 <div id="tab-nutrition_support" class="tabpane" hidden><div class="list">${side.length?side.map(x=>`<div class="row"><div><b>${esc(x[0])}</b><small>${esc(x[1])}</small></div></div>`).join(""):`<div class="row"><small>${T("no_match")}</small></div>`}</div></div>
 <div id="tab-monitoring" class="tabpane" hidden><div class="list"><div class="row"><small>${esc(warnings?warnings.slice(0,2600):T("no_match"))}</small></div></div></div>
 <div id="tab-sources" class="tabpane" hidden><div class="list"><div class="row"><small>Bangladesh medicine corpus • DailyMed-derived DDI dataset • openFDA label API • curated interaction rules.</small></div></div></div>
 <div class="actions"><button class="primary" data-add-row="${r.__id}">＋ ${T("add_my_list")}</button><button class="primary" data-add-interaction="${r.__id}">⚡ ${state.lang==="bn"?"ইন্টারঅ্যাকশন চেক":"Check Interaction"}</button><button class="secondary" data-share-row="${r.__id}">${T("download_card")}</button></div>`;
 $$("#medBody .tabs button").forEach(b=>b.onclick=()=>{$$("#medBody .tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".tabpane",$("#medBody")).forEach(x=>x.hidden=true);$("#tab-"+b.dataset.tab).hidden=false});
}
function downloadShareCard(id){const r=state.rows.find(x=>x.__id===id);if(!r)return;const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,"#061814");g.addColorStop(.6,"#0c2a22");g.addColorStop(1,"#10382d");x.fillStyle=g;x.fillRect(0,0,1080,1350);x.fillStyle="#69e7b9";x.font="900 44px sans-serif";x.fillText("SHUDDHO MEDNUTRI",70,100);x.fillStyle="#fff";x.font="900 64px sans-serif";wrap(x,r.brand_name||r.generic_name,70,230,930,76);x.font="36px sans-serif";x.fillStyle="#b9d7cb";wrap(x,r.generic_name+" • "+(r.strength||"")+" • "+(r.dosage_form||""),70,410,930,48);x.fillStyle="#d4b96c";x.font="bold 32px sans-serif";x.fillText("Interaction & Nutrition Focus",70,560);let y=630;x.font="28px sans-serif";for(const q of localRules(r.generic_name).slice(0,5)){x.fillStyle="#d4b96c";x.fillText("• "+(state.lang==="bn"?q.with_bn:q.with_en),80,y);x.fillStyle="#eafff7";y=wrap(x,state.lang==="bn"?q.bn:q.en,110,y+38,850,38)+22}x.fillStyle="#9ebdb1";x.font="24px sans-serif";x.fillText("© Shuddho Academy",70,1290);const a=document.createElement("a");a.href=c.toDataURL("image/png");a.download=(r.generic_name||"medicine").replace(/[^a-z0-9]+/gi,"-")+"-shuddho-mednutri.png";a.click()}
function wrap(ctx,text,x,y,maxWidth,lineHeight){const words=String(text||"").split(" ");let line="";for(let n=0;n<words.length;n++){const test=line+words[n]+" ";if(ctx.measureText(test).width>maxWidth&&n>0){ctx.fillText(line,x,y);line=words[n]+" ";y+=lineHeight}else line=test}ctx.fillText(line,x,y);return y}
function initHeroThree(){const canvas=$("#heroCanvas");if(!canvas||!window.THREE)return;const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,canvas.clientWidth/Math.max(canvas.clientHeight,1),.1,100),renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));const group=new THREE.Group();scene.add(group);for(let i=0;i<72;i++){const geo=i%4===0?new THREE.CapsuleGeometry(.08,.28,4,8):new THREE.IcosahedronGeometry(.10+Math.random()*.05,1);const colors=[0x69e7b9,0x18c98f,0x9be15d,0xd4b96c],mat=new THREE.MeshBasicMaterial({color:colors[i%colors.length]}),m=new THREE.Mesh(geo,mat);m.position.set((Math.random()-.5)*7,(Math.random()-.5)*4,(Math.random()-.5)*3);m.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);group.add(m)}camera.position.z=5;function rs(){const w=canvas.clientWidth,h=canvas.clientHeight||450;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}rs();addEventListener("resize",rs);let t=0;(function loop(){if(!document.body.contains(canvas)){renderer.dispose();return}t+=.0038;group.rotation.y=t;group.rotation.x=Math.sin(t*.8)*.12;renderer.render(scene,camera);requestAnimationFrame(loop)})()}
window.addEventListener("popstate",()=>{const v=(location.hash||"#home").slice(1);if(["home","database","interactions","supplements","mylist"].includes(v))setView(v,false)});
async function start(){setLoading("Loading full Bangladesh medicine corpus…");try{state.rows=await SMN_DATA.loadMedicineCorpus(setLoading);state.counts=calcCounts(state.rows);state.suppCandidates=makeSupp(state.rows);state.curated=findCurated();const hash=(location.hash||"#home").slice(1);if(["home","database","interactions","supplements","mylist"].includes(hash))state.view=hash;removeLoading();render()}catch(e){setLoading("Dataset load failed: "+e.message)}}
start();
