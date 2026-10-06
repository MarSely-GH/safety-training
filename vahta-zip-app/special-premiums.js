(function(){
  'use strict';
  if(typeof S==='undefined' || typeof calcYear!=='function' || typeof Yr!=='function' || typeof render!=='function') return;

  function arr12(a){ return Array.isArray(a)&&a.length===12 ? a : new Array(12).fill(0); }
  function ensureYear(y,yr){
    const had = Array.isArray(yr.specials) && yr.specials.length===12;
    yr.specials = arr12(yr.specials);
    if(!had && Number(y)===2026){
      // Из фактической расчётки: август 2026, "Премия ДеньНефтеГаз%" = 40 986 ₽.
      if(!(yr.extras && Number(yr.extras[7])>0)) yr.specials[7]=40986;
      // По данным владельца: премия к 23 февраля в 2026 году была 20% оклада.
      if(!(yr.extras && Number(yr.extras[1])>0)){
        const feb = Number(yr.oklads && yr.oklads[1]) || 47438;
        yr.specials[1]=Math.round(feb*20)/100;
      }
    }
    return yr;
  }

  Object.keys(S.years||{}).forEach(y=>ensureYear(y,S.years[y]));

  const oldYr = Yr;
  Yr = function(y){ return ensureYear(y,oldYr(y)); };

  calcYear = function(y){
    var yr=Yr(y),p=S.p,rk=p.rk/100,sn=p.sn/100,prem=p.prem/100,mult=1+rk+sn;
    var months=[],ytdM=0,ytdR=0;
    var runs=[],cr=null;
    for(var q1=0;q1<12;q1++){var D1=dim(y,q1);
      for(var q2=1;q2<=D1;q2++){
        if((yr.grids[q1][q2-1]||"В")==="О"){
          if(!cr){cr={m0:q1,d0:q2,len:0};runs.push(cr);}
          cr.len++;
        } else cr=null;
      }}
    var vacPay={};
    runs.forEach(function(r,i){
      var st=new Date(y,r.m0,r.d0),pd=new Date(st);pd.setDate(pd.getDate()-3);
      r.gross=r.len*(Number(S.vac.avg)||0)+(i===0?(Number(S.vac.bonus)||0):0);
      r.payY=pd.getFullYear();r.payM=pd.getMonth();r.payD=pd.getDate();
      if(r.payY===y)vacPay[r.payM]=(vacPay[r.payM]||0)+r.gross;
    });
    for(var m=0;m<12;m++){
      var D=dim(y,m),tar=S.norma>0?yr.oklads[m]/S.norma:0,nrt=tar*(p.night/100);
      var hol=HOLIDAYS[m]||[],days=[];
      var hours=0,nightH=0,holH=0,wd=0,onD=0,mvD=0,b15=0,v15=0,gross=0,vah=0,rksnS=0;
      for(var d=1;d<=D;d++){
        var code=yr.grids[m][d-1]||"В",c=CODES[code]||CODES["В"];
        var op=c.h*tar,hp=hol.indexOf(d)>=0?c.h*tar:0,np=c.n*nrt;
        var lp=op*(S.lich/100),bt=op+hp+np+lp,bp=op+np,pp=bp*prem;
        var vp=c.on?p.vahtaDay:0,tp=(c.k==="move")?yr.travels[m]:0;
        var rs=bt*(rk+sn)+pp*(rk+sn),g=bt*mult+pp*mult+vp+tp;
        days.push({d:d,code:code,k:c.k,hol:hol.indexOf(d)>=0,gross:g,vahtaPay:vp,h:c.h,n:c.n,net:0});
        gross+=g;vah+=vp;rksnS+=rs;hours+=c.h;nightH+=c.n;if(hp>0)holH+=c.h;
        if(c.k==="day"||c.k==="night")wd++;
        if(c.on)onD++;
        if(c.k==="move")mvD++;
        if(d<=15){b15+=op+hp+np;v15+=vp;}
      }
      var vacA=vacPay[m]||0,ex=yr.extras[m]||0;
      var specialBase=Number(yr.specials[m])||0;
      var specialGross=specialBase*mult;
      var acc=gross+ex+vacA+specialGross,tax=acc-vah;
      var rB=rksnS + specialBase*(rk+sn) + (ex+vacA)*(rk+sn)/mult, mB=tax-rB;
      function st(a,ad,li){var e=a+ad;
        return Math.max(0,Math.min(e,li)-a)*(p.ndfl1/100)+Math.max(0,e-Math.max(a,li))*(p.ndfl2/100);}
      var ndfl=Math.round(st(ytdM,mB,p.limMain)+st(ytdR,rB,p.limRksn));
      ytdM+=mB;ytdR+=rB;
      var prof=tax*(p.prof/100),net=acc-ndfl-prof,rate=tax>0?(ndfl+prof)/tax:0;
      days.forEach(function(x){x.net=x.gross-(x.gross-x.vahtaPay)*rate;});
      var vacNet=vacA*(1-p.ndfl1/100-p.prof/100);
      var av=b15*mult*(1-p.ndfl1/100-p.prof/100)*p.avansK+v15;
      av=Math.min(Math.max(av,0),Math.max(net-vacNet,0));
      months.push({y:y,m:m,days:days,hours:hours,nightH:nightH,holH:holH,workDays:wd,onDays:onD,
        moveDays:mvD,extra:ex,specialBase:specialBase,specialGross:specialGross,accrued:acc,vahta:vah,taxable:tax,ndfl:ndfl,prof:prof,net:net,
        avans:av,rest:net-av-vacNet,tariff:tar,ytd:ytdM+ytdR,rksnBase:rB,vacA:vacA,vacNet:vacNet});
    }
    months.vacRuns=runs;
    return months;
  };

  const oldRender = render;
  function inject(){
    try{
      const sy=S.selY||S.cur, sm=S.sel;
      const yr=Yr(sy), base=Number(yr.specials[sm])||0;
      const p=S.p, coeff=(Number(p.rk)||0)+(Number(p.sn)||0);

      const leaf=Array.from(document.querySelectorAll('#app section')).find(s=>{
        const h=s.querySelector('h2'); return h && h.textContent.trim().startsWith('Листок ·');
      });
      if(leaf && base>0 && !leaf.querySelector('[data-special-line]')){
        const total=leaf.querySelector('.tot');
        if(total){
          const one=document.createElement('div');
          one.className='line'; one.setAttribute('data-special-line','1');
          one.innerHTML='<span class="code">2652</span><span class="nm">Премия к празднику — база</span><span class="qt">'+rub(base)+'</span>';
          total.parentNode.insertBefore(one,total);
          const two=document.createElement('div');
          two.className='line'; two.setAttribute('data-special-line','1');
          two.innerHTML='<span class="code">РК/СН</span><span class="nm">РК + СН на праздничную премию</span><span class="qt">'+rub(base*coeff/100)+'</span>';
          total.parentNode.insertBefore(two,total);
        }
      }

      if(S.panel==='oklad'){
        const panel=document.querySelector('#app .panel');
        const table=panel && panel.querySelector('table');
        if(table && !table.querySelector('[data-special-head]')){
          const hr=table.querySelector('thead tr');
          if(hr){
            const th=document.createElement('th'); th.className='l'; th.setAttribute('data-special-head','1');
            th.textContent='Праздн. премия, база';
            hr.insertBefore(th,hr.children[3]||null);
          }
          Array.from(table.querySelectorAll('tbody tr')).forEach((tr,i)=>{
            const td=document.createElement('td');
            td.innerHTML='<input type="number" step="0.01" data-special="'+i+'" value="'+(Number(Yr(S.cur).specials[i])||0)+'">';
            tr.insertBefore(td,tr.children[3]||null);
          });
          const note=panel.querySelector('p.note');
          if(note) note.innerHTML='«Праздн. премия, база» — сумма премии <b>до РК/СН</b>; программа сама добавит районный и северный коэффициенты. Для августа 2026 из расчётки: <b>40 986 ₽</b>. «Прочие начисления» оставлены для сумм, которые уже известны целиком.';
        }
      }
    }catch(e){}
  }
  render = function(){ oldRender(); inject(); };

  document.addEventListener('change',function(e){
    const el=e.target.closest && e.target.closest('[data-special]');
    if(!el)return;
    const i=Number(el.getAttribute('data-special'));
    if(i<0||i>11)return;
    Yr(S.cur).specials[i]=Number(el.value)||0;
    save(); render();
  });

  save();
  render();
})();