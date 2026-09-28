
const S={
 lang:localStorage.getItem("smn_v5_lang")||"bn",mode:localStorage.getItem("smn_v5_mode")||"public",theme:localStorage.getItem("smn_v5_theme")||((window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"day":"night"),
 view:(location.hash||"#home").slice(1),medRows:null,medCounts:null,medLoading:null,curated:[],
 dbType:"Allopathic",dbPage:1,dbSize:40,suppQ:"",pendingSuppQ:"",dsld:{hits:[],total:0,from:0,q:""},
 stack:JSON.parse(localStorage.getItem("smn_v5_stack")||"[]"),interaction:[]
};
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const norm=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/\s+/g," ").trim();
const T=k=>window.SMN_I18N?.[k]?.[S.lang]||k;
function nav(v){return({home:T("home"),database:T("database"),interactions:T("interactions"),supplements:T("supplements"),stack:T("stack")})[v]}
function applyTheme(){document.documentElement.dataset.theme=S.theme;document.body.dataset.theme=S.theme;const b=$("#themeBtn");if(b)b.textContent=S.theme==="night"?"☀️ Day":"🌙 Night"}
function saveStack(){localStorage.setItem("smn_v5_stack",JSON.stringify(S.stack))}
function setView(v,push=true){S.view=v;if(push)history.pushState({v},"","#"+v);$$(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+v));$$("[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===v));window.scrollTo({top:0});if(v==="database")ensureMedicine().then(renderDatabase);if(v==="supplements")renderSupplements();if(v==="stack")renderStack();if(v==="interactions")renderInteraction()}
function loading(msg){let e=$("#loading");if(!e){document.body.insertAdjacentHTML("beforeend",`<div class="loading" id="loading"><div><div class="loader"></div><h2>Shuddho MedNutri</h2><p id="loadingText"></p></div></div>`)}$("#loadingText").textContent=msg}
function stopLoading(){$("#loading")?.remove()}
async function ensureMedicine(){
 if(S.medRows)return S.medRows;if(S.medLoading)return S.medLoading;
 S.medLoading=SMN_DATA.medicine(m=>{if(S.view==="database")loading(m)}).then(rows=>{S.medRows=rows;S.medCounts={brands:new Set(rows.map(r=>norm(r.brand_name)).filter(Boolean)).size,generics:new Set(rows.map(r=>norm(r.generic_name)).filter(Boolean)).size};S.curated=findCurated();stopLoading();refreshHomeCounts();return rows}).catch(e=>{stopLoading();throw e});
 return S.medLoading
}
function findCurated(){if(!S.medRows)return[];const out=[],seen=new Set();for(const g of SMN_CONFIG.curatedGenerics){const n=norm(g);let r=S.medRows.find(x=>norm(x.generic_name)===n&&x.medicine_type==="Allopathic");if(!r)r=S.medRows.find(x=>norm(x.generic_name).includes(n)&&x.medicine_type==="Allopathic");if(r&&!seen.has(norm(r.generic_name))){seen.add(norm(r.generic_name));out.push(r)}if(out.length>=48)break}return out}
function localDrugRules(g){const n=norm(g);return (SMN_DRUG_RULES||[]).filter(r=>r.generic.some(x=>n.includes(norm(x))||norm(x).includes(n)))}
function profileFor(name){const n=norm(name);return (SMN_INGREDIENT_PROFILES||[]).find(p=>p.keys.some(k=>n.includes(norm(k))||norm(k).includes(n)))}
function parseGenericIngredients(g){return String(g||"").split(/\+|,|&|\//).map(x=>x.replace(/\b\d+.*$/,"").trim()).filter(x=>x.length>1)}
function homeHTML(){
 const c=SMN_CONFIG.documentedCounts;
 return `<section class="hero"><canvas id="heroCanvas"></canvas><div class="hero-content"><span class="badge">V5 CONSOLIDATED</span> <span class="badge gold">BANGLADESH + NIH DSLD</span><h1>Shuddho <span>MedNutri</span></h1><p>${S.lang==="bn"?"ওষুধ, সাপ্লিমেন্ট, খাবার, নিউট্রিয়েন্ট ও ইন্টারঅ্যাকশন—একটি clean premium health-tech platform.":"A clean premium health-tech platform for medicines, supplements, food, nutrients and interactions."}</p><div class="search-wrap"><input id="homeSearch" class="search" placeholder="${S.lang==="bn"?"ওষুধ/ব্র্যান্ড/জেনেরিক লিখুন…":"Search medicine, brand or generic…"}"><div id="homeSuggest" class="suggest" hidden></div></div></div></section>
 <section class="section"><div class="section-head"><div><h2>${S.lang==="bn"?"ডাটাবেজ সারাংশ":"Database Overview"}</h2><p>${S.lang==="bn"?"হোমে শুধু সারাংশ; পূর্ণ তালিকা Database view-এ।":"Home shows only the summary; full lists live in Database view."}</p></div></div><div class="grid">
 ${stat("💊",c.medicineRows,S.lang==="bn"?"মেডিসিন রো":"Medicine rows","database","Allopathic")}
 ${stat("🏷️",S.medCounts?.brands||"—",S.lang==="bn"?"ইউনিক ব্র্যান্ড (load হলে)":"Unique brands (after load)","database","Allopathic")}
 ${stat("🧪",S.medCounts?.generics||"—",S.lang==="bn"?"ইউনিক জেনেরিক (load হলে)":"Unique generics (after load)","database","Allopathic")}
 ${stat("🪷",c.ayurvedic,"Ayurvedic","database","Ayurvedic")}
 ${stat("🌙",c.unani,"Unani","database","Unani")}
 ${stat("🌿",c.herbal,"Herbal","database","Herbal")}
 ${stat("⚪",c.homeopathic,"Homeopathic","database","Homeopathic")}
 ${stat("🧴","200k+",S.lang==="bn"?"NIH international supplement labels":"NIH international supplement labels","supplements","")}
 </div></section>
 <section class="section"><div class="section-head"><div><h2>${S.lang==="bn"?"কুইক টুলস":"Quick Tools"}</h2></div></div><div class="quick">
 ${tool("⚡",S.lang==="bn"?"ইন্টারঅ্যাকশন ওয়ার্কস্পেস":"Interaction Workspace","interactions")}
 ${tool("🧾","My Stack","stack")}${tool("🧴",T("supplements"),"supplements")}${tool("🔎",T("database"),"database")}
 </div></section>
 <section class="section"><div class="section-head"><div><h2>${S.lang==="bn"?"Common & Useful Medicines":"Common & Useful Medicines"}</h2><p>${S.lang==="bn"?"এগুলো 'best' নয়—শুধু সাধারণত বেশি ব্যবহার/সার্চ হওয়া উদাহরণ।":"These are not 'best' medicines—just commonly used/searched examples."}</p></div></div><div id="curatedArea">${S.curated.length?`<div class="grid">${S.curated.map(homeMedCard).join("")}</div>`:`<div class="panel"><p>${S.lang==="bn"?"ডাটাবেজ background-এ load হচ্ছে; কিছুক্ষণের মধ্যে common cards আসবে।":"The medicine corpus is loading in the background; common cards will appear shortly."}</p></div>`}</div></section>`;
}
function stat(i,n,l,v,t){return `<article class="card"><div style="font-size:30px">${i}</div><div class="kpi">${typeof n==="number"?n.toLocaleString():n}<small>${esc(l)}</small></div><div class="actions"><button class="primary" data-view="${v}" data-dbtype="${esc(t||"")}">${S.lang==="bn"?"দেখুন":"Explore"}</button></div></article>`}
function tool(i,t,v){return `<article class="tool"><div style="font-size:28px">${i}</div><h3>${esc(t)}</h3><button class="primary" data-view="${v}">${S.lang==="bn"?"খুলুন":"Open"}</button></article>`}
function homeMedCard(r){return `<article class="card"><span class="badge">${esc(r.generic_name)}</span><h3>${esc(r.brand_name||r.generic_name)}</h3><p>${esc(r.strength)} • ${esc(r.dosage_form)}</p><div class="actions"><button class="primary" data-med="${r.__id}">${T("details")}</button><button class="secondary" data-add-stack-med="${r.__id}">${T("save")}</button><button class="secondary" data-add-int-med="${r.__id}">⚡</button></div></article>`}
function render(){
 $("#app").innerHTML=`<div class="shell"><header class="topbar"><div class="brand">SHUDDHO <span>MEDNUTRI</span></div><nav class="nav">${["home","database","interactions","supplements","stack"].map(v=>`<button data-view="${v}" class="${S.view===v?"active":""}">${nav(v)}</button>`).join("")}</nav><div class="actions"><button class="ghost" id="themeBtn">${S.theme==="night"?"☀️ Day":"🌙 Night"}</button><button class="ghost" id="langBtn">${S.lang==="bn"?"EN":"বাংলা"}</button><button class="ghost" id="modeBtn">${S.mode==="public"?T("public"):T("professional")}</button></div></header>
 <main><section id="view-home" class="view ${S.view==="home"?"active":""}">${homeHTML()}</section>
 <section id="view-database" class="view ${S.view==="database"?"active":""}"><section class="section"><div class="section-head"><div><h2>${S.lang==="bn"?"পূর্ণ বাংলাদেশ মেডিসিন ডাটাবেজ":"Full Bangladesh Medicine Database"}</h2></div><button class="secondary" data-view="home">← ${T("home")}</button></div><div class="panel"><div class="filters"><select id="dbType">${["Allopathic","Ayurvedic","Unani","Herbal","Homeopathic"].map(x=>`<option ${S.dbType===x?"selected":""}>${x}</option>`).join("")}</select><input id="dbSearch" placeholder="${S.lang==="bn"?"এই group-এ search":"Search this group"}"></div><div id="dbList" class="list" style="margin-top:12px"></div><div id="dbPager" class="pagination"></div></div></section></section>
 <section id="view-interactions" class="view ${S.view==="interactions"?"active":""}">${interactionViewHTML()}</section>
 <section id="view-supplements" class="view ${S.view==="supplements"?"active":""}">${supplementViewHTML()}</section>
 <section id="view-stack" class="view ${S.view==="stack"?"active":""}"><section class="section"><div class="section-head"><div><h2>My Stack</h2><p>${S.lang==="bn"?"Medicine + supplement একসাথে save করে review করুন।":"Save medicines and supplements together and review them."}</p></div><button class="secondary" data-view="home">← ${T("home")}</button></div><div id="stackPanel" class="panel"></div></section></section></main><div class="footer">© Shuddho Academy • Data-source status is shown transparently.</div></div>
 <div class="bottom">${["home","database","interactions","supplements","stack"].map(v=>`<button data-view="${v}"><b>${v==="home"?"⌂":v==="database"?"💊":v==="interactions"?"⚡":v==="supplements"?"🧴":"🧾"}</b>${nav(v)}</button>`).join("")}</div>`;
 applyTheme();bind();renderStack();if(S.view==="home")initHero();if(S.view==="database")ensureMedicine().then(renderDatabase);if(S.view==="supplements")renderSupplements();if(S.view==="interactions")renderInteraction();
 const idle=window.requestIdleCallback||((cb)=>setTimeout(cb,600));idle(()=>ensureMedicine().then(()=>{refreshHomeCounts();refreshCurated()}),{timeout:2500});
}
function refreshHomeCounts(){if(!$("#view-home")?.classList.contains("active"))return;const cards=$$("#view-home .kpi");if(S.medCounts&&cards.length>=3){cards[1].innerHTML=S.medCounts.brands.toLocaleString()+"<small>"+(S.lang==="bn"?"ইউনিক ব্র্যান্ড":"Unique brands")+"</small>";cards[2].innerHTML=S.medCounts.generics.toLocaleString()+"<small>"+(S.lang==="bn"?"ইউনিক জেনেরিক":"Unique generics")+"</small>"}}
function refreshCurated(){const a=$("#curatedArea");if(a&&S.curated.length)a.innerHTML=`<div class="grid">${S.curated.map(homeMedCard).join("")}</div>`}
function bind(){
 $("#themeBtn").onclick=()=>{S.theme=S.theme==="night"?"day":"night";localStorage.setItem("smn_v5_theme",S.theme);applyTheme()};
 $("#langBtn").onclick=()=>{S.lang=S.lang==="bn"?"en":"bn";localStorage.setItem("smn_v5_lang",S.lang);render()};
 $("#modeBtn").onclick=()=>{S.mode=S.mode==="public"?"professional":"public";localStorage.setItem("smn_v5_mode",S.mode);render()};
 document.onclick=e=>{
   const v=e.target.closest("[data-view]");if(v){if(v.dataset.dbtype)S.dbType=v.dataset.dbtype;setView(v.dataset.view);return}
   const m=e.target.closest("[data-med]");if(m){openMedicine(m.dataset.med);return}
   const sm=e.target.closest("[data-add-stack-med]");if(sm){addMedicineStack(sm.dataset.addStackMed);return}
   const im=e.target.closest("[data-add-int-med]");if(im){addInteractionMedicine(im.dataset.addIntMed);return}
   const rm=e.target.closest("[data-remove-stack]");if(rm){S.stack=S.stack.filter(x=>x.uid!==rm.dataset.removeStack);saveStack();renderStack();return}
   const ri=e.target.closest("[data-remove-int]");if(ri){S.interaction=S.interaction.filter(x=>x.uid!==ri.dataset.removeInt);renderInteraction();return}
   const sp=e.target.closest("[data-dsld-id]");if(sp){openDSLD(sp.dataset.dsldId);return}
   const ad=e.target.closest("[data-add-dsld]");if(ad){addDSLDToStack(ad.dataset.addDsld);return}
   const ai=e.target.closest("[data-add-int-dsld]");if(ai){addDSLDToInteraction(ai.dataset.addIntDsld);return}
   const ls=e.target.closest("[data-local-supp]");if(ls){openLocalSupplement(ls.dataset.localSupp);return}
   const pf=e.target.closest("[data-profile]");if(pf){openProfile(pf.dataset.profile);return}
   const sd=e.target.closest("[data-search-dsld]");if(sd){S.pendingSuppQ=sd.dataset.searchDsld||"";setView("supplements");return}
 };
 $("#homeSearch")?.addEventListener("input",debounce(homeSearch,250));
 $("#dbType")?.addEventListener("change",e=>{S.dbType=e.target.value;S.dbPage=1;renderDatabase()});
 $("#dbSearch")?.addEventListener("input",()=>{S.dbPage=1;renderDatabase()});
 $("#suppSearchBtn")?.addEventListener("click",searchSupplements);
 $("#suppSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")searchSupplements()});
 $("#intMedSearch")?.addEventListener("input",debounce(interactionMedSearch,250));
 $("#intSuppBtn")?.addEventListener("click",interactionSuppSearch);
 $("#runReview")?.addEventListener("click",runInteractionReview);
 $("#addStackToInteraction")?.addEventListener("click",()=>{S.interaction=[...S.stack];renderInteraction()});
 $("#clearInteraction")?.addEventListener("click",()=>{S.interaction=[];renderInteraction()});
 $("#reviewStack")?.addEventListener("click",()=>{S.interaction=[...S.stack];setView("interactions")});
}
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
async function homeSearch(e){
 const q=e.target.value.trim(),box=$("#homeSuggest");
 if(!q){box.hidden=true;return}
 box.hidden=false;box.innerHTML=`<div class="srow"><small>Loading…</small></div>`;
 await ensureMedicine();
 const meds=searchMedicine(q,9);
 const local=(SMN_CONFIG.verifiedBdSupplements||[]).filter(p=>norm([p.name,p.company,p.category,p.ingredients?.join(" ")].join(" ")).includes(norm(q))).slice(0,4);
 const profiles=(SMN_INGREDIENT_PROFILES||[]).filter(p=>norm([p.name,...p.keys].join(" ")).includes(norm(q))).slice(0,4);
 let html=meds.map(r=>`<div class="srow"><div><b>💊 ${esc(r.brand_name||r.generic_name)}</b><small>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.manufacturer)}</small></div><button class="primary" data-med="${r.__id}">${T("details")}</button></div>`).join("");
 html+=local.map(p=>`<div class="srow"><div><b>🇧🇩 ${esc(p.name)}</b><small>${esc(p.company)} • ${esc(p.category)}</small></div><button class="secondary" data-local-supp="${esc(p.id)}">${T("details")}</button></div>`).join("");
 html+=profiles.map(p=>`<div class="srow"><div><b>🧴 ${esc(p.name)}</b><small>${S.lang==="bn"?"Formulation intelligence":"Formulation intelligence"}</small></div><button class="secondary" data-profile="${esc(p.name)}">${T("details")}</button></div>`).join("");
 html+=`<div class="srow"><div><b>🌍 NIH DSLD: ${esc(q)}</b><small>${S.lang==="bn"?"International/U.S. supplement labels-এ live search":"Live search in international/U.S. supplement labels"}</small></div><button class="primary" data-search-dsld="${esc(q)}">${T("search")}</button></div>`;
 box.innerHTML=html||`<div class="srow"><small>${T("noMatch")}</small></div>`;
}
function searchMedicine(q,limit=20){q=norm(q);if(!S.medRows||!q)return[];const out=[];for(const r of S.medRows){let s=0,b=norm(r.brand_name),g=norm(r.generic_name),h=r.__search;if(b===q||g===q)s=120;else if(b.startsWith(q))s=110;else if(g.startsWith(q))s=105;else if(h.includes(q))s=60;if(s){out.push({r,s});if(out.length>250)break}}return out.sort((a,b)=>b.s-a.s).slice(0,limit).map(x=>x.r)}
function renderDatabase(){
 if(!$("#dbList")||!S.medRows)return;const q=norm($("#dbSearch")?.value||"");
 const all=S.medRows.filter(r=>r.medicine_type===S.dbType&&(!q||r.__search.includes(q))),pages=Math.max(1,Math.ceil(all.length/S.dbSize));S.dbPage=Math.min(S.dbPage,pages);
 const page=all.slice((S.dbPage-1)*S.dbSize,S.dbPage*S.dbSize);
 $("#dbList").innerHTML=page.map(r=>`<div class="row"><div><b>${esc(r.brand_name||r.generic_name)}</b><small>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.dosage_form)}<br>${esc(r.manufacturer)}</small></div><div class="row-actions"><button class="secondary" data-med="${r.__id}">${T("details")}</button><button class="secondary" data-add-stack-med="${r.__id}">＋ My Stack</button><button class="primary" data-add-int-med="${r.__id}">⚡</button></div></div>`).join("")||"<div class='row'>No results</div>";
 const nums=[1,S.dbPage-1,S.dbPage,S.dbPage+1,pages].filter((x,i,a)=>x>=1&&x<=pages&&a.indexOf(x)===i);$("#dbPager").innerHTML=nums.map(n=>`<button data-pg="${n}">${n===S.dbPage?"• ":""}${n}</button>`).join("");$$("[data-pg]").forEach(b=>b.onclick=()=>{S.dbPage=Number(b.dataset.pg);renderDatabase()})
}

function renderSupplements(){
 const box=$("#suppResults");
 if(box&&S.dsld.hits?.length)box.innerHTML=renderDSLDHits(S.dsld.hits);
 if(S.pendingSuppQ&&$("#suppSearch")){
   $("#suppSearch").value=S.pendingSuppQ;
   const q=S.pendingSuppQ;S.pendingSuppQ="";
   setTimeout(()=>searchSupplements(q),0);
 }
}

function supplementViewHTML(){
 return `<section class="section"><div class="section-head"><div><h2>${T("supplements")}</h2><p>${S.lang==="bn"?"বাংলাদেশ formulation directory + NIH Dietary Supplement Label Database (live).":"Bangladesh formulation directory + live NIH Dietary Supplement Label Database."}</p></div><button class="secondary" data-view="home">← ${T("home")}</button></div>
 <div class="notice">${S.lang==="bn"?"International অংশটি NIH DSLD-এর live U.S. label database; label data manufacturer/distributor-declared, clinical recommendation নয়।":"The international section uses the live NIH DSLD U.S. label database; label data are manufacturer/distributor-declared and are not clinical recommendations."}</div>
 <div class="section"><h2>${S.lang==="bn"?"Verified Bangladesh Formulation Focus":"Verified Bangladesh Formulation Focus"}</h2><div class="supp-grid">${SMN_CONFIG.verifiedBdSupplements.map(p=>`<article class="supp-card"><span class="badge">🇧🇩 ${esc(p.category)}</span><h3>${esc(p.name)}</h3><p>${esc(p.company)}</p><p>${esc(p.label)}</p><div class="actions"><button class="primary" data-local-supp="${p.id}">${T("details")}</button></div></article>`).join("")}</div></div>
 <div class="section"><div class="section-head"><div><h2>${S.lang==="bn"?"International — NIH DSLD":"International — NIH DSLD"}</h2><p>200,000+ U.S. dietary supplement labels</p></div></div><div class="panel"><div class="filters"><input id="suppSearch" value="${esc(S.dsld.q)}" placeholder="${S.lang==="bn"?"যেমন Magnesium, Vitamin D, Omega-3…":"e.g. Magnesium, Vitamin D, Omega-3…"}"><button class="primary" id="suppSearchBtn">${T("search")}</button></div><div id="suppResults" class="list" style="margin-top:12px">${S.dsld.hits.length?renderDSLDHits(S.dsld.hits):`<div class="row"><small>${S.lang==="bn"?"সার্চ করলে NIH-এর live products এখানে আসবে।":"Search to load live products from NIH."}</small></div>`}</div></div></div>
 <div class="section"><h2>${S.lang==="bn"?"Global Formulation Intelligence":"Global Formulation Intelligence"}</h2><div class="supp-grid">${SMN_INGREDIENT_PROFILES.map(p=>`<article class="supp-card"><span class="badge">${esc(p.name)}</span><h3>${esc(p.name)}</h3><p>${esc(S.lang==="bn"?p.absorption_bn:p.absorption_en)}</p><div class="actions"><button class="secondary" data-profile="${esc(p.name)}">${T("details")}</button></div></article>`).join("")}</div></div></section>`;
}
async function searchSupplements(forcedQ=""){const q=(forcedQ||$("#suppSearch")?.value||"").trim();if(!q)return;if($("#suppSearch"))$("#suppSearch").value=q;$("#suppResults").innerHTML="<div class='row'><small>Loading NIH DSLD…</small></div>";try{S.dsld={...(await SMN_DATA.dsldSearch(q,0,40)),q,from:0};$("#suppResults").innerHTML=renderDSLDHits(S.dsld.hits)}catch(e){$("#suppResults").innerHTML=`<div class="row"><small>DSLD API load failed: ${esc(e.message)}</small></div>`}}
function renderDSLDHits(hits){return hits.map(p=>`<div class="row"><div><b>${esc(p.fullName||p.name||"Supplement")}</b><small>${esc(p.brandName||"")} • ${esc(p.physicalState?.langualCodeDescription||"")} ${p.offMarket?"• Off market/historical":""}</small></div><div class="row-actions"><button class="secondary" data-dsld-id="${esc(p.id)}">${T("details")}</button><button class="primary" data-add-int-dsld="${esc(p.id)}">⚡</button></div></div>`).join("")||"<div class='row'>No results</div>"}

function makeLocalSupplementProduct(p){
 const ingredients=(p.ingredients||[]).map(name=>({name,form:"",qty:""}));
 return{uid:"SUP_LOCAL_"+p.id,kind:"supplement",source:"Verified Bangladesh manufacturer source",id:p.id,name:p.name,brand:p.name,ingredients,offMarket:false,productType:p.category,physicalState:"",statements:[{type:"Label / formulation",notes:p.label||""}],sourceUrl:p.source||"",company:p.company||""}
}
function openLocalSupplement(id){
 const p=(SMN_CONFIG.verifiedBdSupplements||[]).find(x=>x.id===id);if(!p)return;
 openSupplementModal(makeLocalSupplementProduct(p));
}
function openProfile(name){
 const pr=(SMN_INGREDIENT_PROFILES||[]).find(x=>x.name===name);if(!pr)return;
 document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="profileModal"><div class="modal-card"><div class="modal-head"><div><span class="badge">Formulation Intelligence</span><h2>${esc(pr.name)}</h2></div><button class="close" onclick="document.getElementById('profileModal').remove()">×</button></div><div class="list">${profileHTML(pr)}</div><div class="notice" style="margin-top:12px">${S.lang==="bn"?"এটি formulation-level information; নির্দিষ্ট commercial product-এর dose/quality/label আলাদা হতে পারে।":"This is formulation-level information; dose, quality and label vary by commercial product."}</div></div></div>`);
}

function normalizeDSLDLabel(j){const ingredients=(j.ingredientRows||[]).map(r=>({name:r.name||r.ingredientGroup||"",form:(r.forms||[]).map(f=>f.name).join(", "),qty:(r.quantity||[]).map(q=>`${q.quantity||""} ${q.unit||""}`.trim()).join("; ")}));return{uid:"SUP_DSLD_"+j.id,kind:"supplement",source:"NIH DSLD",id:String(j.id),name:j.fullName||"Supplement",brand:j.brandName||"",ingredients,offMarket:!!j.offMarket,productType:j.productType?.langualCodeDescription||"",physicalState:j.physicalState?.langualCodeDescription||"",statements:j.statements||[]}}
async function openDSLD(id){loading("Loading supplement label…");try{const j=await SMN_DATA.dsldLabel(id),p=normalizeDSLDLabel(j);stopLoading();openSupplementModal(p)}catch(e){stopLoading();alert("Could not load label: "+e.message)}}
async function addDSLDToStack(id){loading("Loading supplement label…");try{const p=normalizeDSLDLabel(await SMN_DATA.dsldLabel(id));stopLoading();upsertStack(p);renderStack()}catch(e){stopLoading()}}
async function addDSLDToInteraction(id){loading("Loading supplement label…");try{const p=normalizeDSLDLabel(await SMN_DATA.dsldLabel(id));stopLoading();upsertInteraction(p);setView("interactions")}catch(e){stopLoading()}}
function openSupplementModal(p){
 const profiles=[];for(const ing of p.ingredients){const pr=profileFor((ing.name+" "+ing.form).trim());if(pr&&!profiles.includes(pr))profiles.push(pr)}
 const statements=(p.statements||[]).map(s=>`<div class="row"><div><b>${esc(s.type||"Label statement")}</b><small>${esc(s.notes||"")}</small></div></div>`).join("");
 document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="suppModal"><div class="modal-card"><div class="modal-head"><div><span class="badge">${esc(p.source)}</span><h2>${esc(p.name)}</h2><p>${esc(p.brand||"")} ${p.offMarket?"• Historical/off-market":""}</p></div><button class="close" onclick="document.getElementById('suppModal').remove()">×</button></div>
 <div class="facts"><div class="fact"><span>Product type</span>${esc(p.productType||"—")}</div><div class="fact"><span>Form</span>${esc(p.physicalState||"—")}</div><div class="fact"><span>Ingredients</span>${p.ingredients.length}</div></div>
 <div class="section"><h2>${S.lang==="bn"?"Label Ingredients":"Label Ingredients"}</h2><div class="list">${p.ingredients.map(i=>`<div class="row"><div><b>${esc(i.name)}</b><small>${esc(i.form)} ${esc(i.qty)}</small></div></div>`).join("")}</div></div>
 <div class="section"><h2>${S.lang==="bn"?"Formulation Intelligence":"Formulation Intelligence"}</h2><div class="list">${profiles.length?profiles.map(pr=>profileHTML(pr)).join(""):`<div class="row"><small>${T("noMatch")}</small></div>`}</div></div>
 <div class="section"><h2>${S.lang==="bn"?"Label Directions / Precautions":"Label Directions / Precautions"}</h2><div class="list">${statements||`<div class="row"><small>—</small></div>`}</div></div>
 ${p.sourceUrl?`<div class="actions"><a class="secondary" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Source ↗</a></div>`:""}<div class="actions"><button class="primary" onclick='window.SMN_ADD_SUPP_STACK(${JSON.stringify(JSON.stringify(p))})'>＋ My Stack</button><button class="primary" onclick='window.SMN_ADD_SUPP_INT(${JSON.stringify(JSON.stringify(p))})'>⚡ Interaction</button></div></div></div>`)
}
window.SMN_ADD_SUPP_STACK=s=>{const p=JSON.parse(s);upsertStack(p);renderStack()};
window.SMN_ADD_SUPP_INT=s=>{const p=JSON.parse(s);upsertInteraction(p);document.getElementById("suppModal")?.remove();setView("interactions")};
function profileHTML(pr){return `<div class="row"><div><b>${esc(pr.name)}</b><small><b>${S.lang==="bn"?"কীভাবে কাজ করে":"Mechanism"}:</b> ${esc(S.lang==="bn"?pr.mechanism_bn:pr.mechanism_en)}<br><b>Absorption:</b> ${esc(S.lang==="bn"?pr.absorption_bn:pr.absorption_en)}<br><b>${T("food")}:</b> ${esc(S.lang==="bn"?pr.food_bn:pr.food_en)}<br><b>Drug:</b> ${esc(pr.drug.join(", ")||"—")}<br><b>Nutrient:</b> ${esc(pr.nutrient.join(", ")||"—")}<br><b>Caution:</b> ${esc(S.lang==="bn"?pr.caution_bn:pr.caution_en)}</small></div></div>`}
function interactionViewHTML(){return `<section class="section"><div class="section-head"><div><h2>${S.lang==="bn"?"Unified Interaction Workspace":"Unified Interaction Workspace"}</h2><p>${S.lang==="bn"?"Medicine + supplement একই review-তে।":"Medicines and supplements in one review."}</p></div><button class="secondary" data-view="home">← ${T("home")}</button></div>
 <div class="panel"><div class="filters"><input id="intMedSearch" placeholder="${S.lang==="bn"?"Medicine search করে add করুন":"Search a medicine to add"}"><input id="intSuppSearch" placeholder="${S.lang==="bn"?"International supplement search":"Search international supplement"}"><button class="secondary" id="intSuppBtn">${T("search")}</button></div><div id="intSuggest" class="suggest" hidden style="position:relative;top:auto;margin-top:8px"></div><div id="intSuppResults" class="list" style="margin-top:8px"></div><div class="stack-chips" id="intChips" style="margin-top:12px"></div><div class="actions"><button class="primary" id="runReview">${S.lang==="bn"?"অটোমেটিক রিভিউ":"Run Automatic Review"}</button><button class="secondary" id="addStackToInteraction">My Stack →</button><button class="secondary" id="clearInteraction">${S.lang==="bn"?"ক্লিয়ার":"Clear"}</button></div></div>
 <div class="section two"><div class="interaction-stage"><canvas id="intCanvas"></canvas><div id="graphLegend" class="graph-legend"></div></div><div class="panel"><div id="intResults" class="list"><div class="row"><small>${S.lang==="bn"?"কমপক্ষে দুইটি item যোগ করুন।":"Add at least two items."}</small></div></div></div></div></section>`}
async function interactionMedSearch(e){const q=e.target.value.trim(),box=$("#intSuggest");if(!q){box.hidden=true;return}box.hidden=false;box.innerHTML="<div class='srow'>Loading…</div>";await ensureMedicine();box.innerHTML=searchMedicine(q,10).map(r=>`<div class="srow"><div><b>${esc(r.brand_name||r.generic_name)}</b><small>${esc(r.generic_name)} • ${esc(r.strength)}</small></div><button class="primary" data-add-int-med="${r.__id}">＋</button></div>`).join("")}
async function interactionSuppSearch(){const q=$("#intSuppSearch").value.trim();if(!q)return;$("#intSuppResults").innerHTML="<div class='row'>Loading NIH DSLD…</div>";try{const x=await SMN_DATA.dsldSearch(q,0,10);$("#intSuppResults").innerHTML=x.hits.map(p=>`<div class="row"><div><b>${esc(p.fullName||"Supplement")}</b><small>${esc(p.brandName||"")}</small></div><button class="primary" data-add-int-dsld="${esc(p.id)}">＋</button></div>`).join("")}catch(e){$("#intSuppResults").innerHTML=`<div class="row">${esc(e.message)}</div>`}}
function addInteractionMedicine(id){ensureMedicine().then(()=>{const r=S.medRows.find(x=>x.__id===id);if(r){upsertInteraction({uid:r.__id,kind:"medicine",source:"Bangladesh medicine corpus",name:r.brand_name||r.generic_name,generic:r.generic_name,strength:r.strength,manufacturer:r.manufacturer});setView("interactions")}})}
function upsertInteraction(item){if(!S.interaction.some(x=>x.uid===item.uid))S.interaction.push(item);renderInteraction()}
function renderInteraction(){if(!$("#intChips"))return;$("#intChips").innerHTML=S.interaction.map(x=>`<span class="chip">${x.kind==="medicine"?"💊":"🧴"} ${esc(x.name)} <button class="ghost" data-remove-int="${esc(x.uid)}">×</button></span>`).join("");drawGraph([])}
async function runInteractionReview(){
 const box=$("#intResults");if(S.interaction.length<2){box.innerHTML=`<div class="row">${S.lang==="bn"?"কমপক্ষে দুইটি item যোগ করুন।":"Add at least two items."}</div>`;return}
 box.innerHTML="<div class='row'>Scanning…</div>";const findings=[],meds=S.interaction.filter(x=>x.kind==="medicine"),supps=S.interaction.filter(x=>x.kind==="supplement");
 for(let i=0;i<meds.length;i++){for(let j=i+1;j<meds.length;j++){try{const h=await SMN_DATA.checkPair(meds[i].generic,meds[j].generic,2);if(h.length)findings.push({type:"ddi",a:meds[i],b:meds[j],text:h[0].description,severity:h[0].severity})}catch(e){}}for(const r of localDrugRules(meds[i].generic))findings.push({type:r.type,a:meds[i],text:S.lang==="bn"?r.bn:r.en,action:S.lang==="bn"?r.action_bn:r.action_en,severity:r.severity})}
 const ingredientMap={};
 for(const s of supps){for(const ing of s.ingredients||[]){const n=norm(ing.name);if(n)(ingredientMap[n]||(ingredientMap[n]=[])).push(s);const pr=profileFor(ing.name+" "+ing.form);if(pr){for(const m of meds){if(pr.drug.some(d=>norm(m.generic).includes(norm(d))||norm(d).includes(norm(m.generic))))findings.push({type:"drug-supplement",a:m,b:s,text:`${pr.name}: ${S.lang==="bn"?pr.caution_bn:pr.caution_en}`,severity:"review"})}}}}
 for(const s of supps){
   const seenProfiles=new Set();
   for(const ing of s.ingredients||[]){
     const pr=profileFor(ing.name+" "+ing.form);if(!pr||seenProfiles.has(pr.name))continue;seenProfiles.add(pr.name);
     findings.push({type:"supplement-food",a:s,text:`${pr.name}: ${S.lang==="bn"?pr.food_bn:pr.food_en}`,severity:"info"});
     if(pr.nutrient?.length)findings.push({type:"supplement-nutrient",a:s,text:`${pr.name} ↔ ${pr.nutrient.join(", ")}`,severity:"review"});
     findings.push({type:"supplement-caution",a:s,text:S.lang==="bn"?pr.caution_bn:pr.caution_en,severity:"review"});
   }
 }
 for(const [ing,arr] of Object.entries(ingredientMap))if(arr.length>1)findings.push({type:"duplicate",text:`Duplicate ingredient: ${ing} (${arr.map(x=>x.name).join(", ")})`,severity:"review"});
 box.innerHTML=findings.length?findings.map(f=>`<div class="row"><div><b>${esc(f.type.toUpperCase())}${f.a?` — ${esc(f.a.name)}`:""}${f.b?` ↔ ${esc(f.b.name)}`:""}</b><small>${esc(f.text||"")}${f.action?`<br>${esc(f.action)}`:""}</small></div><span class="badge ${f.severity==="major"?"red":"gold"}">${esc(f.severity||"review")}</span></div>`).join(""):`<div class="row"><small>${T("noMatch")}</small></div>`;drawGraph(findings)
}
function drawGraph(findings){const c=$("#intCanvas");if(!c||!window.THREE)return;const legend=$("#graphLegend");if(legend)legend.innerHTML=S.interaction.map((x,i)=>`<span><b>${i+1}</b> ${x.kind==="medicine"?"💊":"🧴"} ${esc(x.name)}</span>`).join("");const old=c.__r;if(old)try{old.dispose()}catch(e){};const h=S.interaction.length<=2?170:S.interaction.length<=5?220:280;c.style.height=h+"px";const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,c.clientWidth/h,.1,100),r=new THREE.WebGLRenderer({canvas:c,antialias:true});c.__r=r;r.setSize(c.clientWidth,h,false);r.setClearColor(0xffffff,1);cam.position.z=8;const g=new THREE.Group();scene.add(g),pos=[];S.interaction.forEach((x,i)=>{const a=i/Math.max(1,S.interaction.length)*Math.PI*2,p=new THREE.Vector3(Math.cos(a)*2.4,Math.sin(a)*1.7,0);pos.push(p);const mesh=new THREE.Mesh(new THREE.SphereGeometry(.28,20,20),new THREE.MeshBasicMaterial({color:x.kind==="medicine"?0x19c98f:0xd8bb6b}));mesh.position.copy(p);g.add(mesh)});for(const f of findings){if(!f.a||!f.b)continue;const ia=S.interaction.findIndex(x=>x.uid===f.a.uid),ib=S.interaction.findIndex(x=>x.uid===f.b.uid);if(ia<0||ib<0)continue;g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pos[ia],pos[ib]]),new THREE.LineBasicMaterial({color:0xff7882})))}r.render(scene,cam)}
function addMedicineStack(id){ensureMedicine().then(()=>{const r=S.medRows.find(x=>x.__id===id);if(r){upsertStack({uid:r.__id,kind:"medicine",source:"Bangladesh medicine corpus",name:r.brand_name||r.generic_name,generic:r.generic_name,strength:r.strength,manufacturer:r.manufacturer});renderStack()}})}
function upsertStack(item){if(!S.stack.some(x=>x.uid===item.uid)){S.stack.push(item);saveStack()}}
function renderStack(){const b=$("#stackPanel");if(!b)return;b.innerHTML=S.stack.length?`<div class="list">${S.stack.map(x=>`<div class="row"><div><b>${x.kind==="medicine"?"💊":"🧴"} ${esc(x.name)}</b><small>${esc(x.kind==="medicine"?x.generic:(x.ingredients||[]).map(i=>i.name).join(", "))}</small></div><button class="secondary" data-remove-stack="${esc(x.uid)}">Remove</button></div>`).join("")}</div><div class="actions"><button class="primary" id="reviewStack">${S.lang==="bn"?"সব ইন্টারঅ্যাকশন রিভিউ":"Review All Interactions"}</button></div>`:`<p>${S.lang==="bn"?"My Stack খালি।":"My Stack is empty."}</p>`;$("#reviewStack")?.addEventListener("click",()=>{S.interaction=[...S.stack];setView("interactions")})}
async function openMedicine(id){await ensureMedicine();const r=S.medRows.find(x=>x.__id===id);if(!r)return;document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="medModal"><div class="modal-card"><div class="modal-head"><div><span class="badge">${esc(r.medicine_type)}</span><h2>${esc(r.brand_name||r.generic_name)}</h2><p>${esc(r.generic_name)} • ${esc(r.strength)} • ${esc(r.manufacturer)}</p></div><button class="close" onclick="document.getElementById('medModal').remove()">×</button></div><div id="medBody"><div class="row">Loading clinical details…</div></div></div></div>`);const [label,ddi]=await Promise.all([SMN_DATA.openFDALabel(r.generic_name,r.brand_name),SMN_DATA.findDDI(r.generic_name).catch(()=>[])]);renderMedicineDetail(r,label,ddi)}
function txt(l,k){const v=l?.[k];return Array.isArray(v)?v.join("\n\n"):String(v||"")}
function section(l,keys){for(const k of keys){const v=txt(l,k);if(v.trim())return v.trim()}return""}
function labelBuckets(l){const a=section(l,["drug_interactions","warnings_and_cautions","precautions"]),d=section(l,["dosage_and_administration","information_for_patients"]);const f=(t,rx)=>String(t||"").replace(/\s+/g," ").split(/(?<=[.!?;])\s+/).filter(s=>rx.test(s)).slice(0,12);return{food:f(a+" "+d,/(food|meal|grapefruit|dairy|milk|fasting|empty stomach)/i),nut:f(a+" "+d,/(calcium|iron|magnesium|zinc|potassium|vitamin|mineral)/i),supp:f(a+" "+d,/(supplement|antacid|herbal|ginkgo|garlic|st\.? john)/i),time:f(d,/(before|after|hours|minutes|meal|bedtime|morning|evening|empty stomach)/i)}}
function sideNutrition(text){const t=norm(text),o=[];if(/nausea|vomit/.test(t))o.push(["Nausea","Small meals, hydration, avoid strong odors; take with food only if label allows."]);if(/diarr/.test(t))o.push(["Diarrhea","Fluid/electrolyte support; seek review for dehydration, blood or high fever."]);if(/constipat/.test(t))o.push(["Constipation","Gradually increase fibre/fluid if appropriate."]);if(/dry mouth|xerostomia/.test(t))o.push(["Dry mouth","Small sips, moist foods, oral care."]);if(/appetite|anorexia/.test(t))o.push(["Appetite loss","Small nutrient-dense meals and weight monitoring."]);return o}

function fallbackMechanism(g){
 const n=norm(g),m=[
  [/metformin/,"Biguanide: lowers hepatic glucose production and improves insulin sensitivity."],
  [/amlodipine/,"Dihydropyridine calcium-channel blocker: reduces calcium entry into vascular smooth muscle, producing vasodilation."],
  [/losartan|telmisartan|valsartan|olmesartan|candesartan/,"ARB: blocks angiotensin II AT1 receptors, reducing vasoconstriction and aldosterone effects."],
  [/atorvastatin|rosuvastatin|simvastatin/,"Statin: inhibits HMG-CoA reductase and increases hepatic LDL-receptor activity."],
  [/omeprazole|esomeprazole|pantoprazole|lansoprazole|rabeprazole/,"Proton-pump inhibitor: suppresses gastric acid by inhibiting the parietal-cell H+/K+-ATPase."],
  [/levothyroxine|thyroxine/,"Synthetic thyroxine (T4) replacement; T4 is converted peripherally to active T3."],
  [/furosemide|frusemide|bumetanide|torsemide/,"Loop diuretic: inhibits the Na-K-2Cl cotransporter in the thick ascending limb."],
  [/spironolactone/,"Mineralocorticoid-receptor antagonist: reduces aldosterone-mediated sodium retention and potassium loss."],
  [/amoxicillin/,"Beta-lactam antibiotic: inhibits bacterial cell-wall synthesis."],
  [/azithromycin/,"Macrolide antibiotic: binds the 50S ribosomal subunit and inhibits bacterial protein synthesis."],
  [/doxycycline/,"Tetracycline antibiotic: binds the 30S ribosomal subunit and inhibits bacterial protein synthesis."],
  [/ibuprofen|naproxen|diclofenac/,"NSAID: inhibits cyclooxygenase enzymes and reduces prostaglandin synthesis."]
 ];for(const [rx,t] of m)if(rx.test(n))return t;return""
}
function fallbackSideEffects(g){
 const n=norm(g),m=[
  [/metformin/,"Common effects include nausea, diarrhea, abdominal discomfort and reduced appetite; long-term use may be associated with lower vitamin B12."],
  [/amlodipine/,"Common effects include ankle swelling, flushing, headache, dizziness and palpitations."],
  [/losartan|telmisartan|valsartan|olmesartan|candesartan/,"Possible effects include dizziness, low blood pressure, kidney-function changes and increased potassium."],
  [/atorvastatin|rosuvastatin|simvastatin/,"Possible effects include muscle symptoms, GI symptoms and liver-enzyme elevations; rare severe muscle injury can occur."],
  [/omeprazole|esomeprazole|pantoprazole|lansoprazole|rabeprazole/,"Possible effects include headache, abdominal symptoms and diarrhea/constipation; long-term therapy has specific nutrient-related considerations."],
  [/ibuprofen|naproxen|diclofenac/,"Possible effects include dyspepsia, nausea, ulcer/bleeding risk, kidney effects and fluid retention."]
 ];for(const [rx,t] of m)if(rx.test(n))return t;return""
}

function renderMedicineDetail(r,l,ddi){
 const rules=localDrugRules(r.generic_name),b=labelBuckets(l),uses=section(l,["indications_and_usage","purpose"])||r.common_uses||"",mech=section(l,["mechanism_of_action","clinical_pharmacology"])||fallbackMechanism(r.generic_name),dose=section(l,["dosage_and_administration"]),adv=section(l,["adverse_reactions"])||fallbackSideEffects(r.generic_name),warn=section(l,["warnings_and_cautions","warnings","precautions"]),ns=sideNutrition(adv+" "+warn),renal=section(l,["use_in_specific_populations","renal_impairment"]),hepatic=section(l,["hepatic_impairment"]);
 const rule=(type,derived)=>{const arr=rules.filter(x=>x.type===type);return(arr.map(x=>`<div class="row"><div><b>${esc(x.with)}</b><small>${esc(S.mode==="professional"?x.en:(S.lang==="bn"?x.bn:x.en))}<br>${esc(S.lang==="bn"?x.action_bn:x.action_en)}</small></div><span class="badge gold">${esc(x.severity)}</span></div>`).join("")+(derived||[]).map(x=>`<div class="row"><div><b>Label-derived</b><small>${esc(x)}</small></div></div>`).join(""))||`<div class="row"><small>${T("noMatch")}</small></div>`};
 const ddiHTML=ddi.length?ddi.slice(0,25).map(x=>`<div class="row"><div><b>${esc(x.other||"Interaction")}</b><small>${esc(x.description||"Label-derived DDI pair")}</small></div></div>`).join(""):`<div class="row"><small>${T("noMatch")}</small></div>`;
 $("#medBody").innerHTML=`<div class="facts"><div class="fact"><span>Generic</span>${esc(r.generic_name)}</div><div class="fact"><span>Brand</span>${esc(r.brand_name)}</div><div class="fact"><span>Strength/Form</span>${esc(r.strength)} • ${esc(r.dosage_form)}</div><div class="fact"><span>Manufacturer</span>${esc(r.manufacturer)}</div><div class="fact"><span>System</span>${esc(r.medicine_type)}</div><div class="fact"><span>Use metadata</span>${esc(r.common_uses||"—")}</div></div>
 <div class="tabs">${[["overview",T("overview")],["uses",T("uses")],["mechanism",T("mechanism")],["drug",T("drugDrug")],["food",T("food")],["nut",T("nutrient")],["supp",T("suppHerbal")],["timing",T("timing")],["side",T("sideEffects")],["ns",T("nutritionSupport")],["monitor",T("monitoring")],["sources",T("sources")]].map((x,i)=>`<button class="${i===0?"active":""}" data-tab="${x[0]}">${x[1]}</button>`).join("")}</div>
 <div id="tab-overview" class="tabpane"><div class="list"><div class="row"><small>${esc(uses||"—")}</small></div>${mech?`<div class="row"><small>${esc(mech.slice(0,2200))}</small></div>`:""}</div></div>
 <div id="tab-uses" class="tabpane" hidden><div class="row"><small>${esc(uses||T("noMatch"))}</small></div></div>
 <div id="tab-mechanism" class="tabpane" hidden><div class="row"><small>${esc(mech||T("noMatch"))}</small></div></div>
 <div id="tab-drug" class="tabpane" hidden><div class="list">${ddiHTML}</div></div>
 <div id="tab-food" class="tabpane" hidden><div class="list">${rule("food",b.food)}</div></div>
 <div id="tab-nut" class="tabpane" hidden><div class="list">${rule("nutrient",b.nut)}</div></div>
 <div id="tab-supp" class="tabpane" hidden><div class="list">${rule("supplement",b.supp)}</div></div>
 <div id="tab-timing" class="tabpane" hidden><div class="list">${dose?`<div class="row"><small>${esc(dose.slice(0,2600))}</small></div>`:""}${rule("timing",b.time)}</div></div>
 <div id="tab-side" class="tabpane" hidden><div class="row"><small>${esc(adv||T("noMatch"))}</small></div></div>
 <div id="tab-ns" class="tabpane" hidden><div class="list">${ns.length?ns.map(x=>`<div class="row"><div><b>${esc(x[0])}</b><small>${esc(x[1])}</small></div></div>`).join(""):`<div class="row"><small>${T("noMatch")}</small></div>`}</div></div>
 <div id="tab-monitor" class="tabpane" hidden><div class="list"><div class="row"><small>${esc(warn||T("noMatch"))}</small></div>${S.mode==="professional"&&renal?`<div class="row"><div><b>Renal / specific populations</b><small>${esc(renal.slice(0,2200))}</small></div></div>`:""}${S.mode==="professional"&&hepatic?`<div class="row"><div><b>Hepatic</b><small>${esc(hepatic.slice(0,1800))}</small></div></div>`:""}</div></div>
 <div id="tab-sources" class="tabpane" hidden><div class="list"><div class="row"><small>Bangladesh medicine corpus • FDA DailyMed-derived DDI dataset • openFDA labels • curated interaction rules.</small></div></div></div>
 <div class="actions"><button class="primary" data-add-stack-med="${r.__id}">＋ My Stack</button><button class="primary" data-add-int-med="${r.__id}">⚡ Interaction</button></div>`;
 $$("#medBody [data-tab]").forEach(bu=>bu.onclick=()=>{$$("#medBody [data-tab]").forEach(x=>x.classList.remove("active"));bu.classList.add("active");$$(".tabpane",$("#medBody")).forEach(x=>x.hidden=true);$("#tab-"+bu.dataset.tab).hidden=false})
}
function initHero(){const c=$("#heroCanvas");if(!c||!window.THREE)return;const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,c.clientWidth/(c.clientHeight||430),.1,100),r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});r.setSize(c.clientWidth,c.clientHeight||430,false);r.setPixelRatio(Math.min(devicePixelRatio,1.5));cam.position.z=5;const g=new THREE.Group();sc.add(g);for(let i=0;i<70;i++){const geo=i%5===0?new THREE.CapsuleGeometry(.07,.25,4,8):new THREE.IcosahedronGeometry(.1+Math.random()*.04,1),m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:[0x6be6b8,0x19c98f,0x9cde62,0xd8bb6b][i%4]}));m.position.set((Math.random()-.5)*7,(Math.random()-.5)*4,(Math.random()-.5)*3);m.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);g.add(m)}let t=0;(function loop(){if(!document.body.contains(c)){r.dispose();return}t+=.0035;g.rotation.y=t;g.rotation.x=Math.sin(t)*.1;r.render(sc,cam);requestAnimationFrame(loop)})()}
window.addEventListener("popstate",()=>{const v=(location.hash||"#home").slice(1);setView(["home","database","interactions","supplements","stack"].includes(v)?v:"home",false)});
render();
