window.AUTOPOISK_INITIAL_DATA=(window.AUTOPOISK_INITIAL_DATA||[]).concat([{"model":"TOYOTA RAV4","plate":"А824ХВ96","org":"ООО «УГРК»","validTo":"2026-12-31"},{"model":"JAC T6","plate":"У115ОТ797","org":"ООО «Уралгеопроект»","validTo":"2026-12-31"},{"model":"УАЗ","plate":"О443МО45","org":"ООО «Уралгеопроект»","validTo":"2026-12-31"},{"model":"УАЗ ПИКАП","plate":"Р507ХУ196","org":"ООО «УЦСБ»","validTo":"2026-12-31"},{"model":"МОСКВИЧ 3","plate":"Н032ХХ797","org":"ООО «ФОРТА»","validTo":"2026-12-31"},{"model":"МОСКВИЧ 3A","plate":"Н232ОС164","org":"ООО «ФОРТА»","validTo":"2026-12-31"},{"model":"27772A","plate":"С207ОТ89","org":"ООО «ФУД-СЕВЕР»","validTo":"2026-12-31"},{"model":"2824FD","plate":"С723ПХ89","org":"ООО «ФУД-СЕВЕР»","validTo":"2026-12-31"},{"model":"ГИРД","plate":"С519СВ89","org":"ООО «ФУД-СЕВЕР»","validTo":"2026-12-31"},{"model":"Не указано","plate":"Е722МА89","org":"ООО «Чистый дом»","validTo":"2026-12-31"},{"model":"GAZ SADKO NEXT","plate":"С711НХ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"GAZELLE NEXT","plate":"С726НХ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"GAZELLE NEXT","plate":"С741НХ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"XCMG ZL50GV","plate":"СК259389","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"YUTONG ZK6122H9","plate":"В303ХВ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"YUTONG ZK6122H9","plate":"В329ХН89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"ГАЗ СОБОЛЬ","plate":"С735НХ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"ГИРД","plate":"В663НМ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"КАМАЗ ТАУРУС","plate":"С046УВ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"УАЗ ПАТРИОТ","plate":"С178НХ89","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"ХИЩНИК-3930","plate":"СМ529389","org":"ООО «ЯмалТрансАвто»","validTo":"2026-12-31"},{"model":"38788","plate":"В996СН186","org":"ООО Компания ДиС","validTo":"2026-12-31"},{"model":"CHEREAU","plate":"АХ883686","org":"ООО Компания ДиС","validTo":"2026-12-31"},{"model":"SCANIA G380 A4X2NA","plate":"В235НТ186","org":"ООО Компания ДиС","validTo":"2026-12-31"},{"model":"SCANIA G440A6X4NA","plate":"В170СЕ186","org":"ООО Компания ДиС","validTo":"2026-12-31"},{"model":"SCANIA G4X200 ADR FL","plate":"Е663ОТ186","org":"ООО Компания ДиС","validTo":"2026-12-31"},{"model":"SCANIA P380B6X2NA","plate":"М767СН186","org":"ООО Компания ДиС","validTo":"2026-12-31"},{"model":"SCHMITZ SKO 24","plate":"ВА710586","org":"ООО Компания ДиС","validTo":"2026-12-31"},{"model":"LADA LARGUS","plate":"У896НО102","org":"ООО НПФ «ЛЭА»","validTo":"2026-12-31"},{"model":"LADA LARGUS","plate":"М210ХА196","org":"ООО ТМК «Периметр»","validTo":"2026-12-31"},{"model":"AP 57435C","plate":"В011УО89","org":"","validTo":"2026-12-31"},{"model":"HINO","plate":"Т337РУ72","org":"","validTo":"2026-12-31"},{"model":"HYUNDAI HD78","plate":"У236ЕК799","org":"","validTo":"2026-12-31"},{"model":"KRONE SDR27","plate":"АО170139","org":"","validTo":"2026-12-31"},{"model":"LADA GRANTA","plate":"В939НК761","org":"","validTo":"2026-12-31"},{"model":"LADA LARGUS","plate":"Х263МВ763","org":"","validTo":"2026-12-31"},{"model":"NISSAN AD EXPERT","plate":"С405ОМ142","org":"","validTo":"2026-12-31"},{"model":"VOLKSWAGEN MULTIVAN","plate":"М770ВО89","org":"","validTo":"2026-12-31"},{"model":"АФ 57435C 02","plate":"М487МВ797","org":"","validTo":"2026-12-31"},{"model":"ВАЗ","plate":"Е703СВ763","org":"","validTo":"2026-12-31"},{"model":"JAC T8","plate":"Р953НЕ797","org":"ООО «Инженерный центр «Энергосервис»»","validTo":"2026-12-31"}]);

var AUTOPOISK_OFFICIAL_UPDATE_20260829=[
  {"model":"JAC T6","plate":"С958ХМ89","org":"ООО «ФАЗА»","validTo":"2026-09-15"},
  {"model":"17364-0000010-12","plate":"Н627НР196","org":"ООО «Объединенные кондитеры» (собственник ООО «Стрела»)","validTo":"2026-09-13"}
];
window.AUTOPOISK_INITIAL_DATA=(window.AUTOPOISK_INITIAL_DATA||[]).concat(AUTOPOISK_OFFICIAL_UPDATE_20260829);

(function mergeOfficialUpdateIntoSavedBase(){
  try{
    var key="avtopoisk_chrome_v12";
    var raw=localStorage.getItem(key);
    if(!raw)return;
    var data=JSON.parse(raw);
    if(!Array.isArray(data))return;
    var map={'А':'A','В':'B','С':'C','Е':'E','Н':'H','К':'K','М':'M','О':'O','Р':'P','Т':'T','Х':'X','У':'Y'};
    function normPlateLocal(v){
      var s=String(v||'').trim().toUpperCase(),out='',i,ch;
      for(i=0;i<s.length;i++){ch=s.charAt(i);out+=map[ch]?map[ch]:ch}
      return out.replace(/[^A-Z0-9]/g,'');
    }
    var existing={};
    for(var i=0;i<data.length;i++)existing[normPlateLocal(data[i]&&data[i].plate)]=true;
    var changed=false;
    for(var j=0;j<AUTOPOISK_OFFICIAL_UPDATE_20260829.length;j++){
      var car=AUTOPOISK_OFFICIAL_UPDATE_20260829[j];
      var p=normPlateLocal(car.plate);
      if(!existing[p]){data.push(car);existing[p]=true;changed=true;}
    }
    if(changed)localStorage.setItem(key,JSON.stringify(data));
  }catch(e){}
})();