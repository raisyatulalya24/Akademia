/* ============ EDIT BAGIAN INI ============ */
const GROUP = {
  members: [
    { name:"Raisyatul Alya", nim:"24105111090", github:"https://github.com/raisyatulalya24" },
    { name:"Aida Yusira",    nim:"24105111072", github:"https://github.com/AidaYusira" }
  ]
};
/* repo = link GitHub (kode), demo = link hosting (website jalan) */
const PROJECTS = [
  { title:"Discoveria",
    desc:"Portal edukasi interaktif berbasis Laravel yang menyediakan materi pelajaran (Matematika, Sains, Teknologi, Bahasa) lengkap dengan gambar, sistem kuis otomatis, pelacakan skor, serta fitur simpan favorit.",
    tags:["Laravel","PHP","MySQL","TailwindCSS","E-Learning","Quiz System"],
    repo:"https://github.com/AidaYusira/discoveria", demo:"https://discoveria.wasmer.app/" },
  { title:"Oddesey", desc:"Platform edukasi interaktif berbasis Laravel yang berfungsi sebagai laboratorium digital: 5 bidang ilmu (Biologi, Fisika, Kimia, Astronomi, Matematika), 25 materi, dan 56 simulasi interaktif yang bisa diatur parameternya. Dilengkapi pelacakan waktu belajar, progres dan lencana, bookmark, serta jurnal refleksi eksperimen.", tags:["Laravel","PHP","MySQL","JavaScript","Canvas","SVG","E-Learning","Virtual Lab"], repo:"https://github.com/raisyatulalya24/oddesey", demo:"https://odyssey.wasmer.app" },
  { title:"Judul Project 3", desc:"Deskripsi singkat project 3.", tags:["Tag"], repo:"#", demo:"#" },
  { title:"Judul Project 4", desc:"Deskripsi singkat project 4.", tags:["Tag"], repo:"#", demo:"#" },
  { title:"Final Project",   desc:"Deskripsi final project.",     tags:["Tag"], repo:"#", demo:"#" }
];
/* ======================================== */

/* Posisi dalam piksel desain Figma (kanvas 1440x1024; koridor 1835x1024).
   Titik putih = x,y pada dot. Tambahkan ?edit di URL lalu klik layar untuk melihat koordinat. */
const BACK_A = { x:76,  y:936, w:180, h:43 }, BACK_B = { x:133, y:914, w:168, h:43 };
const SCENES = {
  front:   { img:"img/front.jpg", W:1440, H:1024,
             dot:{ x:818, y:588, go:"hall", label:"Masuk Akademia" },
             hits:[ { m:0, x:0, y:592, w:226, h:432 }, { m:1, x:228, y:630, w:164, h:394 } ] },
  hall:    { img:"img/hall.jpg", W:1835, H:1024, back:BACK_A, backTo:"front",
             doors:[ { go:"library",  p:0, x:442,  y:605, w:175, h:385, label:"Perpustakaan" },
                     { go:"teachers", p:1, x:660,  y:605, w:185, h:385, label:"Ruang Guru" },
                     { go:"class",    p:2, x:917,  y:605, w:195, h:385, label:"Ruang Belajar" },
                     { go:"canteen",  p:3, x:1180, y:605, w:185, h:385, label:"Kantin" },
                     { go:"garden",   p:4, x:1405, y:605, w:185, h:385, label:"Taman" } ] },
  library: { img:"img/library.jpg",  W:1440, H:1024, back:BACK_A, backTo:"hall", dot:{ x:567, y:645, p:0, label:"Buka Project 1" } },
  teachers:{ img:"img/teachers.jpg", W:1440, H:1024, back:BACK_B, backTo:"hall", dot:{ x:712, y:600, p:1, label:"Buka Project 2" } },
  class:   { img:"img/class.jpg",    W:1440, H:1024, back:BACK_B, backTo:"hall", dot:{ x:659, y:237, p:2, label:"Buka Project 3" } },
  canteen: { img:"img/canteen.jpg",  W:1440, H:1024, back:BACK_B, backTo:"hall", dot:{ x:689, y:545, p:3, label:"Buka Project 4" } },
  garden:  { img:"img/garden.jpg",   W:1440, H:1024, back:BACK_B, backTo:"hall", dot:{ x:689, y:545, p:4, label:"Buka Final Project" } }
};

const $ = id => document.getElementById(id);
const wrap = $("wrap"), stage = $("stage"), KEY = "akademia-rpl2-v2";
let scene = "front", visited = new Set(), busy = false;
try { visited = new Set(JSON.parse(localStorage.getItem(KEY) || "[]").filter(n => Number.isInteger(n) && n >= 0 && n < 5)); } catch(e){}
const edit = /[?&]edit/.test(location.search);

/* ---------- efek bergerak: partikel cahaya / kelopak ---------- */
const FX = { front:{c:"255,255,255",n:38,m:"float"}, hall:{c:"255,240,205",n:46,m:"float"}, library:{c:"255,222,150",n:48,m:"float"},
  teachers:{c:"255,255,255",n:30,m:"float"}, class:{c:"255,245,215",n:34,m:"float"}, canteen:{c:"255,236,195",n:34,m:"float"}, garden:{c:"255,175,205",n:30,m:"fall"} };
let fxRaf = 0;
function startFx(){
  cancelAnimationFrame(fxRaf);
  const cv = stage.querySelector(".fx"); if (!cv || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const cfg = FX[scene], ctx = cv.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2);
  const W = cv.width = stage.clientWidth * dpr, H = cv.height = stage.clientHeight * dpr;
  const P = Array.from({length:cfg.n}, () => ({ x:Math.random()*W, y:Math.random()*H, r:(Math.random()*2.4+1)*dpr, v:(Math.random()*.25+.08)*dpr, ph:Math.random()*6.3, a:Math.random()*.5+.35 }));
  (function tick(t){
    ctx.clearRect(0,0,W,H);
    for (const p of P){
      const k = t/1000;
      if (cfg.m === "fall"){ p.y += p.v*1.6; p.x += Math.sin(k+p.ph)*.6*dpr; if (p.y > H+10){ p.y = -10; p.x = Math.random()*W; }
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(k+p.ph); ctx.fillStyle = `rgba(${cfg.c},${p.a})`;
        ctx.beginPath(); ctx.ellipse(0,0,p.r*2.2,p.r,0,0,6.3); ctx.fill(); ctx.restore();
      } else { p.y -= p.v; p.x += Math.sin(k*.6+p.ph)*.35*dpr; if (p.y < -10){ p.y = H+10; p.x = Math.random()*W; }
        const al = p.a*(.45+.55*Math.sin(k*1.4+p.ph)); ctx.shadowColor = `rgba(${cfg.c},.9)`; ctx.shadowBlur = 10*dpr;
        ctx.fillStyle = `rgba(${cfg.c},${Math.max(al,0)})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.3); ctx.fill(); }
    }
    fxRaf = requestAnimationFrame(tick);
  })(0);
}
stage.addEventListener("mousemove", e => {
  const cam = stage.querySelector(".cam"); if (!cam) return;
  const r = stage.getBoundingClientRect(), dx = (e.clientX-r.left)/r.width-.5, dy = (e.clientY-r.top)/r.height-.5;
  cam.style.transform = `translate(${-dx*1.6}%,${-dy*1.6}%) scale(1.04)`;
});
addEventListener("resize", startFx);

const pct = (s,x,y,w,h) => `left:${x/s.W*100}%;top:${y/s.H*100}%;width:${w/s.W*100}%;height:${h/s.H*100}%`;
const progress = () => { if(!edit) $("progress").textContent = `${visited.size} dari 5 ruangan dikunjungi`; };

function render(){
  const s = SCENES[scene];
  let h = `<div class="cam"><img class="bg" src="${s.img}" alt="" draggable="false">`;
  (s.doors||[]).forEach(d => h += `<button class="door${visited.has(d.p)?" seen":""}" data-go="${d.go}" data-label="${d.label}" aria-label="${d.label}" style="${pct(s,d.x-d.w/2,d.y-d.h/2,d.w,d.h)}"></button>`);
  (s.hits||[]).forEach(t => { const m = GROUP.members[t.m];
    h += `<a class="hit" href="${m.github}" target="_blank" rel="noopener" data-label="Buka GitHub ${m.name}" aria-label="GitHub ${m.name}" style="${pct(s,t.x,t.y,t.w,t.h)}"><span class="glow"></span></a>`; });
  if (s.dot) h += `<button class="dot" data-act="dot" data-label="${s.dot.label}" aria-label="${s.dot.label}" style="left:${s.dot.x/s.W*100}%;top:${s.dot.y/s.H*100}%"><i></i></button>`;
  h += `</div><div class="rays"></div><canvas class="fx"></canvas><div class="vig"></div>`;
  if (s.back) h += `<button class="back" data-go="${s.backTo}" style="${pct(s,s.back.x,s.back.y,s.back.w,s.back.h)}">← kembali</button>`;
  if (s.dot && s.dot.p !== undefined) h += `<div class="card" id="card" role="dialog" aria-live="polite"><button class="x" data-act="close" aria-label="Tutup">✕</button>
    <h2 id="c-title"></h2><p id="c-desc"></p><ul class="tags" id="c-tags"></ul>
    <a class="pill" id="c-repo" target="_blank" rel="noopener"></a><a class="pill" id="c-demo" target="_blank" rel="noopener"></a></div>`;
  stage.removeAttribute("data-missing");
  stage.style.setProperty("--W", s.W); stage.style.setProperty("--H", s.H);
  stage.innerHTML = h;
  stage.querySelector(".bg").onerror = () => stage.setAttribute("data-missing", s.img);
  progress(); startFx();
}

function go(name){
  if (busy) return; busy = true;
  wrap.classList.add("out");
  setTimeout(() => { scene = name; render(); wrap.classList.remove("out"); busy = false; }, 450);
}
function dive(el, name){
  if (busy) return; busy = true;
  const b = el.getBoundingClientRect();
  wrap.style.transformOrigin = `${b.left + b.width/2}px ${b.top + b.height/2}px`;
  wrap.classList.add("dive");
  setTimeout(() => { scene = name; render(); wrap.style.transformOrigin = ""; wrap.classList.remove("dive"); busy = false; }, 900);
}

function setLink(a, url, ok, empty){
  const has = url && url !== "#";
  a.href = has ? url : "#";
  a.setAttribute("aria-disabled", has ? "false" : "true");
  a.textContent = has ? ok : empty;
}
function toggleCard(force){
  const card = $("card"); if (!card) return;
  const p = SCENES[scene].dot.p, P = PROJECTS[p];
  const open = force !== undefined ? force : !card.classList.contains("open");
  if (open){
    $("c-title").textContent = P.title;
    $("c-desc").textContent = P.desc;
    $("c-tags").innerHTML = P.tags.map(t => `<li>${t}</li>`).join("");
    setLink($("c-repo"), P.repo, "Lihat kode di GitHub", "Link GitHub belum diisi");
    setLink($("c-demo"), P.demo, "Buka website (demo)", "Link hosting belum diisi");
    visited.add(p);
    try { localStorage.setItem(KEY, JSON.stringify([...visited])); } catch(e){}
    progress();
  }
  card.classList.toggle("open", open);
}

stage.addEventListener("click", e => {
  if (edit){
    const r = stage.getBoundingClientRect(), s = SCENES[scene];
    $("progress").textContent = `x:${Math.round((e.clientX-r.left)/r.width*s.W)}, y:${Math.round((e.clientY-r.top)/r.height*s.H)}`;
  }
  const t = e.target.closest("[data-go],[data-act]");
  if (!t){ if (!e.target.closest(".card")) toggleCard(false); return; }
  if (t.dataset.act === "close") return toggleCard(false);
  if (t.dataset.act === "dot"){
    const d = SCENES[scene].dot;
    return d.go ? dive(t, d.go) : toggleCard();
  }
  go(t.dataset.go);
});
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleCard(false); });
render();