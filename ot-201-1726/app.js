const DATA=window.DATA||[];
const $=s=>document.querySelector(s);
const inp=$('#search'), mod=$('#module'), list=$('#list'), count=$('#count'), mic=$('#mic'), hint=$('#hint');
const STOP=new Set(('какие какой какая какое каков какова каково каковы что где когда кто как ли для при из на в во по и или а к ко от до с со у о об про за над под между должен должна должно должны нужно необходимо следует рекомендуется рекомендовано рекомендуемый установите установить выберите выбрать укажите указать определите определить перечисленных перечисленное перечисленные следующих следующего верно правильно является относятся относится требуется разрешается допускается можно нельзя имеет имеется быть будет'.split(' ')));
function norm(s){return String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').trim()}
function words(s){return norm(s).split(/\s+/).filter(Boolean)}
function terms(s){const a=words(s).filter(x=>x.length>1), b=a.filter(x=>!STOP.has(x));return b.length?b:a}
function stem(w){if(w.length<=5)return w;return w.slice(0,5)}
function hitTerm(t,arr){if(arr.includes(t))return 3;const st=stem(t);if(st.length>=4&&arr.some(w=>w.length>=4&&stem(w)===st))return 2;return 0}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const IDX=DATA.map(o=>{
  const at=(o.a||[]).join(' ');
  return {o,qw:words(o.q),aw:words(at),qn:norm(o.q),an:norm(at)};
});
function score(ix,ts,phrase){
  if(!ts.length)return 1;
  let matched=0, z=0;
  for(const t of ts){
    let h=0;
    if(ix.qn.includes(t)){h=4;z+=30}
    else{h=hitTerm(t,ix.qw);if(h)z+=h===3?22:14}
    if(!h){
      if(ix.an.includes(t)){h=3;z+=8}
      else{const ah=hitTerm(t,ix.aw);if(ah){h=ah;z+=5}}
    }
    if(h)matched++;
  }
  const need=ts.length<=2?ts.length:Math.max(2,Math.ceil(ts.length*.5));
  if(matched<need)return -1;
  if(phrase&&ix.qn.includes(phrase))z+=100;
  return z+matched*5;
}
function highlight(s,ts){
  let out=esc(s);
  for(const t of [...new Set(ts)].sort((a,b)=>b.length-a.length)){
    if(t.length<3)continue;
    const x=t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    out=out.replace(new RegExp('('+x+')','gi'),'<mark>$1</mark>');
  }
  return out;
}
function label(m){return m==='201'?'ОТ 201.13':'ОТ 1726.13'}
function render(){
  const phrase=norm(inp.value), ts=terms(inp.value), mv=mod.value;
  if(!phrase && !mv){
    list.innerHTML='<div class="intro">Выберите раздел или введите/скажите часть вопроса.<br>Поиск работает сразу по обоим файлам.</div>';
    count.textContent='Всего: '+DATA.length+' вопросов';
    return;
  }
  let arr=IDX.filter(x=>!mv||x.o.m===mv);
  if(phrase){
    arr=arr.map(x=>[x,score(x,ts,phrase)]).filter(x=>x[1]>=0).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  }
  const rows=arr.map(x=>x.o);
  count.textContent=(phrase?'Найдено: ':'В разделе: ')+rows.length;
  if(!rows.length){
    list.innerHTML='<div class="intro">Ничего не найдено. Попробуйте сказать или написать 1–3 ключевых слова.</div>';
    return;
  }
  list.innerHTML=rows.map(o=>{
    const ans=(o.a||[]).map(a=>'<div class="aline">'+highlight(a,ts)+'</div>').join('');
    return '<article class="card"><div class="meta">'+label(o.m)+' · вопрос '+o.n+' · стр. '+o.p+'</div><div class="q">'+highlight(o.q,ts)+'</div><div class="answer"><small>ПРАВИЛЬНЫЙ ОТВЕТ</small>'+ans+'</div></article>';
  }).join('');
}
let timer;
inp.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,40)});
mod.addEventListener('change',()=>{inp.value='';hint.textContent='';render()});
render();
(()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){
    mic.addEventListener('click',()=>hint.textContent='Голосовой поиск не поддерживается этим браузером. Попробуйте Chrome.');
    return;
  }
  const rec=new SR();
  rec.lang='ru-RU'; rec.interimResults=false; rec.continuous=false; rec.maxAlternatives=1;
  rec.onstart=()=>{mic.classList.add('on');mic.textContent='●';hint.textContent='Говорите…'};
  rec.onresult=e=>{
    const t=(e.results&&e.results[0]&&e.results[0][0]&&e.results[0][0].transcript||'').trim();
    if(!t)return;
    inp.value=t; render(); inp.focus(); hint.textContent='Распознано: «'+t+'»';
  };
  rec.onerror=e=>{
    let m='Не удалось распознать речь.';
    if(e.error==='not-allowed'||e.error==='service-not-allowed')m='Разрешите браузеру доступ к микрофону.';
    else if(e.error==='no-speech')m='Речь не услышана. Нажмите микрофон и попробуйте ещё раз.';
    else if(e.error==='audio-capture')m='Микрофон недоступен.';
    hint.textContent=m;
  };
  rec.onend=()=>{mic.classList.remove('on');mic.textContent='🎤'};
  mic.addEventListener('click',()=>{try{rec.start()}catch(_){}});
})();
