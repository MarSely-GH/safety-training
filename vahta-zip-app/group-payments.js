(function(){
  'use strict';
  let busy=false;
  function fmt(v){
    return (Number(v)||0).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
  }
  function mainText(el){
    return Array.from(el.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
  }
  function parseWhen(txt){
    const p=String(txt||'').trim().split(/\s+/);
    if(p.length<2||typeof MSHORT==='undefined'||typeof S==='undefined')return null;
    const d=parseInt(p[0],10),m=MSHORT.indexOf(p[1]),y=p[2]?parseInt(p[2],10):S.cur;
    if(!d||m<0||!y)return null;
    return {d,m,y};
  }
  function patch(){
    if(busy)return;
    busy=true;
    try{
      const sections=Array.from(document.querySelectorAll('#app section'));
      const sec=sections.find(s=>{
        const h=s.querySelector('h2');
        return h&&h.textContent.trim()==='Выплаты';
      });
      if(!sec||typeof payments!=='function')return;
      const rows=Array.from(sec.querySelectorAll(':scope > .pay'));
      if(!rows.length)return;
      const grouped=new Map();
      rows.forEach(row=>{
        const w=parseWhen(row.querySelector('.when')?.textContent);
        if(!w)return;
        const key=w.y+'-'+w.m+'-'+w.d;
        if(!grouped.has(key))grouped.set(key,[]);
        grouped.get(key).push({row,w});
      });
      const all=payments();
      grouped.forEach(items=>{
        const w=items[0].w;
        const pieces=all.filter(q=>q.y===w.y&&q.m===w.m&&q.d===w.d);
        if(!pieces.length)return;
        const total=pieces.reduce((s,q)=>s+(Number(q.sum)||0),0);
        const first=items[0].row;
        const what=first.querySelector('.what');
        const sum=first.querySelector('.sum');
        if(what){
          if(pieces.length>1){
            const details=pieces.map(q=>q.txt+' '+fmt(q.sum)).join(' + ');
            what.innerHTML='Итого придёт<small>'+details+'</small>';
          }
        }
        if(sum)sum.innerHTML=fmt(total)+'<small>вся выплата за эту дату</small>';
        items.slice(1).forEach(x=>x.row.remove());
      });
      const meta=sec.querySelector('.shead .meta');
      if(meta)meta.textContent='одной суммой на дату';
    }finally{
      busy=false;
    }
  }
  const mo=new MutationObserver(()=>setTimeout(patch,0));
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(patch,50);
  setTimeout(patch,400);
})();
