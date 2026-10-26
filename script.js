/* ============ EDIT BAGIAN INI ============
   repo = link GitHub (kode), demo = link hosting (website jalan) */
const GROUP = {
  members: ["Raisyatul Alya · 24105111090", "Aida Yusira · 24105111072"],
  course: "Rekayasa Perangkat Lunak 2"
};
const PROJECTS = [
  { room:"library", title:"Discoveria", desc:"Portal edukasi interaktif berbasis Laravel yang menyediakan materi pelajaran (Matematika, Sains, Teknologi, Bahasa) lengkap dengan gambar, sistem kuis otomatis, pelacakan skor, serta fitur simpan favorit. Dibangun untuk menghadirkan pengalaman belajar yang lebih menyenangkan dan terstruktur.", tags:["Laravel","PHP","MySQL","TailwindCSS","E-Learning","Quiz System","Web App","Interactive Learning"], repo:"https://github.com/AidaYusira/discoveria", demo:"https://discoveria.wasmer.app/" },
  { room:"teachers", title:"Judul Project 2", desc:"Deskripsi singkat project 2.", tags:["Tag"], repo:"#", demo:"#" },
  { room:"class",    title:"Judul Project 3", desc:"Deskripsi singkat project 3.", tags:["Tag"], repo:"#", demo:"#" },
  { room:"canteen",  title:"Judul Project 4", desc:"Deskripsi singkat project 4.", tags:["Tag"], repo:"#", demo:"#" },
  { room:"garden",   title:"Final Project",   desc:"Deskripsi final project.",     tags:["Tag"], repo:"#", demo:"#" }
];

/* MODE FOTO (opsional): isi path gambar rasio 16:9 per ruangan agar tampil foto asli,
   mis. front:"img/front.jpg". Kosongkan "" untuk memakai ilustrasi bawaan.
   Posisi area klik bisa diatur di objek SPOTS (x, y, radius dari kanvas 1000x560). */
const IMAGES = { front:"", hall:"", library:"", teachers:"", class:"", canteen:"", garden:"" };
/* ======================================== */

const NAMES = { library:"Perpustakaan", teachers:"Ruang Guru", class:"Ruang Belajar", canteen:"Kantin", garden:"Taman Belakang" };
const $ = id => document.getElementById(id);
const KEY = "akademia-rpl2";
let visited = new Set(), scene = "front";
try { visited = new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch(e){}

/* ---------- helper gambar SVG ---------- */
const WOOD="url(#wood)", WOODD="url(#woodd)", CHAR="#3b3a38", MUS="#e3b04b", SAGE="#8fa98a", BLUE="#7f9fb5", CREAM="#f6efe2";
const P=["#c96f4a","#7f9fb5","#e3b04b","#8fa98a","#5d6f7a","#d9a0a0","#f0e0c0"];
const r=(x,y,w,h,f,rx=0,o="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" rx="${rx}" ${o}/>`;
const c=(x,y,q,f,o="")=>`<circle cx="${x}" cy="${y}" r="${q}" fill="${f}" ${o}/>`;
const e=(x,y,a,b,f,o="")=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${f}" ${o}/>`;
const ln=(a,b,x,y,w,s,o="")=>`<line x1="${a}" y1="${b}" x2="${x}" y2="${y}" stroke="${s}" stroke-width="${w}" ${o}/>`;
const poly=(pts,f,o="")=>`<polygon points="${pts}" fill="${f}" ${o}/>`;
const txt=(x,y,s,t,f,o="")=>`<text x="${x}" y="${y}" font-size="${s}" fill="${f}" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="600" ${o}>${t}</text>`;
const base=(wall,fy,floor)=>r(0,0,1000,fy,wall)+r(0,0,1000,fy,"url(#wallg)")+r(0,fy,1000,560-fy,floor)+r(0,fy,1000,560-fy,"url(#wood)",0,'opacity=".55"')+
  [1,2,3,4,5].map(i=>{const y=fy+(560-fy)*Math.pow(i/5,1.3);return ln(0,y,1000,y,1.5,"rgba(60,30,10,.28)")}).join("")+
  r(0,fy,1000,560-fy,"url(#floorg)")+r(0,fy-12,1000,12,WOODD)+r(0,fy-12,1000,3,"rgba(255,255,255,.25)")+ln(0,fy,1000,fy,3,"rgba(0,0,0,.3)");
const sh=x=>`<g filter="url(#sh)">${x}</g>`;
const hot=(attr,cx,cy,q,inner,label)=>`<g class="hot" ${attr} tabindex="0" role="button" aria-label="${label}"><g filter="url(#sh)">${inner}</g><circle class="ping" cx="${cx}" cy="${cy}" r="${q}"/>${txt(cx,cy-q-12,21,label,"#fff",'class="tip"')}</g>`;
const pendant=x=>ln(x,0,x,60,2,CHAR)+`<path d="M${x-32} 90a32 32 0 0 1 64 0z" fill="${MUS}"/>`+c(x,110,120,"url(#glow)",'style="mix-blend-mode:screen"');
const plant_=(x,y)=>r(x-18,y-34,36,34,"#b86f4b",4)+[-1,0,1].map(k=>e(x+k*16,y-58,10,28,SAGE,`transform="rotate(${k*22} ${x+k*16} ${y-40})"`)).join("");
const plant=(...a)=>sh(plant_(...a));
const desk_=(x,y,w)=>r(x,y,w,14,WOOD,3)+r(x+10,y+14,10,64,WOODD)+r(x+w-20,y+14,10,64,WOODD);
const desk=(...a)=>sh(desk_(...a));
const laptop=(x,y)=>r(x,y-42,64,42,CHAR,3)+r(x+4,y-38,56,34,"#9cc3d5",2)+r(x-6,y,76,5,"#999",2);
const papers=(x,y)=>r(x,y-10,44,10,"#fff")+r(x+5,y-18,44,8,"#f3e8d0");
const shelf_=(x,y,w,n)=>{let s=r(x,y,w,n*92+10,WOODD,4);for(let k=0;k<n;k++){const yy=y+10+k*92;s+=r(x+8,yy,w-16,84,"#8a5a30");let bx=x+12,j=k*3;while(bx<x+w-24){const bw=10+(j*7)%9,bh=52+(j*13)%28;s+=r(bx,yy+84-bh,bw,bh,P[j%7],1);bx+=bw+2;j++}s+=r(x+8,yy+84,w-16,6,WOODD)}return s};
const shelf=(...a)=>sh(shelf_(...a));
const kid=(x,y,col)=>`<g class="kid">${c(x,y-46,12,"#f1c9a5")}${r(x-11,y-34,22,34,col,8)}${ln(x-11,y-28,x-24,y-48,6,col,'stroke-linecap="round"')}${ln(x+11,y-28,x+24,y-48,6,col,'stroke-linecap="round"')}</g>`;
const chair_=(x,y)=>r(x,y-40,44,6,WOODD,2)+r(x+4,y-34,36,6,WOOD,2)+r(x+6,y-28,6,28,WOODD)+r(x+32,y-28,6,28,WOODD);
const chair=(...a)=>sh(chair_(...a));

/* ---------- scene ---------- */
const SCENES = {
front:()=>{
  const panel=(x,cls)=>`<g class="dp ${cls}">${r(x,208,112,254,"#bfe0e8",3,'stroke="#3b3a38" stroke-width="4" opacity=".92"')}${poly(`${x+12},460 ${x+60},208 ${x+84},208 ${x+36},460`,"#fff",'opacity=".25"')}${r(cls=="l"?x+92:x+12,320,8,50,CHAR,3)}</g>`;
  return r(0,0,1000,560,"url(#sky)")+c(860,90,46,"#ffe9a8")+e(170,110,70,20,"#fff",'opacity=".8"')+e(240,126,50,16,"#fff",'opacity=".8"')+
  r(0,470,1000,90,"#a9c9a0")+r(90,86,820,390,"#efe3cf")+r(70,62,860,32,WOODD,4)+
  r(330,110,340,64,SAGE,10)+txt(500,155,44,"AKADEMIA",CREAM,'letter-spacing="4"')+
  [150,720].map(x=>r(x,210,130,150,"url(#sky)",6,'stroke="#a8723e" stroke-width="6"')+ln(x+65,210,x+65,360,4,"#a8723e")).join("")+
  r(376,196,248,276,CHAR,6)+r(388,208,224,254,"#f5d48a")+
  hot('data-go="hall"',500,335,130,panel(388,"l")+panel(500,"r"),"Masuk")+
  r(300,470,400,22,"#d8c7a3")+plant(250,470)+plant(750,470)+plant(160,470)+plant(840,470);
},
hall:()=>{
  const cols=[WOOD,SAGE,BLUE,MUS,"#8fbf7f"],keys=["library","teachers","class","canteen","garden"];
  let s=base("#efe3cf",440,"#c8905a")+r(0,300,1000,130,"#dccfb2")+poly("300,440 700,440 760,560 240,560",BLUE,'opacity=".55"');
  [160,340,660,840].forEach(x=>s+=pendant(x));
  keys.forEach((k,i)=>{
    const x=70+i*182, on=visited.has(i);
    const door=r(x,170,112,270,cols[i],6,'stroke="#3b3a38" stroke-width="4"')+r(x+12,184,88,100,"rgba(255,255,255,.18)",4)+r(x+12,300,88,124,"rgba(0,0,0,.08)",4)+c(x+92,320,7,MUS);
    const plaque=r(x-6,126,124,34,CREAM,8)+txt(x+56,150,17,NAMES[k],CHAR)+c(x+56,114,9,on?"#ffd35c":"#9a8f7e",on?'class="lamp-on"':"");
    s+=hot(`data-go="${k}"`,x+56,300,70,door+plaque,NAMES[k]);
  });
  return s+plant(30,440)+plant(970,440);
},
library:()=>{
  let s=base("#ead9ba",430,"#b98550")+shelf(30,40,290,4)+shelf(680,40,290,4)+e(500,490,230,38,SAGE,'opacity=".6"')+
    r(350,80,300,170,"url(#sky)",8,'stroke="#a8723e" stroke-width="8"')+ln(500,80,500,250,5,"#a8723e")+ln(350,165,650,165,5,"#a8723e")+poly("360,250 640,250 780,430 260,430","url(#beam)",'style="mix-blend-mode:screen"')+
    pendant(420)+pendant(580)+desk(340,370,320)+chair(380,440)+chair(580,440)+
    r(372,330,8,40,CHAR)+`<path d="M356 332a30 30 0 0 1 56 0z" fill="${MUS}"/>`+c(384,350,100,"url(#glow)",'style="mix-blend-mode:screen"');
  return s+hot('data-p="0"',520,335,70,r(470,350,100,20,"#c96f4a",3)+r(478,331,92,19,BLUE,3)+r(486,314,80,17,MUS,3)+r(494,298,64,16,"#d9a0a0",3),"Buka Project 1")+plant(330,430);
},
teachers:()=>{
  let s=base("#e7ddc8",420,"#b98550")+r(40,110,170,220,"#8a5a30",6)+[0,1,2].map(k=>r(52,124+k*68,146,56,"#a8723e",3)+[0,1,2,3,4].map(j=>r(58+j*28,130+k*68,20,44,P[(j+k*2)%7],2)).join("")).join("")+
    r(780,90,170,120,"url(#sky)",8,'stroke="#a8723e" stroke-width="6"')+
    desk(40,380,270)+laptop(110,380)+papers(220,380)+desk(690,380,270)+laptop(760,380)+papers(860,380)+desk(370,400,260)+laptop(420,400)+laptop(520,400)+papers(380,400)+
    chair(140,440)+chair(790,440);
  const board=r(300,70,400,210,"#fff",8,'stroke="#a8723e" stroke-width="10"')+r(320,92,70,50,"url(#sky)",4)+ln(410,110,670,110,5,BLUE)+ln(410,134,620,134,5,BLUE)+ln(330,190,660,190,4,SAGE)+ln(330,222,560,222,4,"#c96f4a")+c(640,235,16,MUS)+r(400,270,200,10,WOODD,3);
  return s+hot('data-p="1"',500,175,120,board,"Buka Project 2");
},
class:()=>{
  let s=base("#e9dfc9",400,"#c8905a")+r(40,70,220,190,"url(#sky)",8,'stroke="#a8723e" stroke-width="8"')+ln(150,70,150,260,5,"#a8723e")+poly("60,260 250,260 420,420 120,420","url(#beam)",'style="mix-blend-mode:screen"')+
    r(300,100,400,170,"#fff",6,'stroke="#a8723e" stroke-width="8"')+poly("500,76 330,100 670,100","#fff",'opacity=".0"')+
    r(750,50,200,52,"#fff",10,'stroke="#ddd" stroke-width="3"')+[0,1,2,3].map(k=>r(768,78+0,164,3,"#ccc").replace('y="78"','y="'+(72+k*8)+'"')).join("")+
    r(440,300,130,12,WOODD,3)+r(450,312,8,40,WOODD)+r(552,312,8,40,WOODD)+chair(380,360)+
    [0,1,2,3].map(i=>desk(80+i*220,330,130)+chair(98+i*220,420)).join("")+[0,1,2,3].map(i=>desk(60+i*230,430,160)+chair(82+i*230,540)).join("");
  const beam=poly("470,58 530,58 700,270 300,270",MUS,'opacity=".12"');
  const pj=ln(500,0,500,40,3,CHAR)+r(448,40,104,38,"#dcdcdc",8,'stroke="#999" stroke-width="2"')+c(500,60,11,BLUE)+c(500,60,5,"#fff");
  return s+beam+hot('data-p="2"',500,60,66,pj,"Buka Project 3");
},
canteen:()=>{
  const stall=(x,col)=>r(x,150,210,260,"#d8c7a3",4)+[...Array(8)].map((_,k)=>r(x+k*26.25,108,26.25,52,k%2?"#fff":col)).join("")+
    r(x,320,210,90,WOOD,4)+[0,1,2,3,4,5].map(k=>r(x+14+k*32,282,24,38,P[(k+x)%7|0],3)).join("")+r(x+8,320,194,8,WOODD)+txt(x+105,230,22,"JAJANAN",CHAR);
  const cans=[0,1,2,3].map(k=>[0,1,2,3].map(j=>r(712+j*26,134+k*52,20,40,P[(k+j)%7],4)).join("")).join("");
  const vm=r(690,100,170,320,BLUE,10,'stroke="#3b3a38" stroke-width="4"')+r(704,118,116,240,"#dff0f5",6,'opacity=".95"')+cans+r(830,130,22,110,CHAR,4)+[0,1,2].map(k=>c(841,152+k*30,7,MUS)).join("")+r(704,368,116,38,CHAR,6);
  const table=(x,y)=>e(x,y,90,26,WOOD)+r(x-6,y,12,50,WOODD)+[-120,120].map(d=>e(x+d,y+34,28,10,WOODD)+r(x+d-4,y+34,8,44,WOODD)).join("");
  return base("#f1e0bf",410,"#c8905a")+pendant(300)+pendant(600)+stall(30,"#c96f4a")+stall(260,SAGE)+
    hot('data-p="3"',775,230,100,vm,"Buka Project 4")+r(880,300,90,110,WOODD,4)+[0,1,2].map(k=>r(888,310+k*34,74,26,P[k+2],4)).join("")+table(220,480)+table(540,490);
},
garden:()=>{
  const flowers=[...Array(26)].map((_,i)=>c(20+i*38,350+(i*53)%190,7,["#f4a7b9",MUS,"#fff","#c9a0dc"][i%4])+ln(20+i*38,357+(i*53)%190,20+i*38,372+(i*53)%190,2,"#5f8f4f")).join("");
  const pond=e(500,455,170,62,"#b9a58a")+e(500,452,150,50,"#6fb3c8")+e(470,448,34,11,"#4f9b6a")+e(545,460,26,8,"#4f9b6a")+c(548,456,5,"#f4a7b9")+
    e(520,445,16,6,"#e8833a",'transform="rotate(-20 520 445)"')+e(470,465,14,5,"#fff",'transform="rotate(15 470 465)"');
  return r(0,0,1000,560,"url(#sky)")+c(120,90,50,"#ffe9a8")+e(600,90,80,20,"#fff",'opacity=".85"')+e(680,104,56,16,"#fff",'opacity=".85"')+
    e(300,330,420,90,"#a9c9a0")+e(850,340,300,70,"#98bd8e")+r(0,330,1000,230,"url(#grass)")+
    r(820,230,10,110,WOODD)+[0,1,2,3,4,5,6,7,8].map(k=>r(10+k*112,300,6,60,"#fff",2)).join("")+
    r(880,150,24,200,WOODD)+c(892,120,80,"#6f9f62")+c(840,160,60,"#7fb06f")+c(940,160,56,"#7fb06f")+
    poly("120,470 340,470 370,540 90,540","#c96f4a")+poly("140,478 320,478 342,528 118,528",CREAM,'opacity=".7"')+r(200,440,50,34,"#b98550",6)+r(280,500,34,10,BLUE,2)+
    ln(90,380,90,340,6,WOODD)+ln(300,380,300,340,6,WOODD)+ln(90,342,300,342,6,WOODD)+ln(130,342,130,420,2,CHAR)+ln(260,342,260,420,2,CHAR)+r(118,420,26,8,MUS,2)+r(248,420,26,8,SAGE,2)+
    flowers+kid(610,540,"#e3b04b")+kid(690,520,"#7f9fb5")+kid(770,545,"#c96f4a")+kid(180,400,"#8fa98a")+
    hot('data-p="4"',500,455,110,pond,"Buka Final Project");
}
};

/* ---------- navigasi ---------- */
const HINTS = {
  front:"Klik pintu kaca untuk masuk.",
  hall:"Pilih salah satu pintu. Lampu di atas pintu menyala kalau kamu sudah berkunjung.",
  library:"Cari tumpukan buku di meja.", teachers:"Klik papan tulis.", class:"Klik proyektor di langit-langit.",
  canteen:"Klik mesin minuman kaleng.", garden:"Klik kolam kecil di tengah taman."
};
const DEFS=`<defs>
<pattern id="wood" width="140" height="64" patternUnits="userSpaceOnUse"><rect width="140" height="64" fill="#c8905a"/><path d="M0 9c35-5 70 5 140 0M0 24c45 6 80-6 140 0M0 41c35-6 80 6 140-1M0 56c40 5 85-5 140 0" stroke="#8f5f32" stroke-opacity=".38" fill="none"/><path d="M0 16c55 4 85-4 140 1M0 48c45-4 90 4 140-1" stroke="#f0c08a" stroke-opacity=".35" fill="none"/></pattern>
<pattern id="woodd" width="140" height="64" patternUnits="userSpaceOnUse"><rect width="140" height="64" fill="#a8723e"/><path d="M0 9c35-5 70 5 140 0M0 30c45 6 80-6 140 0M0 52c35-6 80 6 140-1" stroke="#5e3a18" stroke-opacity=".4" fill="none"/><path d="M0 18c55 4 85-4 140 1" stroke="#d09a64" stroke-opacity=".3" fill="none"/></pattern>
<filter id="sh" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="9" stdDeviation="7" flood-color="#2a1608" flood-opacity=".4"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0e05" stop-opacity=".6"/></radialGradient>
<linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<linearGradient id="floorg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".35" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffd98a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4" stop-opacity=".55"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></linearGradient>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc4e3"/><stop offset="1" stop-color="#eaf5f8"/></linearGradient>
<linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6d08e"/><stop offset="1" stop-color="#4f8f4a"/></linearGradient>
</defs>`;
const SPOTS={front:[['data-go="hall"',500,335,130,"Masuk"]],
  hall:["library","teachers","class","canteen","garden"].map((k,i)=>[`data-go="${k}"`,126+i*182,300,70,NAMES[k]]),
  library:[['data-p="0"',520,335,70,"Buka Project 1"]],teachers:[['data-p="1"',500,175,120,"Buka Project 2"]],
  class:[['data-p="2"',500,60,66,"Buka Project 3"]],canteen:[['data-p="3"',775,230,100,"Buka Project 4"]],
  garden:[['data-p="4"',500,455,110,"Buka Final Project"]]};
const dust=[...Array(16)].map((_,i)=>`<circle cx="${(i*131)%1000}" cy="${200+(i*89)%330}" r="${1.4+i%3}" fill="#fff3d0" style="animation-duration:${8+i%5}s;animation-delay:-${i*.9}s"/>`).join("");
const stage = $("stage");
function draw(){
  const img = IMAGES[scene];
  const body = img
    ? `<image href="${img}" width="1000" height="560" preserveAspectRatio="xMidYMid slice"/>` + SPOTS[scene].map(([a,x,y,q,l])=>hot(a,x,y,q,`<circle cx="${x}" cy="${y}" r="${q}" fill="transparent"/>`,l)).join("")
    : `<g id="cam">${SCENES[scene]()}</g><g class="dust" pointer-events="none">${dust}</g>` +
      `<rect width="1000" height="560" fill="url(#vig)" pointer-events="none"/><rect width="1000" height="560" filter="url(#grain)" opacity=".16" style="mix-blend-mode:multiply" pointer-events="none"/>`;
  stage.innerHTML = `<svg viewBox="0 0 1000 560" role="img" aria-label="${NAMES[scene]||"Akademia"}">${DEFS}${body}</svg>`;
  $("hint").textContent = HINTS[scene];
  const b = $("back");
  b.hidden = scene==="front";
  b.textContent = scene==="hall" ? "← Keluar gedung" : "← Kembali ke koridor";
  $("progress").textContent = `${visited.size} dari 5 ruangan dikunjungi`;
}
function go(name){
  stage.classList.add("out");
  setTimeout(()=>{ scene=name; draw(); stage.classList.remove("out"); }, 420);
}
function openDoorsThenHall(){
  const svg = stage.querySelector("svg");
  svg.classList.add("open");
  setTimeout(()=>go("hall"), 900);
}
function setLink(a, url, ok, empty){
  const has = url && url !== "#";
  a.href = has ? url : "#";
  a.setAttribute("aria-disabled", has ? "false" : "true");
  a.textContent = has ? ok : empty;
}
function openProject(i){
  const p = PROJECTS[i];
  $("d-room").textContent = NAMES[p.room];
  $("d-title").textContent = p.title;
  $("d-desc").textContent = p.desc;
  $("d-tags").innerHTML = p.tags.map(t=>`<li>${t}</li>`).join("");
  setLink($("d-repo"), p.repo, "Lihat kode di GitHub", "Link GitHub belum diisi");
  setLink($("d-demo"), p.demo, "Buka website (demo)", "Link hosting belum diisi");
  visited.add(i);
  try { localStorage.setItem(KEY, JSON.stringify([...visited])); } catch(e){}
  $("progress").textContent = `${visited.size} dari 5 ruangan dikunjungi`;
  $("dlg").showModal();
}
function activate(t){
  const h = t.closest(".hot"); if(!h) return;
  if(h.dataset.p !== undefined) openProject(+h.dataset.p);
  else if(h.dataset.go === "hall" && scene==="front") openDoorsThenHall();
  else go(h.dataset.go);
}
stage.addEventListener("click", e=>activate(e.target));
stage.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); activate(e.target); } });
stage.addEventListener("mousemove",e=>{
  const cam=$("cam"); if(!cam) return;
  const b=stage.getBoundingClientRect(), dx=(e.clientX-b.left)/b.width-.5, dy=(e.clientY-b.top)/b.height-.5;
  cam.style.transform=`translate(${-dx*18}px,${-dy*10}px) scale(1.04)`;
});
$("back").onclick = ()=>go(scene==="hall" ? "front" : "hall");
$("x").onclick = ()=>$("dlg").close();
$("dlg").addEventListener("click", e=>{ if(e.target===$("dlg")) $("dlg").close(); });
$("members").textContent = GROUP.members.join("  &  ") + " · " + GROUP.course;
draw();
