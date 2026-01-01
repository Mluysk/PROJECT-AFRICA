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
function parseAmount(value){
  const raw = String(value ?? "").trim();
  if(!raw) return 0;
  const cleaned = raw.replace(/[^\d,.-]/g, "");
  const hasComma = cleaned.includes(",");
  let normalized = cleaned;
  if(hasComma){
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  }else{
    normalized = normalized.replace(/,/g, "");
  }
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
}
function formatInputAmount(value){
  const raw = String(value ?? "").trim();
  if(!raw) return "";
  const num = parseAmount(raw);
  if(!num) return "0,00";
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function currencySymbol(code){
  if(code === "USD") return "$";
  if(code === "EUR") return "€";
  return "R$";
}

// Mobile
// Smooth scroll
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior:"smooth", block:"start" });
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


function formatPixField(id, value){
  const len = String(value).length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}
function crc16(payload){
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
function buildPixPayload(amount){
  const rawKey = "5541997804023";
  const merchantName = "PROJECTO AFRICA";
  const merchantCity = "LUANDA";
  const amountStr = Number(amount).toFixed(2);

  const keyDigits = rawKey.replace(/\D/g, "");
  const key = keyDigits.startsWith("55") ? `+${keyDigits}` : `+55${keyDigits}`;

  const merchantAccount =
    formatPixField("00", "BR.GOV.BCB.PIX") +
    formatPixField("01", key);

  const payload =
    formatPixField("00", "01") +
    formatPixField("26", merchantAccount) +
    formatPixField("52", "0000") +
    formatPixField("53", "986") +
    formatPixField("54", amountStr) +
    formatPixField("58", "BR") +
    formatPixField("59", merchantName) +
    formatPixField("60", merchantCity) +
    formatPixField("62", formatPixField("05", "PROJECTOAFRICA"));

  const withCrc = payload + "6304";
  const crc = crc16(withCrc);
  return withCrc + crc;
}
function buildDonationQrUrl(amount){
  const data = buildPixPayload(amount);
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encoded}`;
}


function openPixPanel(payload){
  pendingDonation = payload;
  if(pixQr) pixQr.src = buildDonationQrUrl(payload.amount);
  if(pixAmountEl) pixAmountEl.textContent = formatMoney(payload.amount, payload.currency);
  pixPanel?.classList.add("show");
  pixPanel?.setAttribute("aria-hidden", "false");
  pixThanks?.classList.remove("show");
  startPixCountdown();
}
function closePixPanel(){
  pendingDonation = null;
  if(pixTimer) clearInterval(pixTimer);
  if(autoConfirmTimer) clearTimeout(autoConfirmTimer);
  pixPanel?.classList.remove("show");
  pixPanel?.setAttribute("aria-hidden", "true");
}

async function confirmPixPayment(){
  if(!pendingDonation || isConfirmingPix) return;
  isConfirmingPix = true;
  const payload = pendingDonation;
  if(pixConfirm) pixConfirm.setAttribute("disabled", "disabled");
  try{
    await apiPost("donations", payload);
    successBox.style.display = "block";
    setTimeout(()=> successBox.style.display="none", 2200);
    donationForm.reset();
    currencyEl.value = payload.currency;
    await donationStats();
    pixThanks?.classList.add("show");
    setTimeout(() => {
      closePixPanel();
    }, 1500);
  }catch(err){
    alert("Falha ao registrar doação: " + err.message);
  }finally{
    isConfirmingPix = false;
    pixConfirm?.removeAttribute("disabled");
  }
}

// ===== Donations =====
const donationForm = $("#donationForm");
const donationCountEl = $("#donationCount");
const donationTotalEl = $("#donationTotal");
const avgDonationEl = $("#avgDonation");
const amountEl = $("#amount");
const amountPrefixEl = $("#amountPrefix");
const currencyEl = $("#currency");
const successBox = $("#successBox");
const pixPanel = $("#pixPanel");
const pixQr = $("#pixQr");
const pixAmountEl = $("#pixAmount");
const pixConfirm = $("#pixConfirm");
const pixThanks = $("#pixThanks");
const pixWait = $("#pixWait");
const footerYearEl = $("#footerYear");
let pendingDonation = null;
let pixTimer = null;
let autoConfirmTimer = null;
let isConfirmingPix = false;

function updateAmountPrefix(){
  if(!amountPrefixEl || !currencyEl) return;
  amountPrefixEl.textContent = currencySymbol(currencyEl.value);
}
function updateFooterYear(){
  if(!footerYearEl) return;
  footerYearEl.textContent = String(new Date().getFullYear());
}

function startPixCountdown(){
  const totalSeconds = 30;
  let remaining = totalSeconds;

  if(pixTimer) clearInterval(pixTimer);
  if(autoConfirmTimer) clearTimeout(autoConfirmTimer);

  pixConfirm?.setAttribute("disabled", "disabled");

  const updateWaitText = () => {
    if(!pixWait) return;
    if(remaining > 0){
      pixWait.textContent = `Espere ${remaining} segundos para confirmar o pagamento PIX ou aguarde a confirmação automática.`;
    }else{
      pixWait.textContent = "tempo de espera concluido pode confirmar o pagamento manualmente.";
    }
  };

  updateWaitText();
  pixTimer = setInterval(() => {
    remaining -= 1;
    if(remaining <= 0){
      clearInterval(pixTimer);
      pixTimer = null;
      pixConfirm?.removeAttribute("disabled");
    }
    updateWaitText();
  }, 1000);

  autoConfirmTimer = setTimeout(() => {
    confirmPixPayment();
  }, totalSeconds * 1000);
}

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
currencyEl?.addEventListener("change", () => {
  updateAmountPrefix();
  donationStats();
});
$$(".q").forEach(btn => btn.addEventListener("click", () => {
  amountEl.value = formatInputAmount(btn.dataset.amount);
}));
amountEl?.addEventListener("blur", () => {
  const formatted = formatInputAmount(amountEl.value);
  if(formatted) amountEl.value = formatted;
});
updateAmountPrefix();
updateFooterYear();

donationForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: ($("#donorName").value || "").trim(),
    currency: currencyEl.value,
    amount: parseAmount(amountEl.value),
    purpose: ($("#purpose").value || "").trim(),
    note: ($("#note").value || "").trim()
  };
  if(!payload.name || !payload.amount || payload.amount < 1) return;

  try{
    openPixPanel(payload);
  }catch(err){
    alert("Falha ao registrar doação: " + err.message);
  }
});

pixConfirm?.addEventListener("click", () => {
  confirmPixPayment();
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
