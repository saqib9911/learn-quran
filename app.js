// ============================================================
// app.js - Complete (Core Logic + Audio + Calendar + Location)
// ============================================================

// ============================================================
// GLOBAL VARIABLES
// ============================================================
let currentLang = localStorage.getItem('appLang') || 'ur';
let allSurahs = [];
let completed = JSON.parse(localStorage.getItem('completedSurahs') || '[]');
let currentAudio = null;
let currentSurahNum = null;
let currentAyahNum = 1;
let currentReciter = 'ar.alafasy';
let currentTafsir = {
  ur: 'ur-tafseer-ibn-e-kaseer',
  en: 'en-tafisr-ibn-kathir',
  ar: 'ar-tafseer-al-qurtubi'
};
let isPlaying = false;
let currentVideoIndex = 0;
let currentCity = localStorage.getItem('userCity') || 'Islamabad';
let currentCoords = JSON.parse(localStorage.getItem('userCoords') || 'null');

// ============================================================
// BAYAN VIDEOS - Maulana Abdul Majid Satti
// ============================================================
const bayanVideos = [
  { id: 'JjeZAvD5tDk', title: 'توحید کی اہمیت اور شرک کی مذمت' },
  { id: 'FV2RDgyaieM', title: 'پانچ گناہوں کے بھیانک انجام' },
  { id: 'mSSO08qwU8E', title: 'رمضان کی سعادتوں سے محروم ہونے والا بدنصیب' },
  { id: 'jWYXaa1IYwI', title: 'کیا حضرت عیسیٰ علیہ السلام اللہ کے بیٹے تھے؟' },
  { id: 'Z4St8Hi5XC8', title: 'عمل کی قبولیت کب ہوتی ہے' },
  { id: 'MRQBWgrKa1o', title: 'ہماری پریشانیوں کا سبب اور اسکا حل' },
  { id: 'HZmBjMcB-Uw', title: 'بنی اسرائیل کی ایسی صفت جس پر اللہ نے انکی تعریف کی' },
  { id: 'XZS7PVoA3Xc', title: 'حضرت ابوبکر ؓ اور ایک بوڑھیا کے گھر کے کام' },
  { id: '2tV1ErOMzww', title: 'ایک غلام کی دعا کی قبولیت کا واقعہ' },
  { id: 'RSnkPIjGlQg', title: 'جب لا الہ الا اللہ کی بنیاد پر بیٹا اور باپ مدمقابل ہوئے' }
];

// ============================================================
// RECITERS & TAFSIRS
// ============================================================
const reciters = [
  { id: 'ar.alafasy', key: 'audio.mishary' },
  { id: 'ar.abdulbasitmurattal', key: 'audio.abdulbasit' },
  { id: 'ar.husary', key: 'audio.husary' },
  { id: 'ar.minshawi', key: 'audio.minshawi' },
  { id: 'ar.hudhaify', key: 'audio.hudhaify' },
  { id: 'ar.shaatree', key: 'audio.shaatree' },
  { id: 'ar.ahmedajamy', key: 'audio.ahmedajamy' },
  { id: 'ar.hanirifai', key: 'audio.hanirifai' },
  { id: 'ar.muhammadayyoub', key: 'audio.muhammadayyoub' },
  { id: 'ar.mahermuaiqly', key: 'audio.mahermuaiqly' }
];

const tafsirList = {
  ur: [
    { id: 'ur-tafseer-ibn-e-kaseer', key: 'tafsir.ibnKathir' },
    { id: 'ur-tafsir-fe-zalul-quran-syed-qatab', key: 'tafsir.fiZilal' },
    { id: 'ur-tafsir-bayan-ul-quran', key: 'tafsir.bayan' }
  ],
  en: [
    { id: 'en-tafisr-ibn-kathir', key: 'tafsir.ibnKathir' }
  ],
  ar: [
    { id: 'ar-tafseer-al-qurtubi', key: 'tafsir.ibnKathir' }
  ]
};

// ============================================================
// DAYS & MONTHS
// ============================================================
const urduDays = ['اتوار','پیر','منگل','بدھ','جمعرات','جمعہ','ہفتہ'];
const urduMonths = ['جنوری','فروری','مارچ','اپریل','مئی','جون','جولائی','اگست','ستمبر','اکتوبر','نومبر','دسمبر'];
const englishDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const englishMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const arabicDays = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const arabicMonths = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

// ============================================================
// SURAH NAMES
// ============================================================
const surahNamesUr = [
  "الفاتحہ","البقرہ","آل عمران","النساء","المائدہ","الأنعام","الأعراف","الأنفال","التوبہ","یونس",
  "ہود","یوسف","الرعد","إبراہیم","الحجر","النحل","الإسراء","الکہف","مریم","طہ",
  "الأنبیاء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنکبوت","الروم",
  "لقمان","السجدہ","الأحزاب","سبأ","فاطر","یٰسین","الصافات","ص","الزمر","غافر",
  "فصلت","الشوریٰ","الزخرف","الدخان","الجاثیہ","الأحقاف","محمد","الفتح","الحجرات","ق",
  "الذاریات","الطور","النجم","القمر","الرحمٰن","الواقعہ","الحدید","المجادیہ","الحشر","الممتحنہ",
  "الصف","الجمعہ","المنافقون","التغابن","الطلاق","التحریم","الملک","القلم","الحاقہ","المعارج",
  "نوح","الجن","المزمل","المدثر","القیامہ","الإنسان","المرسلات","النبأ","النازعات","عبس",
  "التکویر","الإنفطار","المطففین","الإنشقاق","البروج","الطارق","الأعلیٰ","الغاشیہ","الفجر","البلد",
  "الشمس","اللیل","الضحیٰ","الشرح","التین","العلق","القدر","البینہ","الزلزال","العادیات",
  "القارعہ","التکاثر","العصر","الہمزہ","الفیل","قریش","الماعون","الکوثر","الکافرون","النصر",
  "اللہب","الإخلاص","الفلق","الناس"
];

const ayahCounts = [
  7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,
  54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,
  14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,
  29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,
  11,8,3,9,5,4,7,3,6,3,5,4,5,6
];

// ============================================================
// INDEXEDDB
// ============================================================
let db = null;
const DB_NAME = 'QuranAppDB';
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains('surahs')) database.createObjectStore('surahs', { keyPath: 'key' });
      if (!database.objectStoreNames.contains('tafsir')) database.createObjectStore('tafsir', { keyPath: 'key' });
      if (!database.objectStoreNames.contains('audio')) database.createObjectStore('audio', { keyPath: 'key' });
      if (!database.objectStoreNames.contains('meta')) database.createObjectStore('meta', { keyPath: 'key' });
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror = (e) => reject(e.target.error);
  });
}

async function getSurahFromDB(lang, number) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('surahs', 'readonly');
    const req = tx.objectStore('surahs').get(`${lang}-${number}`);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function saveSurahToDB(lang, number, data) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('surahs', 'readwrite');
    tx.objectStore('surahs').put({ key: `${lang}-${number}`, number, lang, data, cachedAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

async function getTafsirFromDB(key) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('tafsir', 'readonly');
    const req = tx.objectStore('tafsir').get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function saveTafsirToDB(key, text) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('tafsir', 'readwrite');
    tx.objectStore('tafsir').put({ key, text, cachedAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

async function getAudioFromDB(key) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('audio', 'readonly');
    const req = tx.objectStore('audio').get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function saveAudioToDB(key, blob) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('audio', 'readwrite');
    tx.objectStore('audio').put({ key, blob, cachedAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

async function getMeta(key) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('meta', 'readonly');
    const req = tx.objectStore('meta').get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function setMeta(key, value) {
  const database = await openDB();
  return new Promise((resolve) => {
    const tx = database.transaction('meta', 'readwrite');
    tx.objectStore('meta').put({ key, value });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

async function countSurahsInDB() {
  const database = await openDB();
  return new Promise((resolve) => {
    const req = database.transaction('surahs', 'readonly').objectStore('surahs').count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
}

async function countTafsirInDB() {
  const database = await openDB();
  return new Promise((resolve) => {
    const req = database.transaction('tafsir', 'readonly').objectStore('tafsir').count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
}

async function countAudioInDB() {
  const database = await openDB();
  return new Promise((resolve) => {
    const req = database.transaction('audio', 'readonly').objectStore('audio').count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
}

// ============================================================
// LANGUAGE SYSTEM
// ============================================================
function initLanguage() {
  const savedLang = localStorage.getItem('appLang');
  const popupShown = localStorage.getItem('langPopupShown');
  if (!savedLang && !popupShown) {
    setTimeout(() => {
      document.getElementById('langPopup').classList.remove('hidden');
    }, 500);
  } else if (savedLang) {
    applyLanguage(savedLang);
  }
}

function selectLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('appLang', lang);
  localStorage.setItem('langPopupShown', 'true');
  applyLanguage(lang);
  closeLangPopup();
}

function applyLanguage(lang) {
  const meta = languageMeta[lang];
  if (!meta) return;
  document.documentElement.lang = lang;
  document.documentElement.dir = meta.dir;
  document.body.setAttribute('data-lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key, lang);
  });

  const searchBox = document.getElementById('searchBox');
  if (searchBox) searchBox.placeholder = t('lessons.search', lang);

  ['Ur','En','Ar'].forEach(code => {
    const btn = document.getElementById('langBtn' + code);
    if (btn) btn.classList.remove('active');
  });
  const flagMap = { ur: 'Ur', en: 'En', ar: 'Ar' };
  const activeBtn = document.getElementById('langBtn' + flagMap[lang]);
  if (activeBtn) activeBtn.classList.add('active');

  loadSurahList();
  loadIslamicDate();
  updateProgress();
  renderLocalProgress();
  updateCacheStatus();
  renderBayanVideos();
}

function closeLangPopup() {
  const popup = document.getElementById('langPopup');
  if (popup) popup.classList.add('hidden');
  localStorage.setItem('langPopupShown', 'true');
  if (!localStorage.getItem('appLang')) {
    selectLanguage('ur');
  }
}

// ============================================================
// THEME
// ============================================================
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================================
// LIVE CLOCK
// ============================================================
function updateLiveClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeEl = document.getElementById('liveTime');
  if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;

  let dayName, monthName;
  if (currentLang === 'en') { dayName = englishDays[now.getDay()]; monthName = englishMonths[now.getMonth()]; }
  else if (currentLang === 'ar') { dayName = arabicDays[now.getDay()]; monthName = arabicMonths[now.getMonth()]; }
  else { dayName = urduDays[now.getDay()]; monthName = urduMonths[now.getMonth()]; }

  const dateEl = document.getElementById('liveDate');
  if (dateEl) dateEl.textContent = `${dayName}، ${now.getDate()} ${monthName} ${now.getFullYear()}`;
}

// ============================================================
// ISLAMIC DATE
// ============================================================
async function loadIslamicDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();

  let dayName, monthName;
  if (currentLang === 'en') { dayName = englishDays[now.getDay()]; monthName = englishMonths[now.getMonth()]; }
  else if (currentLang === 'ar') { dayName = arabicDays[now.getDay()]; monthName = arabicMonths[now.getMonth()]; }
  else { dayName = urduDays[now.getDay()]; monthName = urduMonths[now.getMonth()]; }

  const gregorianStr = `${now.getDate()} ${monthName} ${now.getFullYear()}`;

  ['homeCalGregorian', 'calGregorian'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = gregorianStr;
  });
  ['homeCalDay', 'calDay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = dayName;
  });

  const todayKey = `hijri-${dd}-${mm}-${yyyy}`;
  const cached = await getMeta(todayKey);
  if (cached && cached.value) {
    const h = cached.value;
    const hijriStr = `${h.day} ${h.monthAr} ${h.year} ${currentLang === 'en' ? 'AH' : currentLang === 'ar' ? 'هـ' : 'ہجری'}`;
    ['homeCalHijri', 'calHijri', 'liveHijri'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = hijriStr;
    });
    return;
  }

  if (navigator.onLine) {
    try {
      const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`);
      const data = await res.json();
      if (data && data.data && data.data.hijri) {
        const h = data.data.hijri;
        await setMeta(todayKey, { day: h.day, monthAr: h.month.ar, year: h.year });
        const hijriStr = `${h.day} ${h.month.ar} ${h.year} ${currentLang === 'en' ? 'AH' : currentLang === 'ar' ? 'هـ' : 'ہجری'}`;
        ['homeCalHijri', 'calHijri', 'liveHijri'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = hijriStr;
        });
      }
    } catch (e) {
      ['homeCalHijri', 'calHijri', 'liveHijri'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '...';
      });
    }
  }
}

// ============================================================
// SURAH LIST
// ============================================================
async function loadSurahList() {
  allSurahs = surahNamesUr.map((name, i) => ({
    number: i + 1, name: name, ayahCount: ayahCounts[i] || 0
  }));
  renderSurahList();

  if (navigator.onLine) {
    try {
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await res.json();
      if (data && data.data) {
        allSurahs = data.data.map(s => ({
          number: s.number, name: s.name, englishName: s.englishName,
          ayahCount: s.numberOfAyahs, revelationType: s.revelationType
        }));
        renderSurahList();
      }
    } catch (e) { console.log('Local data used'); }
  }
}

async function renderSurahList() {
  const list = document.getElementById('surahList');
  if (!list) return;
  if (allSurahs.length === 0) {
    list.innerHTML = `<div class="loading"><div class="spinner"></div><p>${t('common.loading')}</p></div>`;
    return;
  }

  const cachedFlags = [];
  for (let i = 1; i <= 114; i++) {
    const c = await getSurahFromDB(currentLang, i);
    cachedFlags.push(!!c);
  }

  list.innerHTML = allSurahs.map((s, idx) => {
    const displayName = currentLang === 'en' ? (s.englishName || s.name) : s.name;
    return `
      <button class="surah-btn" onclick="loadSurah(${s.number})">
        <span class="num">${s.number}</span>
        <span class="name">${displayName}</span>
        ${cachedFlags[idx] ? '<span class="offline-mark">📥</span>' : ''}
      </button>
    `;
  }).join('');
}

function filterSurahs() {
  const query = document.getElementById('searchBox').value.trim();
  const list = document.getElementById('surahList');
  if (!list) return;
  if (!query) { renderSurahList(); return; }
  const filtered = allSurahs.filter(s =>
    s.name.includes(query) ||
    (s.englishName && s.englishName.toLowerCase().includes(query.toLowerCase())) ||
    String(s.number) === query
  );
  if (filtered.length === 0) {
    list.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-light);">${t('lessons.noResults')}</p>`;
    return;
  }
  list.innerHTML = filtered.map(s => {
    const displayName = currentLang === 'en' ? (s.englishName || s.name) : s.name;
    return `
      <button class="surah-btn" onclick="loadSurah(${s.number})">
        <span class="num">${s.number}</span>
        <span class="name">${displayName}</span>
      </button>
    `;
  }).join('');
}

// ============================================================
// LOAD SURAH
// ============================================================
async function loadSurah(number) {
  stopAudio();
  const view = document.getElementById('lessonView');
  const surah = allSurahs.find(s => s.number === number);
  view.innerHTML = `
    <div class="card">
      <button class="back-btn" onclick="closeLesson()">${t('lessons.back')}</button>
      <div class="loading"><div class="spinner"></div><p>${t('common.loading')}</p></div>
    </div>
  `;
  view.scrollIntoView({ behavior: 'smooth' });

  const cached = await getSurahFromDB(currentLang, number);
  if (cached && cached.data) {
    displaySurah(cached.data.arabic, cached.data.translation, number);
    return;
  }

  if (!navigator.onLine) {
    view.innerHTML = `
      <div class="card">
        <button class="back-btn" onclick="closeLesson()">${t('lessons.back')}</button>
        <div style="text-align:center; padding: 30px;">
          <p style="font-size: 3em;">📥</p>
          <p style="color: #d97706; font-weight: 600;">${t('offline.needInternet')}</p>
          <button class="btn btn-primary" style="margin-top: 15px;" onclick="showSection('offline')">📥 ${t('nav.offline')}</button>
        </div>
      </div>
    `;
    return;
  }

  let translationEdition = 'ur.jalandhry';
  if (currentLang === 'en') translationEdition = 'en.sahih';
  if (currentLang === 'ar') translationEdition = 'ar.maqsad';

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,${translationEdition}`);
    const data = await res.json();
    if (!data || !data.data || data.data.length < 2) throw new Error('No data');

    await saveSurahToDB(currentLang, number, {
      arabic: data.data[0],
      translation: data.data[1]
    });

    displaySurah(data.data[0], data.data[1], number);
  } catch (e) {
    view.innerHTML = `
      <div class="card">
        <button class="back-btn" onclick="closeLesson()">${t('lessons.back')}</button>
        <div style="text-align:center; padding: 30px;">
          <p style="font-size: 3em;">⚠️</p>
          <p style="color: #d97706; font-weight: 600;">${t('common.error')}</p>
          <button class="btn btn-primary" style="margin-top: 15px;" onclick="loadSurah(${number})">${t('common.retry')}</button>
        </div>
      </div>
    `;
  }
}

function displaySurah(arabicData, translationData, surahNum) {
  const view = document.getElementById('lessonView');
  const isDone = completed.includes(surahNum);
  currentSurahNum = surahNum;
  currentAyahNum = 1;

  let ayahsHtml = '';
  for (let i = 0; i < arabicData.ayahs.length; i++) {
    const arAyah = arabicData.ayahs[i];
    const trAyah = translationData.ayahs[i];
    let arabicText = arAyah.text;
    let translationText = trAyah ? trAyah.text : '';
    if (i === 0 && arabicData.number !== 1 && arabicData.number !== 9) {
      arabicText = arabicText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/u, '').trim();
    }
    ayahsHtml += `
      <div class="ayah" id="ayah-${arAyah.numberInSurah}" data-ayah="${arAyah.numberInSurah}">
        <span class="ayah-num">${t('lessons.ayah')} ${arAyah.numberInSurah}</span>
        <div class="ayah-play-icon" onclick="toggleAyahPlay(${arAyah.numberInSurah}, event)">
          <span id="playIcon-${arAyah.numberInSurah}">▶</span>
        </div>
        <div class="arabic" onclick="toggleAyahPlay(${arAyah.numberInSurah}, event)">${arabicText}</div>
        <div class="translation">${translationText}</div>
        <div class="ayah-actions">
          <button class="tafsir-btn" id="tafsirBtn-${arAyah.numberInSurah}" onclick="toggleTafsir(${arAyah.numberInSurah})">${t('lessons.viewTafsir')}</button>
        </div>
        <div class="tafsir-box" id="tafsirBox-${arAyah.numberInSurah}">
          <div class="tafsir-header">
            <span id="tafsirName-${arAyah.numberInSurah}">${t('tafsir.loading')}</span>
            <button class="tafsir-close" onclick="toggleTafsir(${arAyah.numberInSurah})">${t('lessons.close')}</button>
          </div>
          <div class="tafsir-text" id="tafsirText-${arAyah.numberInSurah}">
            <div class="tafsir-loading"><div class="mini-spinner"></div></div>
          </div>
        </div>
      </div>
    `;
  }

  const bismillahHtml = (arabicData.number !== 1 && arabicData.number !== 9)
    ? '<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' : '';

  const reciterOptions = reciters.map(r =>
    `<option value="${r.id}" ${r.id === currentReciter ? 'selected' : ''}>${t(r.key)}</option>`
  ).join('');

  const currentTafsirList = tafsirList[currentLang] || tafsirList.ur;
  const tafsirOptions = currentTafsirList.map(tf =>
    `<option value="${tf.id}" ${tf.id === currentTafsir[currentLang] ? 'selected' : ''}>${t(tf.key)}</option>`
  ).join('');

  view.innerHTML = `
    <div class="card">
      <button class="back-btn" onclick="closeLesson()">${t('lessons.back')}</button>
      <div class="lesson-header">
        <h2>${currentLang === 'en' ? (arabicData.englishName || arabicData.name) : arabicData.name}</h2>
        <div class="surah-info">
          ${t('lessons.surahNum')}: ${arabicData.number} | ${t('lessons.totalAyahs')}: ${arabicData.numberOfAyahs} |
          ${arabicData.revelationType === 'Meccan' ? t('lessons.meccan') : t('lessons.medinan')}
        </div>
      </div>
      <div class="audio-player">
        <div class="reciter-name">${t('audio.recitation')}: <span id="reciterName">${t(reciters.find(r => r.id === currentReciter).key)}</span></div>
        <select class="reciter-select" onchange="changeReciter(this.value)">${reciterOptions}</select>
        <div class="audio-controls">
          <button class="audio-btn" onclick="previousAyah()">⏮</button>
          <button class="audio-btn" onclick="rewind10()">⏪</button>
          <button class="audio-btn play-btn" id="playBtn" onclick="togglePlay()">▶</button>
          <button class="audio-btn" onclick="forward10()">⏩</button>
          <button class="audio-btn" onclick="nextAyah()">⏭</button>
        </div>
        <div class="audio-progress" onclick="seekAudio(event)">
          <div class="audio-progress-fill" id="audioProgressFill"></div>
        </div>
        <div class="audio-info">
          <span class="time" id="currentTime">0:00</span>
          <span id="ayahIndicator">${t('lessons.ayah')} ${currentAyahNum}</span>
          <span class="time" id="totalTime">0:00</span>
        </div>
      </div>
      <div style="background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05)); padding: 15px; border-radius: 12px; margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 700; color: var(--primary);">${t('tafsir.select')}</label>
        <select class="tafsir-select" onchange="changeTafsir(this.value)" style="margin-top: 0;">${tafsirOptions}</select>
      </div>
      ${bismillahHtml}
      ${ayahsHtml}
      <div class="action-btns">
        <button class="btn btn-primary" onclick="markDone(${arabicData.number})">${isDone ? t('lessons.completed') : t('lessons.iRead')}</button>
        <button class="btn btn-gold" onclick="scrollToTop()">${t('lessons.goTop')}</button>
      </div>
    </div>
  `;
  initAudio(surahNum, 1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// TAFSIR
// ============================================================
async function toggleTafsir(ayahNum) {
  const box = document.getElementById(`tafsirBox-${ayahNum}`);
  const btn = document.getElementById(`tafsirBtn-${ayahNum}`);
  if (!box) return;
  if (box.classList.contains('show')) {
    box.classList.remove('show');
    btn.classList.remove('active');
    btn.innerHTML = t('lessons.viewTafsir');
    return;
  }
  box.classList.add('show');
  btn.classList.add('active');
  btn.innerHTML = t('lessons.closeTafsir');
  const textEl = document.getElementById(`tafsirText-${ayahNum}`);
  const nameEl = document.getElementById(`tafsirName-${ayahNum}`);
  const tafsirId = currentTafsir[currentLang];
  const tafsirObj = tafsirList[currentLang].find(tf => tf.id === tafsirId);
  if (tafsirObj) nameEl.textContent = t(tafsirObj.key);
  if (textEl.dataset.loaded === 'true') return;
  loadTafsirContent(ayahNum);
}

async function loadTafsirContent(ayahNum) {
  const textEl = document.getElementById(`tafsirText-${ayahNum}`);
  if (!textEl) return;
  textEl.innerHTML = `<div class="tafsir-loading"><div class="mini-spinner"></div></div>`;
  const tafsirId = currentTafsir[currentLang];
  const cacheKey = `${tafsirId}-${currentSurahNum}-${ayahNum}`;

  const cached = await getTafsirFromDB(cacheKey);
  if (cached && cached.text) {
    textEl.innerHTML = cached.text;
    textEl.dataset.loaded = 'true';
    return;
  }

  if (!navigator.onLine) {
    textEl.innerHTML = `<p style="text-align:center; color: var(--text-light);">${t('tafsir.notFound')}</p>`;
    return;
  }

  try {
    const url = `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${tafsirId}/${currentSurahNum}/${ayahNum}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    const content = data.text || data.tafsir || '';
    const cleaned = content.replace(/<[^>]*>/g, '').split('\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('');
    textEl.innerHTML = cleaned;
    textEl.dataset.loaded = 'true';
    await saveTafsirToDB(cacheKey, cleaned);
  } catch (e) {
    textEl.innerHTML = `<p style="text-align:center; color: var(--text-light);">${t('tafsir.notFound')}</p>`;
  }
}

function changeTafsir(tafsirId) {
  currentTafsir[currentLang] = tafsirId;
  document.querySelectorAll('.tafsir-box.show').forEach(box => {
    const ayahNum = box.id.replace('tafsirBox-', '');
    const nameEl = document.getElementById(`tafsirName-${ayahNum}`);
    const tafsirObj = tafsirList[currentLang].find(tf => tf.id === tafsirId);
    if (nameEl && tafsirObj) nameEl.textContent = t(tafsirObj.key);
    const textEl = document.getElementById(`tafsirText-${ayahNum}`);
    if (textEl) { textEl.dataset.loaded = 'false'; loadTafsirContent(ayahNum); }
  });
}

// ============================================================
// AUDIO + AYAH PLAY/STOP
// ============================================================
function initAudio(surahNum, ayahNum) {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  currentSurahNum = surahNum;
  currentAyahNum = ayahNum;
  isPlaying = false;
  updatePlayButton();
  updateAyahIndicator();
  highlightAyah();
}

function getGlobalAyahNumber(surahNum, ayahNum) {
  let total = 0;
  for (let i = 0; i < surahNum - 1; i++) total += ayahCounts[i] || 0;
  return total + ayahNum;
}

function getAyahCount(surahNum) { return ayahCounts[surahNum - 1] || 7; }

async function playAyah(ayahNum) {
  if (currentAudio) currentAudio.pause();
  currentAyahNum = ayahNum;
  const globalAyahNum = getGlobalAyahNumber(currentSurahNum, ayahNum);
  const audioKey = `${currentReciter}-${globalAyahNum}`;
  const audioUrl = `https://cdn.islamic.network/quran/audio/128/${currentReciter}/${globalAyahNum}.mp3`;

  try {
    const cached = await getAudioFromDB(audioKey);
    if (cached && cached.blob) {
      const blobUrl = URL.createObjectURL(cached.blob);
      currentAudio = new Audio(blobUrl);
      setupAudioEvents();
      currentAudio.play().then(() => { isPlaying = true; updatePlayButton(); }).catch(() => {});
      updateAyahIndicator();
      highlightAyah();
      return;
    }
  } catch (e) {}

  currentAudio = new Audio(audioUrl);
  currentAudio.preload = 'auto';
  setupAudioEvents();
  currentAudio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
    saveAudioInBackground(audioKey, audioUrl);
  }).catch(() => {
    if (!navigator.onLine) alert(t('audio.offlineHint'));
    else alert(t('audio.notLoaded'));
  });
  updateAyahIndicator();
  highlightAyah();
}

async function saveAudioInBackground(key, url) {
  try {
    const existing = await getAudioFromDB(key);
    if (existing) return;
    const res = await fetch(url);
    if (!res.ok) return;
    const blob = await res.blob();
    await saveAudioToDB(key, blob);
    updateCacheStatus();
  } catch (e) {}
}

function setupAudioEvents() {
  if (!currentAudio) return;
  currentAudio.addEventListener('loadedmetadata', () => {
    const el = document.getElementById('totalTime');
    if (el) el.textContent = formatTime(currentAudio.duration);
  });
  currentAudio.addEventListener('timeupdate', updateAudioProgress);
  currentAudio.addEventListener('ended', () => {
    if (currentAyahNum < getAyahCount(currentSurahNum)) nextAyah();
    else { isPlaying = false; updatePlayButton(); }
  });
}

function togglePlay() {
  if (!currentAudio) {
    playAyah(currentAyahNum);
    return;
  }
  if (isPlaying) { currentAudio.pause(); isPlaying = false; }
  else {
    currentAudio.play().then(() => { isPlaying = true; updatePlayButton(); })
      .catch(() => {
        if (!navigator.onLine) alert(t('audio.offlineHint'));
        else alert(t('audio.notLoaded'));
      });
  }
  updatePlayButton();
}

function updatePlayButton() {
  const btn = document.getElementById('playBtn');
  if (!btn) return;
  if (isPlaying) { btn.innerHTML = '⏸'; btn.classList.add('playing'); }
  else { btn.innerHTML = '▶'; btn.classList.remove('playing'); }
}

function toggleAyahPlay(ayahNum, event) {
  if (event) event.stopPropagation();

  if (currentAyahNum === ayahNum && isPlaying && currentAudio) {
    currentAudio.pause();
    isPlaying = false;
    updatePlayButton();
    const icon = document.getElementById(`playIcon-${ayahNum}`);
    if (icon) icon.textContent = '▶';
    document.querySelectorAll('.ayah').forEach(a => a.classList.remove('playing'));
    return;
  }

  if (currentAyahNum === ayahNum && !isPlaying && currentAudio) {
    currentAudio.play().then(() => {
      isPlaying = true;
      updatePlayButton();
      const icon = document.getElementById(`playIcon-${ayahNum}`);
      if (icon) icon.textContent = '⏸';
      const el = document.getElementById(`ayah-${ayahNum}`);
      if (el) el.classList.add('playing');
    }).catch(() => {});
    return;
  }

  document.querySelectorAll('.ayah').forEach(a => {
    a.classList.remove('playing');
    const ay = a.getAttribute('data-ayah');
    const icon = document.getElementById(`playIcon-${ay}`);
    if (icon) icon.textContent = '▶';
  });

  playAyah(ayahNum);
}

function forward10() { if (currentAudio) currentAudio.currentTime = Math.min(currentAudio.currentTime + 10, currentAudio.duration || 0); }
function rewind10() { if (currentAudio) currentAudio.currentTime = Math.max(currentAudio.currentTime - 10, 0); }
function nextAyah() { if (currentAyahNum < getAyahCount(currentSurahNum)) playAyah(currentAyahNum + 1); }
function previousAyah() { if (currentAyahNum > 1) playAyah(currentAyahNum - 1); }

function updateAudioProgress() {
  if (!currentAudio) return;
  const percent = (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
  const fill = document.getElementById('audioProgressFill');
  if (fill) fill.style.width = percent + '%';
  const cur = document.getElementById('currentTime');
  if (cur) cur.textContent = formatTime(currentAudio.currentTime);
}

function seekAudio(event) {
  if (!currentAudio || !currentAudio.duration) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  currentAudio.currentTime = percent * currentAudio.duration;
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function changeReciter(reciterId) {
  currentReciter = reciterId;
  const nameEl = document.getElementById('reciterName');
  const reciter = reciters.find(r => r.id === reciterId);
  if (nameEl && reciter) nameEl.textContent = t(reciter.key);
  if (currentAudio) {
    const wasPlaying = isPlaying;
    playAyah(currentAyahNum);
    if (!wasPlaying && currentAudio) {
      setTimeout(() => {
        if (currentAudio) { currentAudio.pause(); isPlaying = false; updatePlayButton(); }
      }, 100);
    }
  }
}

function highlightAyah() {
  document.querySelectorAll('.ayah').forEach(a => {
    a.classList.remove('active');
    a.classList.remove('playing');
    const ay = a.getAttribute('data-ayah');
    const icon = document.getElementById(`playIcon-${ay}`);
    if (icon) icon.textContent = '▶';
  });
  const el = document.getElementById(`ayah-${currentAyahNum}`);
  if (el) {
    el.classList.add('active');
    if (isPlaying) el.classList.add('playing');
    const icon = document.getElementById(`playIcon-${currentAyahNum}`);
    if (icon) icon.textContent = isPlaying ? '⏸' : '▶';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function updateAyahIndicator() {
  const el = document.getElementById('ayahIndicator');
  if (el) el.textContent = `${t('lessons.ayah')} ${currentAyahNum}`;
}

function stopAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  isPlaying = false;
  updatePlayButton();
}

function closeLesson() {
  stopAudio();
  document.getElementById('lessonView').innerHTML = '';
  currentSurahNum = null;
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ============================================================
// BAYAN VIDEOS
// ============================================================
function renderBayanVideos() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  grid.innerHTML = bayanVideos.map((v, idx) => `
    <div class="video-card" onclick="openVideoModal(${idx})">
      <div class="video-thumb">
        <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy" onerror="this.style.display='none'">
        <div class="play-overlay">
          <div class="play-icon">▶</div>
        </div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-actions">
          <button class="video-action-btn watch" onclick="event.stopPropagation(); openVideoModal(${idx})">▶ ${t('bayan.playHere')}</button>
          <a class="video-action-btn yt" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" onclick="event.stopPropagation();">📺 YouTube</a>
        </div>
      </div>
    </div>
  `).join('');
}

function openVideoModal(idx) {
  currentVideoIndex = idx;
  const video = bayanVideos[idx];
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const title = document.getElementById('videoModalTitle');
  const name = document.getElementById('videoModalName');

  iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
  title.textContent = video.title;
  name.textContent = video.title;

  const prevBtn = document.getElementById('prevVideoBtn');
  const nextBtn = document.getElementById('nextVideoBtn');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === bayanVideos.length - 1;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  if (iframe) iframe.src = '';
  if (modal) modal.classList.remove('show');
  document.body.style.overflow = '';
}

function playPrevVideo() {
  if (currentVideoIndex > 0) openVideoModal(currentVideoIndex - 1);
}

function playNextVideo() {
  if (currentVideoIndex < bayanVideos.length - 1) openVideoModal(currentVideoIndex + 1);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideoModal();
  }
});

// ============================================================
// LOCATION + PRAYER TIMES
// ============================================================
function useMyLocation() {
  const btn = document.getElementById('gpsBtn');
  if (!navigator.geolocation) {
    alert(t('calendar.locationError'));
    return;
  }
  if (btn) { btn.disabled = true; btn.innerHTML = '⏳ ...'; }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      currentCoords = { lat, lng };
      currentCity = null;
      localStorage.setItem('userCoords', JSON.stringify(currentCoords));
      localStorage.removeItem('userCity');
      if (btn) { btn.disabled = false; btn.innerHTML = '📍 ' + t('calendar.useMyLocation'); }
      await loadPrayerTimesFromCoords(lat, lng);
      updateLocationDisplay(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    },
    (error) => {
      if (btn) { btn.disabled = false; btn.innerHTML = '📍 ' + t('calendar.useMyLocation'); }
      alert(t('calendar.locationDenied') + '\n\n' + t('calendar.locationError'));
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function toggleCityDropdown() {
  const wrap = document.getElementById('cityDropdownWrap');
  if (!wrap) return;
  wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
}

async function onCityChange(city) {
  if (!city) return;
  currentCity = city;
  currentCoords = null;
  localStorage.setItem('userCity', city);
  localStorage.removeItem('userCoords');
  await loadPrayerTimesFromCity(city);
  updateLocationDisplay(city + ', Pakistan');
  const wrap = document.getElementById('cityDropdownWrap');
  if (wrap) wrap.style.display = 'none';
}

function updateLocationDisplay(text) {
  const el = document.getElementById('currentLocationText');
  if (el) el.textContent = text;
}

async function loadPrayerTimesFromCoords(lat, lng) {
  const container = document.getElementById('prayerTimes');
  if (!container) return;
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const cacheKey = `prayer-coords-${lat.toFixed(2)}-${lng.toFixed(2)}-${dd}-${mm}-${yyyy}`;

  const cached = await getMeta(cacheKey);
  if (cached && cached.value) { displayPrayerTimes(cached.value); return; }

  if (!navigator.onLine) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-light);">${t('common.offline')}</p>`;
    return;
  }

  try {
    const res = await fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=1&school=0`);
    const data = await res.json();
    if (data && data.data && data.data.timings) {
      await setMeta(cacheKey, data.data.timings);
      displayPrayerTimes(data.data.timings);
    }
  } catch (e) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-light);">${t('common.checkInternet')}</p>`;
  }
}

async function loadPrayerTimesFromCity(city) {
  const container = document.getElementById('prayerTimes');
  if (!container) return;
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const cacheKey = `prayer-city-${city}-${dd}-${mm}-${yyyy}`;

  const cached = await getMeta(cacheKey);
  if (cached && cached.value) { displayPrayerTimes(cached.value); return; }

  if (!navigator.onLine) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-light);">${t('common.offline')}</p>`;
    return;
  }

  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Pakistan&method=1&school=0`);
    const data = await res.json();
    if (data && data.data && data.data.timings) {
      await setMeta(cacheKey, data.data.timings);
      displayPrayerTimes(data.data.timings);
    }
  } catch (e) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-light);">${t('common.checkInternet')}</p>`;
  }
}

async function loadPrayerTimes() {
  if (currentCoords) {
    await loadPrayerTimesFromCoords(currentCoords.lat, currentCoords.lng);
    updateLocationDisplay(`${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}`);
  } else if (currentCity) {
    await loadPrayerTimesFromCity(currentCity);
    updateLocationDisplay(currentCity + ', Pakistan');
  } else {
    await loadPrayerTimesFromCity('Islamabad');
    updateLocationDisplay('Islamabad, Pakistan');
  }
}

// ⚠️ IMPORTANT: parameter renamed from "t" to "timings" to avoid conflict with t() function
function displayPrayerTimes(timings) {
  const container = document.getElementById('prayerTimes');
  if (!container) return;
  const prayers = [
    { icon: '🌅', key: 'calendar.fajr', time: timings.Fajr },
    { icon: '☀️', key: 'calendar.sunrise', time: timings.Sunrise },
    { icon: '🌤️', key: 'calendar.dhuhr', time: timings.Dhuhr },
    { icon: '🌇', key: 'calendar.asr', time: timings.Asr },
    { icon: '🌆', key: 'calendar.maghrib', time: timings.Maghrib },
    { icon: '🌃', key: 'calendar.isha', time: timings.Isha }
  ];
  container.innerHTML = prayers.map(p => `
    <div class="event-card">
      <span class="event-icon">${p.icon}</span>
      <div class="event-name">${t(p.key)}</div>
      <div class="event-date" style="font-size: 1.1em; color: var(--primary); font-weight: 700;">${p.time}</div>
    </div>
  `).join('');
}

// ============================================================
// ISLAMIC EVENTS
// ============================================================
const islamicEvents = [
  { icon: '🌌', ur: 'شب معراج', en: "Isra and Mi'raj", ar: 'الإسراء والمعراج', date: '2026-01-16', hijri: '27 Rajab 1447' },
  { icon: '🌙', ur: 'رمضان کا آغاز', en: 'Ramadan Begins', ar: 'بداية رمضان', date: '2026-02-19', hijri: '1 Ramadan 1447' },
  { icon: '📖', ur: 'نزول قرآن', en: 'Nuzul al-Quran', ar: 'نزول القرآن', date: '2026-03-07', hijri: '17 Ramadan 1447' },
  { icon: '🎉', ur: 'عید الفطر', en: 'Eid al-Fitr', ar: 'عيد الفطر', date: '2026-03-20', hijri: '1 Shawwal 1447' },
  { icon: '🕋', ur: 'عید الاضحی', en: 'Eid al-Adha', ar: 'عيد الأضحى', date: '2026-05-27', hijri: '10 Dhul Hijjah 1447' },
  { icon: '🌙', ur: 'اسلامی نیا سال', en: 'Islamic New Year', ar: 'رأس السنة الهجرية', date: '2026-06-17', hijri: '1 Muharram 1448' },
  { icon: '🕌', ur: 'عاشورہ', en: 'Ashura', ar: 'عاشوراء', date: '2026-06-26', hijri: '10 Muharram 1448' },
  { icon: '🌟', ur: 'میلاد النبی ﷺ', en: 'Mawlid an-Nabi ﷺ', ar: 'المولد النبوي ﷺ', date: '2026-08-25', hijri: '12 Rabi al-Awwal 1448' }
];

function renderIslamicEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  grid.innerHTML = islamicEvents.map(ev => {
    const d = new Date(ev.date);
    let monthName;
    if (currentLang === 'en') monthName = englishMonths[d.getMonth()];
    else if (currentLang === 'ar') monthName = arabicMonths[d.getMonth()];
    else monthName = urduMonths[d.getMonth()];
    const dateStr = `${d.getDate()} ${monthName} ${d.getFullYear()}`;
    const name = currentLang === 'en' ? ev.en : currentLang === 'ar' ? ev.ar : ev.ur;
    return `
      <div class="event-card">
        <span class="event-icon">${ev.icon}</span>
        <div class="event-name">${name}</div>
        <div class="event-date">${dateStr}</div>
        <div class="event-hijri">${ev.hijri}</div>
      </div>
    `;
  }).join('');
}

// ============================================================
// DATE CONVERTER
// ============================================================
async function convertDate() {
  const input = document.getElementById('dateConverter');
  const result = document.getElementById('convertResult');
  if (!input || !result || !input.value) {
    if (result) result.innerHTML = `<p style="color: #d97706;">${t('calendar.selectDate')}</p>`;
    return;
  }
  if (!navigator.onLine) {
    result.innerHTML = `<p style="color: #d97706;">${t('calendar.needInternet')}</p>`;
    return;
  }
  const [yyyy, mm, dd] = input.value.split('-');
  result.innerHTML = `<p style="text-align:center; color: var(--primary);">${t('calendar.converting')}</p>`;
  try {
    const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`);
    const data = await res.json();
    if (data && data.data && data.data.hijri) {
      const h = data.data.hijri;
      let monthName;
      if (currentLang === 'en') monthName = englishMonths[parseInt(mm) - 1];
      else if (currentLang === 'ar') monthName = arabicMonths[parseInt(mm) - 1];
      else monthName = urduMonths[parseInt(mm) - 1];
      result.innerHTML = `
        <div style="background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: white; padding: 20px; border-radius: 15px; text-align: center;">
          <div style="font-size: 0.95em; opacity: 0.9; margin-bottom: 5px;">${dd} ${monthName} ${yyyy}</div>
          <div style="font-size: 1.5em; font-weight: 700;">⬇️</div>
          <div style="font-size: 1.4em; font-weight: 700; margin-top: 5px;">${h.day} ${h.month.ar} ${h.year}</div>
          <div style="font-size: 0.9em; opacity: 0.85; margin-top: 5px;">${h.weekday.ar}</div>
        </div>
      `;
    }
  } catch (e) {
    result.innerHTML = `<p style="color: #d97706;">${t('common.checkInternet')}</p>`;
  }
}

// ============================================================
// OFFLINE DOWNLOAD
// ============================================================
async function startDownload() {
  if (!navigator.onLine) { alert(t('offline.needInternet')); return; }

  const btn = document.getElementById('downloadBtn');
  const progress = document.getElementById('downloadProgress');
  const fill = document.getElementById('downloadProgressFill');
  const status = document.getElementById('downloadStatus');

  btn.disabled = true;
  btn.innerHTML = t('offline.downloading');
  progress.classList.add('show');

  let downloaded = 0, failed = 0;
  const total = 114;

  let translationEdition = 'ur.jalandhry';
  if (currentLang === 'en') translationEdition = 'en.sahih';
  if (currentLang === 'ar') translationEdition = 'ar.maqsad';

  for (let i = 1; i <= total; i++) {
    try {
      const existing = await getSurahFromDB(currentLang, i);
      if (existing) {
        downloaded++;
        const percent = Math.round((downloaded / total) * 100);
        fill.style.width = percent + '%';
        fill.textContent = percent + '%';
        status.textContent = `${t('offline.saved')} ${i} (${downloaded}/${total})`;
        continue;
      }
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${i}/editions/quran-uthmani,${translationEdition}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      if (data && data.data && data.data.length >= 2) {
        await saveSurahToDB(currentLang, i, { arabic: data.data[0], translation: data.data[1] });
        downloaded++;
      } else failed++;
      const percent = Math.round((downloaded / total) * 100);
      fill.style.width = percent + '%';
      fill.textContent = percent + '%';
      status.textContent = `✅ ${t('common.surah')} ${i} ${t('offline.saved')} (${downloaded}/${total})`;
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      failed++;
      status.textContent = `⚠️ ${t('common.surah')} ${i} ${t('offline.failed')} (${downloaded}/${total})`;
    }
  }

  await setMeta('lastUpdate', Date.now());
  btn.disabled = false;
  btn.innerHTML = t('offline.done');
  status.textContent = `${t('offline.completeMsg')} ${downloaded} ${t('offline.saved')}, ${failed} ${t('offline.failed')}`;
  setTimeout(() => { btn.innerHTML = t('offline.redownload'); }, 3000);
  updateCacheStatus();
  renderSurahList();
}

async function updateCacheStatus() {
  const surahCount = await countSurahsInDB();
  const tafsirCount = await countTafsirInDB();
  const audioCount = await countAudioInDB();
  const lastUpdate = await getMeta('lastUpdate');
  const s = document.getElementById('cachedSurahs');
  if (s) s.textContent = surahCount;
  const tf = document.getElementById('cachedTafsir');
  if (tf) tf.textContent = tafsirCount;
  const au = document.getElementById('cachedAudio');
  if (au) au.textContent = audioCount;
  if (lastUpdate && lastUpdate.value) {
    const d = new Date(lastUpdate.value);
    const lu = document.getElementById('lastUpdate');
    if (lu) lu.textContent = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
}

async function clearOfflineCache() {
  if (!confirm(t('offline.confirmClear'))) return;
  const database = await openDB();
  const tx = database.transaction(['surahs', 'tafsir', 'audio', 'meta'], 'readwrite');
  tx.objectStore('surahs').clear();
  tx.objectStore('tafsir').clear();
  tx.objectStore('audio').clear();
  tx.objectStore('meta').clear();
  tx.oncomplete = () => {
    alert(t('offline.cleared'));
    updateCacheStatus();
    renderSurahList();
  };
}

// ============================================================
// PROGRESS
// ============================================================
function markDone(number) {
  if (!completed.includes(number)) {
    completed.push(number);
    localStorage.setItem('completedSurahs', JSON.stringify(completed));
    alert(t('progress.marked'));
  } else alert(t('progress.alreadyDone'));
  updateProgress();
  renderLocalProgress();
  renderSurahList();
}

function updateProgress() {
  const percent = Math.round((completed.length / 114) * 100);
  const fill = document.getElementById('homeProgress');
  if (fill) { fill.style.width = percent + '%'; fill.textContent = percent + '%'; }
  const text = document.getElementById('progressText');
  if (text) text.textContent = `${completed.length} / 114 ${t('stats.completed')}`;
  const statDone = document.getElementById('statDone');
  if (statDone) statDone.textContent = completed.length;
  const statPercent = document.getElementById('statPercent');
  if (statPercent) statPercent.textContent = percent + '%';
}

function renderLocalProgress() {
  const el = document.getElementById('localProgress');
  if (!el) return;
  if (completed.length === 0) {
    el.innerHTML = `<p style="color: var(--text-light);">${t('progress.none')}</p>`;
    return;
  }
  const sorted = [...completed].sort((a, b) => a - b);
  el.innerHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px;">' +
    sorted.map(num => {
      const name = surahNamesUr[num - 1] || `${t('common.surah')} ${num}`;
      return `<div style="padding: 10px 14px; background: var(--bg-alt); border-radius: 10px; border-right: 3px solid var(--primary); display:flex; align-items:center; gap:8px;">
        <span style="background: var(--gold); color: var(--primary-dark); width: 26px; height: 26px; border-radius: 6px; display:flex; align-items:center; justify-content:center; font-size:0.8em; font-weight:700;">${num}</span>
        <span>✅ ${name}</span>
      </div>`;
    }).join('') + '</div>';
}

function resetProgress() {
  if (confirm(t('progress.resetConfirm'))) {
    completed = [];
    localStorage.removeItem('completedSurahs');
    updateProgress();
    renderLocalProgress();
    renderSurahList();
  }
}

// ============================================================
// SECTION SWITCHING
// ============================================================
function showSection(id) {
  if (id !== 'lessons') stopAudio();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  const section = document.getElementById(id);
  const navBtn = document.getElementById('nav-' + id);
  if (section) section.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  if (id === 'progress') renderLocalProgress();
  if (id === 'home') updateProgress();
  if (id === 'calendar') { renderIslamicEvents(); loadPrayerTimes(); loadIslamicDate(); }
  if (id === 'offline') updateCacheStatus();
  if (id === 'bayan') renderBayanVideos();

  window.scrollTo(0, 0);
}

// ============================================================
// PWA INSTALL
// ============================================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.classList.add('show');
});

function installApp() {
  if (!deferredPrompt) {
    alert('Your browser does not support install. Use browser menu to add to home screen.');
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    const btn = document.getElementById('installBtn');
    if (btn) btn.classList.remove('show');
  });
}

window.addEventListener('appinstalled', () => {
  const btn = document.getElementById('installBtn');
  if (btn) btn.classList.remove('show');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW failed:', err));
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initLanguage();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
  await openDB();
  loadIslamicDate();
  loadSurahList();
  updateProgress();
  updateCacheStatus();
  renderBayanVideos();
  setInterval(loadIslamicDate, 30 * 60 * 1000);
});

window.addEventListener('beforeunload', () => {
  if (currentAudio) currentAudio.pause();
});