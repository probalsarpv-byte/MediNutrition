
window.SMN_DATA=(()=>{
 const C=window.SMN_CONFIG.sources;
 const cache={med:null,ddi:null,labels:new Map(),dsldLabels:new Map()};
 function parseCSV(text){
   const rows=[];let row=[],field="",q=false;
   for(let i=0;i<text.length;i++){const c=text[i];
     if(q){if(c=='"'&&text[i+1]=='"'){field+='"';i++}else if(c=='"')q=false;else field+=c}
     else{if(c=='"')q=true;else if(c==","){row.push(field);field=""}else if(c=="\n"){row.push(field.replace(/\r$/,""));rows.push(row);row=[];field=""}else field+=c}}
   if(field.length||row.length){row.push(field);rows.push(row)}
   if(!rows.length)return[];
   const h=rows[0].map(x=>x.trim());
   return rows.slice(1).filter(r=>r.some(v=>String(v||"").trim())).map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]??"");return o})
 }
 async function fetchText(url){const r=await fetch(url,{cache:"force-cache"});if(!r.ok)throw new Error("HTTP "+r.status);return r.text()}
 async function fetchJSON(url){const r=await fetch(url,{cache:"force-cache"});if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}
 async function medicine(cb){
   if(cache.med)return cache.med;cb?.("Loading Bangladesh medicine corpus…");
   const rows=parseCSV(await fetchText(C.medicineCorpus));
   rows.forEach((r,i)=>{r.__id="MED_"+String(i+1).padStart(6,"0");r.__search=[r.generic_name,r.brand_name,r.manufacturer,r.strength,r.dosage_form,r.common_uses,r.medicine_type].join(" ").toLowerCase().normalize("NFKC")});
   cache.med=rows;return rows
 }
 async function ddi(cb){
   if(cache.ddi)return cache.ddi;cb?.("Loading drug–drug interaction data…");
   cache.ddi=parseCSV(await fetchText(C.ddi));return cache.ddi
 }
 function ddiCols(rows){
   if(!rows?.length)return{a:[],b:[],desc:[],sev:[]};const h=Object.keys(rows[0]);
   return{a:h.filter(x=>/(drug.?1|drug.?a|subject|precipitant|primary)/i.test(x)),b:h.filter(x=>/(drug.?2|drug.?b|object|affected|secondary)/i.test(x)),desc:h.filter(x=>/(interaction|description|sentence|label|text|effect)/i.test(x)),sev:h.filter(x=>/(severity|risk|level)/i.test(x))}
 }
 async function findDDI(generic,limit=60){
   const q=String(generic||"").toLowerCase().trim();if(!q)return[];
   const rows=await ddi(),c=ddiCols(rows),out=[];
   for(const r of rows){const whole=Object.values(r).join(" ").toLowerCase();if(!whole.includes(q))continue;
     const va=c.a.map(k=>String(r[k]||"")).join(" "),vb=c.b.map(k=>String(r[k]||"")).join(" ");
     let other="";if(va.toLowerCase().includes(q))other=vb;else if(vb.toLowerCase().includes(q))other=va;
     out.push({other,description:c.desc.map(k=>r[k]).find(Boolean)||"",severity:c.sev.map(k=>r[k]).find(Boolean)||""});if(out.length>=limit)break}
   return out
 }
 async function checkPair(a,b,limit=5){
   const x=String(a||"").toLowerCase().trim(),y=String(b||"").toLowerCase().trim();if(!x||!y)return[];
   const rows=await ddi(),c=ddiCols(rows),out=[];
   for(const r of rows){const whole=Object.values(r).join(" ").toLowerCase();if(!(whole.includes(x)&&whole.includes(y)))continue;
     out.push({description:c.desc.map(k=>r[k]).find(Boolean)||"",severity:c.sev.map(k=>r[k]).find(Boolean)||""});if(out.length>=limit)break}
   return out
 }
 async function openFDALabel(generic,brand=""){
   const key=(generic+"|"+brand).toLowerCase();if(cache.labels.has(key))return cache.labels.get(key);
   const clean=s=>String(s||"").replace(/\([^)]*\)/g," ").replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu|%|mg\/ml|mg\/5 ml)\b/gi," ").replace(/\s+/g," ").trim();
   const g=clean(generic),b=clean(brand),parts=g.split(/\s*\+\s*|\s*&\s*|\s*,\s*/).filter(Boolean);
   const qs=[];if(g){qs.push(`openfda.generic_name:"${g}"`,`openfda.substance_name:"${g}"`)}if(b)qs.push(`openfda.brand_name:"${b}"`);
   parts.slice(0,4).forEach(p=>{if(p.length>2)qs.push(`openfda.substance_name:"${p}"`,`openfda.generic_name:"${p}"`)});
   for(const q0 of qs){try{const j=await fetchJSON(`${C.openfda}?search=${encodeURIComponent(q0)}&limit=3`);if(j.results?.[0]){cache.labels.set(key,j.results[0]);return j.results[0]}}catch(e){}}
   cache.labels.set(key,null);return null
 }
 async function dsldSearch(q,from=0,size=30){
   q=String(q||"").trim();if(!q)return{hits:[],total:0};
   const url=`${C.dsldBase}/browse-products/?method=by_keyword&q=${encodeURIComponent(q)}&from=${from}&size=${size}`;
   const j=await fetchJSON(url);
   const hits=(j.hits||[]).map(h=>({id:String(h._id||h._source?.id||""),...(typeof h._source==="string"?JSON.parse(h._source):h._source||{})}));
   const total=typeof j.total==="number"?j.total:(j.total?.value||0);
   return{hits,total}
 }
 async function dsldLabel(id){
   id=String(id);if(cache.dsldLabels.has(id))return cache.dsldLabels.get(id);
   const j=await fetchJSON(`${C.dsldBase}/label/${encodeURIComponent(id)}`);cache.dsldLabels.set(id,j);return j
 }
 return{medicine,findDDI,checkPair,openFDALabel,dsldSearch,dsldLabel}
})();
