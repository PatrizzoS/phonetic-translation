const K='pt-wb-v1', $=id=>document.getElementById(id), pt=$('pt');
const modes=['auto','light','dark'], icons={auto:'◐ Auto',light:'☀ Light',dark:'☾ Dark'};
let mode='auto'; try{ mode=localStorage.getItem('pt-wb-theme')||'auto'; }catch(e){}
function applyTheme(){ if(mode==='auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme=mode; $('theme').textContent=icons[mode]; }
$('theme').onclick=()=>{ mode=modes[(modes.indexOf(mode)+1)%3]; try{ localStorage.setItem('pt-wb-theme',mode); }catch(e){} applyTheme(); };
applyTheme();
let db={}, words=[], cur='', q='';
try{ const s=JSON.parse(localStorage.getItem(K)||'{}'); db=s.db||{}; words=s.words||words; }catch(e){}
const save=()=>{ try{ localStorage.setItem(K,JSON.stringify({db,words})); }catch(e){} };
const nDone=()=>words.filter(w=>db[w]).length;
function list(){
  const L=$('list'); L.textContent='';
  words.filter(w=>!q||w.includes(q)).forEach(w=>{
    const b=document.createElement('button'); b.className='pill'+(w===cur?' on':'')+(db[w]?' done':'');
    b.textContent=w; b.title=db[w]?db[w].phonetic:''; b.onclick=()=>go(w); L.append(b);
  });
  $('count').textContent=words.length+' words · '+nDone()+' done'; $('saved').textContent=nDone()+' saved';
}
function go(w){
  const has=!!w; $('empty').hidden=has; pt.hidden=!has; ['prev','next','done'].forEach(i=>$(i).disabled=!has);
  if(!has){ cur=''; $('pos').textContent='No words yet'; list(); return; }
  cur=w; pt.setWord(w, db[w]&&db[w].units);
  $('pos').textContent='Word '+(words.indexOf(w)+1)+' of '+words.length+(db[w]?'  ✓':''); list();
}
const step=d=>words.length&&go(words[(words.indexOf(cur)+d+words.length)%words.length]);
pt.addEventListener('phonetic-change',e=>{ db[cur]=e.detail; save(); list(); });
$('prev').onclick=()=>step(-1); $('next').onclick=()=>step(1);
$('done').onclick=()=>{ db[cur]=pt.state; save(); step(1); };
$('q').oninput=e=>{ q=e.target.value.toUpperCase().trim(); list(); };

/* ---- import ---- */
const parse=t=>[...new Set(t.toUpperCase().split(/[\s,;]+/).filter(x=>/^[A-Z]+$/.test(x)))];
function fromRows(rows){
  const h=(rows[0]||[]).map(x=>String(x==null?'':x).trim()), i=h.findIndex(x=>/^words?$/i.test(x)), c=Math.max(i,0);
  return parse(rows.slice(i>-1?1:0).map(r=>r[c]==null?'':String(r[c])).join('\n'));
}
const loadXLSX=()=>window.XLSX?Promise.resolve():new Promise((ok,no)=>{
  const s=document.createElement('script'); s.src='vendor/xlsx.full.min.js';
  s.onload=ok; s.onerror=()=>no(new Error('Could not load the Excel reader. Save the sheet as CSV and try again.')); document.head.appendChild(s);
});
async function readFile(f){
  if(/\.xlsx?$/i.test(f.name)){
    await loadXLSX(); const wb=XLSX.read(await f.arrayBuffer());
    const name=wb.SheetNames.find(s=>/word/i.test(s))||wb.SheetNames[0];
    return {name, list:fromRows(XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1}))};
  }
  const t=await f.text();
  return {name:f.name, list:/[,\t]/.test(t.split(/\r?\n/)[0])?fromRows(t.split(/\r?\n/).map(l=>l.split(/[,\t]/))):parse(t)};
}
function useWords(list,src){
  if(!list.length){ $('msg').textContent='No words found.'; return; }
  words=list; save(); $('msg').textContent='Loaded '+list.length+' words'+(src?' from '+src:'')+'.';
  go(words[0]); $('d-add').open=false;
}
async function onFile(f){
  if(!f) return; $('msg').textContent='Reading…';
  try{ const r=await readFile(f); useWords(r.list,r.name); }catch(e){ $('msg').textContent=e.message; }
}
$('file').onchange=e=>onFile(e.target.files[0]);
['dragenter','dragover'].forEach(n=>$('drop').addEventListener(n,e=>{ e.preventDefault(); $('drop').classList.add('over'); }));
['dragleave','drop'].forEach(n=>$('drop').addEventListener(n,e=>{ e.preventDefault(); $('drop').classList.remove('over'); }));
$('drop').addEventListener('drop',e=>onFile(e.dataTransfer.files[0]));
$('use').onclick=()=>useWords(parse($('in').value));

/* ---- export ---- */
const rows=()=>words.filter(w=>db[w]);
const cell=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
const csv=()=>['word,respelling,arpabet,tag',...rows().map(w=>[w,db[w].phonetic,db[w].arpabet,db[w].tag].map(cell).join(','))].join('\n');
const dl=(n,t,m)=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([t],{type:m})); a.download=n; a.click(); };
$('csvc').onclick=()=>{ try{ navigator.clipboard.writeText(csv()); }catch(e){} };
$('csvd').onclick=()=>dl('phonetics.csv',csv(),'text/csv');
$('json').onclick=()=>dl('phonetics.json',JSON.stringify(db,null,1),'application/json');
go(words[0]);
$('clear').onclick=()=>{
  if(!words.length&&!Object.keys(db).length) return;
  if(confirm('Clear the word list and all saved pronunciations?')){ words=[]; db={}; save(); $('msg').textContent=''; $('d-add').open=true; go(); }
};
