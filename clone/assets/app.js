const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

function formatMoney(value, currency){
  const map = { BRL: "pt-BR", USD: "en-US", EUR: "de-DE" };
  const locale = map[currency] || "pt-BR";
  try{
    return new Intl.NumberFormat(locale, { style:"currency", currency }).format(value);
  }catch{
    const sym = currency==="USD" ? "$" : currency==="EUR" ? "€" : "R$";
    return sym + " " + Number(value||0).toFixed(2);
  }
}
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

// Mobile
const burger = $("#burger");
const mobileNav = $("#mobileNav");
burger?.addEventListener("click", () => {
  const open = mobileNav.style.display === "block";
  mobileNav.style.display = open ? "none" : "block";
});

// Smooth scroll
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior:"smooth", block:"start" });
    if(mobileNav && mobileNav.style.display === "block") mobileNav.style.display = "none";
  });
});

// Impact counters (edite aqui)
const IMPACT = { kidsHelped: 12840, mealsServed: 56210, schoolsSupported: 37 };
function animateCount(el, to, duration=900){
  const start = performance.now();
  function tick(now){
    const t = clamp((now - start)/duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(to * eased).toLocaleString("pt-BR");
    if(t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
animateCount($("#kidsHelped"), IMPACT.kidsHelped);
animateCount($("#mealsServed"), IMPACT.mealsServed);
animateCount($("#schoolsSupported"), IMPACT.schoolsSupported);

// Carousel
const track = $("#track");
const prev = $("#prev");
const next = $("#next");
const tabs = $$(".tab");
let index = 0;
let filter = "all";
let autoTimer = null;

function visibleSlides(){
  const slides = $$(".slide", track);
  return slides.filter(s => filter === "all" ? true : s.dataset.kind === filter);
}
function rebuildVisibility(){
  const slides = $$(".slide", track);
  slides.forEach(s => s.style.display = ((filter==="all") || (s.dataset.kind===filter)) ? "block" : "none");
  index = 0;
  updateCarousel();
}
function slideWidth(){
  const s = visibleSlides()[0];
  if(!s) return 320;
  return s.getBoundingClientRect().width + 12;
}
function updateCarousel(){
  const vis = visibleSlides();
  if(!vis.length) return (track.style.transform = "translateX(0px)");
  index = clamp(index, 0, Math.max(0, vis.length - 1));
  track.style.transform = `translateX(${-index * slideWidth()}px)`;
}
function go(dir){
  const vis = visibleSlides();
  if(!vis.length) return;
  index += dir;
  if(index >= vis.length) index = 0;
  if(index < 0) index = vis.length - 1;
  updateCarousel();
}
prev?.addEventListener("click", ()=> go(-1));
next?.addEventListener("click", ()=> go(1));
window.addEventListener("resize", updateCarousel);
tabs.forEach(t => t.addEventListener("click", () => {
  tabs.forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  filter = t.dataset.filter;
  rebuildVisibility();
}));
function startAuto(){ stopAuto(); autoTimer = setInterval(()=> go(1), 3800); }
function stopAuto(){ if(autoTimer) clearInterval(autoTimer); autoTimer = null; }
$(".carousel")?.addEventListener("mouseenter", stopAuto);
$(".carousel")?.addEventListener("mouseleave", startAuto);
startAuto();
rebuildVisibility();

// ===== API helpers =====
async function apiGet(type){
  const r = await fetch(`api.php?type=${encodeURIComponent(type)}`, { cache:"no-store" });
  const j = await r.json();
  if(!j.ok) throw new Error(j.error || "erro");
  return j.data || [];
}
async function apiPost(type, payload){
  const r = await fetch(`api.php?type=${encodeURIComponent(type)}`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  const j = await r.json();
  if(!j.ok) throw new Error(j.error || "erro");
  return true;
}

// ===== Donations =====
const donationForm = $("#donationForm");
const donationCountEl = $("#donationCount");
const donationTotalEl = $("#donationTotal");
const avgDonationEl = $("#avgDonation");
const amountEl = $("#amount");
const currencyEl = $("#currency");
const successBox = $("#successBox");

async function donationStats(){
  const cur = currencyEl.value;
  const arr = await apiGet("donations");
  const filtered = arr.filter(d => d.currency === cur);
  const count = filtered.length;
  const total = filtered.reduce((a,b)=> a + (Number(b.amount)||0), 0);
  const avg = count ? total / count : 0;

  donationCountEl.textContent = String(count);
  donationTotalEl.textContent = formatMoney(total, cur);
  avgDonationEl.textContent = formatMoney(avg, cur);
}
currencyEl?.addEventListener("change", donationStats);
$$(".q").forEach(btn => btn.addEventListener("click", () => { amountEl.value = btn.dataset.amount; }));

donationForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: ($("#donorName").value || "").trim(),
    currency: currencyEl.value,
    amount: Number(amountEl.value || 0),
    purpose: ($("#purpose").value || "").trim(),
    note: ($("#note").value || "").trim()
  };
  if(!payload.name || !payload.amount || payload.amount < 1) return;

  try{
    await apiPost("donations", payload);
    successBox.style.display = "block";
    setTimeout(()=> successBox.style.display="none", 2200);
    donationForm.reset();
    currencyEl.value = payload.currency;
    await donationStats();
  }catch(err){
    alert("Falha ao registrar doação: " + err.message);
  }
});

// ===== Comments =====
const commentForm = $("#commentForm");
const commentList = $("#commentList");

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function renderComments(arr){
  const items = arr.slice().reverse();
  if(!items.length){
    commentList.innerHTML = `<div class="helper">Sem comentários ainda. Seja o primeiro.</div>`;
    return;
  }
  commentList.innerHTML = items.map(c => {
    const date = new Date(c.at);
    const when = isNaN(date) ? "" : date.toLocaleString("pt-BR");
    const city = c.city ? ` • ${escapeHtml(c.city)}` : "";
    return `
      <div class="comment-item">
        <b>${escapeHtml(c.name)} <span style="color:rgba(255,255,255,.55); font-weight:600">${city}</span></b>
        <small>${when}</small>
        <p>${escapeHtml(c.text)}</p>
      </div>
    `;
  }).join("");
}
async function loadAndRenderComments(){
  const arr = await apiGet("comments");
  renderComments(arr);
}

commentForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: ($("#cName").value || "").trim(),
    city: ($("#cCity").value || "").trim(),
    text: ($("#cText").value || "").trim()
  };
  if(!payload.name || !payload.text) return;

  try{
    await apiPost("comments", payload);
    commentForm.reset();
    await loadAndRenderComments();
  }catch(err){
    alert("Falha ao enviar comentário: " + err.message);
  }
});

// init
(async () => {
  try{
    await donationStats();
    await loadAndRenderComments();
  }catch(e){
    console.warn(e);
  }
})();
