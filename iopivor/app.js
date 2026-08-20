(()=>{
const RULES=window.IOPIVOR_RULES||[];
const q=document.getElementById('q'),mic=document.getElementById('mic'),hint=document.getElementById('hint'),results=document.getElementById('results'),infoBtn=document.getElementById('infoBtn'),info=document.getElementById('info');
infoBtn.addEventListener('click',()=>info.classList.toggle('hidden'));
const norm=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[«»“”„"'()\[\]{}:;,.!?/\\\-]+/g,' ').replace(/\s+/g,' ').trim();
const stop=new Set('и или а но что как какой какая какое какие кто где когда для при на в во по из от до с со у о об про за над под между это этот эта эти если ли не мне нам ему ей их мой моя свои свое своего нужно надо можно нельзя должен должна должны делать сделать произошло происходит ситуация вопрос приехал приехала прибыл прибыла приехали прибыли'.split(' '));
const words=s=>norm(s).split(' ').filter(w=>w.length>2&&!stop.has(w));
const pref=w=>w.length>5?w.slice(0,5):w;
const executiveIntent=n=>/(генеральн\w* директор|гендиректор|зам\w* генеральн\w* директор|главн\w* инженер)/.test(n);
const visitorNoIdIntent=n=>/(посетител|гост|сторонн|иное лицо|иных лиц|человек)/.test(n)&&/(нет|без|отсутств|не имеет|не предъяв)/.test(n)&&/(документ|паспорт|удостоверя)/.test(n);
function scoreRule(r,text){
  const n=norm(text);
  if(r.id==='executive-access'&&!executiveIntent(n)) return {score:0,matched:0,total:0,phraseHits:0,keywordHits:0};
  if(r.id==='visitor-no-id'&&!visitorNoIdIntent(n)) return {score:0,matched:0,total:0,phraseHits:0,keywordHits:0};
  const ws=words(text),hayWords=norm([r.title,r.verdict,r.note,(r.steps||[]).join(' '),(r.docs||[]).join(' '),(r.refs||[]).join(' '),(r.keywords||[]).join(' '),(r.phrases||[]).join(' ')].join(' ')).split(' '),hay=hayWords.join(' ');
  let score=0,phraseHits=0,keywordHits=0,matched=0;
  (r.phrases||[]).forEach(p=>{if(n.includes(norm(p))){score+=22;phraseHits++}});
  (r.keywords||[]).forEach(k=>{const nk=norm(k);if(n.includes(nk)){score+=nk.includes(' ')?11:6;keywordHits++}});
  for(const w of ws){const p=pref(w);if(hay.includes(w)||hayWords.some(x=>x.startsWith(p))){matched++;score+=4}}
  if(ws.length&&matched===ws.length)score+=10;else if(ws.length&&matched/ws.length>=.67)score+=5;
  if(r.id==='document-refusal'&&/(документ|пропуск|удостоверен)/.test(n)&&/(отказ|не хочет|не дает|не даёт|не показывает|не предъявляет|не переда|отказывается)/.test(n))score+=26;
  if(r.id==='executive-access'&&executiveIntent(n))score+=50;
  if(r.id==='visitor-no-id'&&visitorNoIdIntent(n))score+=55;
  if(r.id==='wrong-pass'&&/(чуж|не свой|другого).*пропуск/.test(n))score+=18;
  if(r.id==='fire-emergency'&&/(авари|пожар|взрыв|мчс|скорая|спасат)/.test(n))score+=14;
  if(r.id==='foreign'&&/(иностран|без гражданства)/.test(n))score+=15;
  if(r.id==='drone'&&/(дрон|бвс|беспилот|квадрокоптер)/.test(n))score+=18;
  if(score>0)score+=Math.min(r.priority||0,12);
  return{score,matched,total:ws.length,phraseHits,keywordHits};
}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function renderRule(r,best=false){const refs=[...(r.refs||[]),...(r.amended||[])];return `<article class="card ${best?'best':''}"><div class="meta">${refs.map((x,i)=>`<span class="ref ${i>=(r.refs||[]).length?'amend':''}">${esc(x)}</span>`).join('')}</div><div class="title">${esc(r.title)}</div><div class="answer"><span class="label">ЧТО ГОВОРИТ ИНСТРУКЦИЯ</span>${esc(r.verdict||'')}</div>${r.steps&&r.steps.length?`<div class="block"><span class="label">ЧТО ДЕЛАТЬ</span><ol>${r.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`:''}${r.docs&&r.docs.length?`<div class="block"><span class="label">ЧТО ПРОВЕРИТЬ</span><ul>${r.docs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}${r.note?`<div class="source"><b>Основание:</b> ${esc(r.note)}</div>`:''}</article>`;}
function analyze(){
  const text=q.value.trim();if(!text){results.innerHTML='';hint.textContent='';return;}
  const n=norm(text);
  let forcedId=null;
  if(executiveIntent(n)) forcedId='executive-access';
  else if(visitorNoIdIntent(n)) forcedId='visitor-no-id';
  let pool=forcedId?RULES.filter(r=>r.id===forcedId):RULES.filter(r=>r.id!=='executive-access'&&r.id!=='visitor-no-id');
  const ranked=pool.map(r=>({r,...scoreRule(r,text)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score),best=ranked[0];
  if(!best||best.score<10){results.innerHTML='<div class="notfound"><b>Точного пункта не найдено.</b><br>Уточните, кто прибыл, куда, какие документы есть и что именно происходит.</div>';return;}
  if(forcedId){results.innerHTML=renderRule(best.r,true);return;}
  const selected=[best];for(const x of ranked.slice(1)){if(selected.length>=2)break;const close=x.score>=Math.max(16,best.score*.72);const meaningful=x.phraseHits>0||x.keywordHits>1||x.matched>=2;if(close&&meaningful)selected.push(x)}
  results.innerHTML=renderRule(selected[0].r,true)+(selected.length>1?'<div class="secondaryTitle">Также относится к ситуации</div>'+renderRule(selected[1].r,false):'');
}
let timer;q.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(analyze,350)});q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(timer);analyze();}});
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null,listening=false;
if(SR){rec=new SR();rec.lang='ru-RU';rec.interimResults=true;rec.continuous=false;let finalText='';rec.onstart=()=>{listening=true;finalText='';mic.classList.add('on');hint.textContent='Слушаю…';};rec.onresult=e=>{let interim='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=t+' ';else interim+=t;}q.value=(finalText+interim).trim();};rec.onerror=e=>{hint.textContent=e.error==='not-allowed'?'Нет разрешения на микрофон':'Не удалось распознать речь';};rec.onend=()=>{listening=false;mic.classList.remove('on');hint.textContent='';if(q.value.trim())analyze();};mic.addEventListener('click',()=>{try{listening?rec.stop():rec.start()}catch(_){}});}else{mic.disabled=true;hint.textContent='Голосовой ввод не поддерживается этим браузером';}
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
