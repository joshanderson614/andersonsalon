/* ============================================================
   Anderson Beauty — Booking Wizard JS
   ============================================================

   EMAIL SETUP (EmailJS — free tier supports 200 emails/month)
   ─────────────────────────────────────────────────────────────
   1. Go to https://www.emailjs.com and sign up (free)
   2. Add a Gmail service → copy the Service ID
   3. Create TWO email templates on the EmailJS dashboard:

      Template A — client confirmation
        To Email:  {{to_email}}
        Subject:   Your appointment at Anderson Beauty is confirmed
        Body type: HTML
        Body:      {{{message_html}}}

      Template B — owner notification
        To Email:  jepa614@gmail.com  (hardcode in EmailJS dashboard)
        Subject:   New Booking — {{service_name}} on {{appointment_date}}
        Body type: HTML
        Body:      {{{message_html}}}

      Note: Use triple braces {{{message_html}}} so EmailJS renders the
      HTML without escaping it. The full styled email is built here in JS.

   4. Copy your EmailJS Public Key from Account → API Keys.
   5. Fill in the four config values below.
   ============================================================ */

const EMAILJS_CONFIG = {
  publicKey:         '9YAD-ejYW46FWzyom',
  serviceId:         'service_h9f5wdo',
  clientTemplateId:  'template_yd8zlzi',
  ownerTemplateId:   'template_nkolt8t',
};

// ─── Data ────────────────────────────────────────────────────

const SERVICES = [
  // Hair
  { id: 's1', cat: 'hair',   name: "Women's Haircut & Style",     desc: "Consultation, wash, cut, blowout & finish",                   price: "From $85",  duration: "60–90 min", specialists: ['sofia','isabella','any'] },
  { id: 's2', cat: 'hair',   name: "Men's Haircut & Style",        desc: "Consultation, wash, precision cut & finish",                  price: "From $55",  duration: "45 min",    specialists: ['sofia','any'] },
  { id: 's3', cat: 'hair',   name: "Blowout & Style",              desc: "Wash, blowout, and thermal styling — no cut",                price: "$65",       duration: "45 min",    specialists: ['sofia','isabella'] },
  { id: 's4', cat: 'hair',   name: "Balayage",                     desc: "Hand-painted dimensional color technique",                    price: "From $180", duration: "2.5–3 hr",  specialists: ['isabella'] },
  { id: 's5', cat: 'hair',   name: "Full Highlights",              desc: "Classic foil highlights, full head coverage",                price: "From $150", duration: "2–2.5 hr",  specialists: ['isabella'] },
  { id: 's6', cat: 'hair',   name: "Partial Highlights",           desc: "Face-framing and crown highlights",                          price: "From $110", duration: "1.5–2 hr",  specialists: ['isabella','sofia'] },
  { id: 's7', cat: 'hair',   name: "Single Process Color",         desc: "Root touch-up or all-over color application",                price: "From $95",  duration: "1.5 hr",    specialists: ['isabella'] },
  { id: 's8', cat: 'hair',   name: "Keratin Smoothing Treatment",  desc: "Professional smoothing & frizz reduction — 3 month results", price: "From $250", duration: "2.5–3 hr",  specialists: ['sofia','isabella'] },
  // Nails
  { id: 'n1', cat: 'nails',  name: "Classic Manicure",             desc: "Shape, cuticle care, hand massage & polish",                 price: "$40",       duration: "45 min",    specialists: ['ava'] },
  { id: 'n2', cat: 'nails',  name: "Luxury Manicure",              desc: "Extended treatment with exfoliation, masque & hydration",    price: "$60",       duration: "60 min",    specialists: ['ava'] },
  { id: 'n3', cat: 'nails',  name: "Gel Manicure",                 desc: "Long-lasting gel polish with high-shine finish",             price: "$55",       duration: "60 min",    specialists: ['ava'] },
  { id: 'n4', cat: 'nails',  name: "Classic Pedicure",             desc: "Soak, exfoliation, foot massage & polish",                   price: "$55",       duration: "50 min",    specialists: ['ava'] },
  { id: 'n5', cat: 'nails',  name: "Luxury Spa Pedicure",          desc: "Paraffin wax, extended massage & masque treatment",          price: "$75",       duration: "75 min",    specialists: ['ava'] },
  { id: 'n6', cat: 'nails',  name: "Gel Pedicure",                 desc: "Full spa pedicure with long-lasting gel polish",             price: "$70",       duration: "60 min",    specialists: ['ava'] },
  { id: 'n7', cat: 'nails',  name: "Acrylic Full Set",             desc: "Full set of acrylic nail extensions, shaped & polished",     price: "$75",       duration: "90 min",    specialists: ['ava'] },
  // Skin
  { id: 'k1', cat: 'skin',   name: "Signature Anderson Facial",    desc: "Customized 60-min: cleanse, exfoliate, extract, mask & hydrate", price: "$120",  duration: "60 min",    specialists: ['emma'] },
  { id: 'k2', cat: 'skin',   name: "Deep Cleansing Facial",        desc: "Targeted for congestion, enlarged pores & breakouts",        price: "$95",       duration: "60 min",    specialists: ['emma'] },
  { id: 'k3', cat: 'skin',   name: "Anti-Aging Renewal Treatment", desc: "Retinol infusion, peptide masque, firming massage & serum",  price: "$150",      duration: "75 min",    specialists: ['emma'] },
  { id: 'k4', cat: 'skin',   name: "Hydrating Glow Facial",        desc: "Intensive moisture treatment with hyaluronic acid infusion", price: "$110",      duration: "60 min",    specialists: ['emma'] },
  { id: 'k5', cat: 'skin',   name: "Microdermabrasion",            desc: "Crystal resurfacing to smooth texture & tone",               price: "$130",      duration: "45 min",    specialists: ['emma'] },
  // Lashes (any available specialist — call to confirm)
  { id: 'l1', cat: 'lashes', name: "Brow Shaping & Tint",          desc: "Thread or wax shaping with professional tint",               price: "$45",       duration: "45 min",    specialists: ['any'] },
  { id: 'l2', cat: 'lashes', name: "Brow Lamination",              desc: "Restructure and set brow hairs for a fuller, defined look",  price: "$65",       duration: "60 min",    specialists: ['any'] },
  { id: 'l3', cat: 'lashes', name: "Classic Lash Extensions",      desc: "Individual lash extensions, natural to dramatic style",      price: "$165",      duration: "90–120 min",specialists: ['any'] },
  { id: 'l4', cat: 'lashes', name: "Volume Lash Extensions",       desc: "Multi-dimensional volume fans for maximum impact",           price: "$195",      duration: "2–2.5 hr",  specialists: ['any'] },
  { id: 'l5', cat: 'lashes', name: "Lash Extension Fill",          desc: "2–3 week maintenance fill appointment",                      price: "From $75",  duration: "60 min",    specialists: ['any'] },
  { id: 'l6', cat: 'lashes', name: "Lash Lift & Tint",             desc: "Semi-permanent curl and color — no extensions needed",       price: "$90",       duration: "60 min",    specialists: ['any'] },
];

const SPECIALISTS = [
  {
    id: 'sofia', name: 'Sofia Martinez', role: 'Master Stylist',
    bio: '18+ years. Precision cuts, blowouts & bridal styling.',
    scheduleLabel: 'Mon – Wed  12:00 PM – 4:00 PM  ·  Sun  10:00 AM – 5:00 PM',
    // schedule keyed by JS day-of-week: 0=Sun,1=Mon,2=Tue,3=Wed
    schedule: {
      0: { start: '10:00 AM', end: '5:00 PM'  },  // Sunday
      1: { start: '12:00 PM', end: '4:00 PM'  },  // Monday
      2: { start: '12:00 PM', end: '4:00 PM'  },  // Tuesday
      3: { start: '12:00 PM', end: '4:00 PM'  },  // Wednesday
    },
    cats: ['hair'],
  },
  { id: 'isabella', name: 'Isabella Chen',   role: 'Color Specialist', bio: 'Paris-trained colorist. Balayage, highlights & color work.',  cats: ['hair']   },
  { id: 'ava',      name: 'Ava Williams',    role: 'Nail Artist',      bio: 'Gel, acrylics, luxury manicures & editorial nail art.',       cats: ['nails']  },
  { id: 'emma',     name: 'Emma Thompson',   role: 'Lead Esthetician', bio: '14 years. Medical aesthetics & holistic skincare.',           cats: ['skin']   },
];

const ANY_SPECIALIST = {
  id: 'any', name: 'No Preference', role: 'Any Available Specialist',
  bio: "We'll match you with the best available specialist for your service.",
  cats: ['hair','nails','skin','lashes']
};

const MORNING_SLOTS   = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM'];
const AFTERNOON_SLOTS = ['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'];
const EVENING_SLOTS   = ['5:00 PM','5:30 PM','6:00 PM','6:30 PM'];

// SVG icons per category (for sidebar)
const CAT_ICONS = {
  hair:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  nails:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`,
  skin:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  lashes: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
};

// ─── State ───────────────────────────────────────────────────

const today = new Date();
let state = {
  currentStep: 1,
  selectedService:    null,
  selectedSpecialist: null,
  selectedDate:       null,
  selectedTime:       null,
  calYear:  today.getFullYear(),
  calMonth: today.getMonth(),
};

// ─── EmailJS Init ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
  renderServices('all');
  renderCalendar();
  updateSidebar();
  wireUpUI();
});

// ─── UI Wiring ───────────────────────────────────────────────

function wireUpUI() {
  // Category tabs
  document.getElementById('category-tabs')?.addEventListener('click', e => {
    const tab = e.target.closest('.category-tab');
    if (!tab) return;
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderServices(tab.dataset.cat);
  });

  // Step next buttons
  document.getElementById('step1-next')?.addEventListener('click', () => {
    if (!state.selectedService) return;
    renderStylists();
    goToStep(2);
  });

  document.getElementById('step2-next')?.addEventListener('click', () => {
    if (!state.selectedSpecialist) return;
    renderCalendar();
    goToStep(3);
  });

  document.getElementById('step3-next')?.addEventListener('click', () => {
    if (!state.selectedDate || !state.selectedTime) return;
    goToStep(4);
  });

  document.getElementById('confirm-btn')?.addEventListener('click', handleConfirm);

  // Calendar navigation
  document.getElementById('cal-prev')?.addEventListener('click', () => {
    state.calMonth--;
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
    renderCalendar();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    state.calMonth++;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    renderCalendar();
  });
}

// ─── Step Navigation ─────────────────────────────────────────

window.goToStep = function(step) {
  document.querySelectorAll('.step').forEach(el => {
    const n = parseInt(el.dataset.step);
    el.classList.remove('active','done');
    if (n === step) el.classList.add('active');
    if (n < step)   el.classList.add('done');
  });
  [1,2,3].forEach(i => {
    const conn = document.getElementById(`conn-${i}-${i+1}`);
    if (conn) conn.classList.toggle('done', i < step);
  });
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${step}`);
  if (panel) panel.classList.add('active');
  state.currentStep = step;
  const stepsBar = document.getElementById('booking-steps');
  if (stepsBar) {
    stepsBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// ─── Step 1: Services ────────────────────────────────────────

function renderServices(cat = 'all') {
  const list = document.getElementById('service-list');
  const filtered = cat === 'all' ? SERVICES : SERVICES.filter(s => s.cat === cat);

  list.innerHTML = filtered.map(s => `
    <div class="booking-service-item ${state.selectedService?.id === s.id ? 'selected' : ''}"
         data-id="${s.id}" role="button" tabindex="0">
      <div class="bsi-info">
        <h4>${s.name}</h4>
        <p>${s.desc}</p>
      </div>
      <div class="bsi-meta">
        <span class="bsi-price">${s.price}</span>
        <span class="bsi-duration">${s.duration}</span>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.booking-service-item').forEach(el => {
    el.addEventListener('click', () => selectService(el.dataset.id));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectService(el.dataset.id); });
  });
}

function selectService(id) {
  state.selectedService    = SERVICES.find(s => s.id === id) || null;
  state.selectedSpecialist = null;
  state.selectedDate       = null;
  state.selectedTime       = null;
  updateSidebar();

  document.querySelectorAll('.booking-service-item').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === id);
  });

  document.getElementById('step1-next').disabled = false;

  // Auto-advance after brief visual confirmation
  setTimeout(() => {
    if (state.selectedService) {
      renderStylists();
      goToStep(2);
    }
  }, 420);
}

// ─── Step 2: Specialists ─────────────────────────────────────

function renderStylists() {
  const grid = document.getElementById('stylist-grid');
  const svc  = state.selectedService;
  if (!svc) return;

  let eligible = SPECIALISTS.filter(sp => svc.specialists.includes(sp.id));
  if (svc.specialists.includes('any')) {
    eligible = [ANY_SPECIALIST, ...eligible];
  }

  grid.innerHTML = eligible.map(sp => `
    <div class="stylist-card ${state.selectedSpecialist?.id === sp.id ? 'selected' : ''}"
         data-id="${sp.id}" role="button" tabindex="0">
      <div class="stylist-avatar">${sp.name.charAt(0)}</div>
      <h3>${sp.name}</h3>
      <div class="stylist-role">${sp.role}</div>
      <p class="stylist-bio">${sp.bio}</p>
      ${sp.scheduleLabel ? `<div class="stylist-schedule">${sp.scheduleLabel}</div>` : ''}
    </div>
  `).join('');

  grid.querySelectorAll('.stylist-card').forEach(el => {
    el.addEventListener('click', () => selectSpecialist(el.dataset.id, eligible));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectSpecialist(el.dataset.id, eligible); });
  });
}

function selectSpecialist(id, eligible) {
  state.selectedSpecialist = eligible.find(sp => sp.id === id) || null;
  state.selectedDate = null;
  state.selectedTime = null;
  updateSidebar();

  document.querySelectorAll('.stylist-card').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === id);
  });

  document.getElementById('step2-next').disabled = false;

  // Auto-advance
  setTimeout(() => {
    if (state.selectedSpecialist) {
      renderCalendar();
      goToStep(3);
    }
  }, 420);
}

// ─── Step 3: Calendar ────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar() {
  const { calYear: year, calMonth: month } = state;
  document.getElementById('cal-month-label').textContent = `${MONTHS[month]} ${year}`;

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayMs     = new Date(new Date().setHours(0,0,0,0)).getTime();

  let html = '';
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const date   = new Date(year, month, d);
    const dateMs = date.getTime();
    const isPast = dateMs < todayMs;
    const isToday = dateMs === todayMs;
    const hasSlots = !isPast && hasAvailability(year, month, d);
    const isSelected = state.selectedDate &&
      state.selectedDate.getFullYear() === year &&
      state.selectedDate.getMonth() === month &&
      state.selectedDate.getDate() === d;

    let cls = 'cal-day';
    if (isPast || !hasSlots) cls += ' past disabled';
    else                     cls += ' available';
    if (isToday)    cls += ' today';
    if (isSelected) cls += ' selected';

    html += `<div class="${cls}" data-year="${year}" data-month="${month}" data-day="${d}">${d}</div>`;
  }

  document.getElementById('cal-days').innerHTML = html;

  document.querySelectorAll('.cal-day.available').forEach(el => {
    el.addEventListener('click', () => {
      selectDate(new Date(parseInt(el.dataset.year), parseInt(el.dataset.month), parseInt(el.dataset.day)));
    });
  });
}

// Convert "10:30 AM" → minutes since midnight
function slotToMinutes(str) {
  const [time, period] = str.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function hasAvailability(year, month, day) {
  const sp = state.selectedSpecialist;
  // If specialist has a defined schedule, only allow their working days
  if (sp?.schedule) {
    const dayOfWeek = new Date(year, month, day).getDay();
    if (!sp.schedule[dayOfWeek]) return false;
  }
  const seed   = year * 10000 + month * 100 + day + (sp?.id?.charCodeAt(0) || 0);
  const pseudo = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  return (pseudo % 10) > 1;
}

function slotBooked(year, month, day, slotIndex) {
  const spCode = state.selectedSpecialist?.id?.charCodeAt(0) || 0;
  const seed   = year * 1000000 + month * 10000 + day * 100 + slotIndex + spCode * 7;
  const pseudo = ((seed * 22695477 + 1) & 0xffffffff) >>> 0;
  return (pseudo % 5) === 0;
}

function selectDate(date) {
  state.selectedDate = date;
  state.selectedTime = null;
  updateSidebar();
  renderCalendar();
  renderTimeSlots(date);
  document.getElementById('step3-next').disabled = true;
}

function renderTimeSlots(date) {
  document.getElementById('no-date-msg').style.display  = 'none';
  const content = document.getElementById('timeslot-content');
  content.style.display = 'block';

  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const dayOfWeek = date.getDay();
  const isSunday  = dayOfWeek === 0;
  const todayMs   = new Date(new Date().setHours(0,0,0,0)).getTime();
  const isToday   = date.getTime() === todayMs;
  const nowH = new Date().getHours(), nowM = new Date().getMinutes();

  // Filter slots to specialist's working hours for this day
  const sp = state.selectedSpecialist;
  const spHours = sp?.schedule?.[dayOfWeek];
  function inSchedule(slot) {
    if (!spHours) return true;
    const slotMin  = slotToMinutes(slot);
    const startMin = slotToMinutes(spHours.start);
    const endMin   = slotToMinutes(spHours.end);
    return slotMin >= startMin && slotMin <= endMin;
  }

  function isPast(slot) {
    if (!isToday) return false;
    const [time, period] = slot.split(' ');
    let [h, min] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h < nowH || (h === nowH && min <= nowM);
  }

  function renderGroup(label, slots, offset) {
    const filtered = slots.filter(inSchedule);
    if (!filtered.length) return '';
    const items = filtered.map((s) => {
      const origIdx   = slots.indexOf(s);
      const unavailable = slotBooked(y, m, d, offset + origIdx) || isPast(s);
      const cls = unavailable ? 'timeslot booked'
        : state.selectedTime === s ? 'timeslot selected' : 'timeslot';
      return `<div class="${cls}" data-slot="${s}">${s}</div>`;
    }).join('');
    return `<div class="timeslot-group"><div class="timeslot-period">${label}</div><div class="timeslot-list">${items}</div></div>`;
  }

  // Schedule note for specialists with restricted hours
  const scheduleNote = spHours
    ? `<div class="specialist-hours-note">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${sp.name}'s hours: ${spHours.start} – ${spHours.end}
       </div>`
    : '';

  let html = scheduleNote
           + renderGroup('Morning', MORNING_SLOTS, 0)
           + renderGroup('Afternoon', AFTERNOON_SLOTS, 6);
  if (!isSunday) html += renderGroup('Evening', EVENING_SLOTS, 16);

  content.innerHTML = html;

  content.querySelectorAll('.timeslot:not(.booked)').forEach(el => {
    el.addEventListener('click', () => selectTime(el.dataset.slot));
  });
}

function selectTime(slot) {
  state.selectedTime = slot;
  updateSidebar();

  document.querySelectorAll('.timeslot:not(.booked)').forEach(el => {
    el.classList.toggle('selected', el.dataset.slot === slot);
  });

  document.getElementById('step3-next').disabled = false;

  // Auto-advance after time selection
  setTimeout(() => {
    if (state.selectedTime) goToStep(4);
  }, 420);
}

// ─── Step 4: Confirm ─────────────────────────────────────────

function handleConfirm() {
  const firstName = document.getElementById('first-name')?.value.trim();
  const lastName  = document.getElementById('last-name')?.value.trim();
  const email     = document.getElementById('email')?.value.trim();
  const phone     = document.getElementById('phone')?.value.trim();

  // Validate
  let valid = true;
  ['first-name','last-name','email','phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.style.borderColor = '#c0392b';
      el.addEventListener('input', () => el.style.borderColor = '', { once: true });
      valid = false;
    }
  });
  if (!valid) return;

  const notes     = document.getElementById('notes')?.value.trim() || 'None';
  const firstTime = document.getElementById('first-time')?.checked ? 'Yes — complimentary consultation included' : 'No';
  const dateStr   = state.selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Build confirmation details HTML
  document.getElementById('confirmation-details').innerHTML = `
    <div class="summary-item" style="border-bottom:1px solid var(--cream-dark);padding:0.75rem 0;">
      <div class="summary-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div class="summary-info"><label>Name</label><span>${firstName} ${lastName}</span></div>
    </div>
    <div class="summary-item" style="border-bottom:1px solid var(--cream-dark);padding:0.75rem 0;">
      <div class="summary-icon">${CAT_ICONS[state.selectedService?.cat] || CAT_ICONS.hair}</div>
      <div class="summary-info"><label>Service</label><span>${state.selectedService?.name}</span></div>
    </div>
    <div class="summary-item" style="border-bottom:1px solid var(--cream-dark);padding:0.75rem 0;">
      <div class="summary-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
      <div class="summary-info"><label>Date</label><span>${dateStr}</span></div>
    </div>
    <div class="summary-item" style="padding:0.75rem 0;">
      <div class="summary-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
      <div class="summary-info"><label>Time</label><span>${state.selectedTime} with ${state.selectedSpecialist?.name}</span></div>
    </div>
  `;

  // Send emails
  sendConfirmationEmails({
    firstName, lastName, email, phone, notes, firstTime,
  }, {
    service:    state.selectedService,
    specialist: state.selectedSpecialist,
    date:       state.selectedDate,
    dateStr,
    time:       state.selectedTime,
  });

  // Show confirmation panel
  document.getElementById('booking-steps').style.display = 'none';
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-confirm').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Email Sending ───────────────────────────────────────────

function buildClientEmailHtml(client, booking) {
  const name = `${client.firstName} ${client.lastName}`;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#1E1E1E;padding:36px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#C9A84C;">Anderson Beauty</p>
          <p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Est. 2000 &nbsp;·&nbsp; Los Angeles</p>
        </td></tr>

        <!-- Gold bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#C9A84C,#e8c97a,#C9A84C);"></td></tr>

        <!-- Greeting -->
        <tr><td style="padding:44px 40px 24px;text-align:center;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;">Appointment Confirmed</p>
          <h1 style="margin:0 0 16px;font-size:28px;font-weight:400;color:#1E1E1E;line-height:1.3;">You're all set, ${client.firstName}.</h1>
          <p style="margin:0;font-size:15px;color:#6b6b6b;line-height:1.7;">Thank you for booking with Anderson Beauty. We look forward to seeing you and making your visit exceptional.</p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;"><div style="height:1px;background:#ede8e0;"></div></td></tr>

        <!-- Appointment details -->
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 20px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;">Appointment Details</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9e9e9e;width:40%;">Service</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;font-weight:600;">${booking.service.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9e9e9e;">Specialist</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.specialist.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9e9e9e;">Date</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.dateStr}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9e9e9e;">Time</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.time}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9e9e9e;">Duration</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.service.duration}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9e9e9e;">Est. Price</td>
              <td style="padding:10px 0;font-size:14px;color:#C9A84C;font-weight:600;">${booking.service.price}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Notes (if any) -->
        ${client.notes && client.notes !== 'None' ? `
        <tr><td style="padding:0 40px 32px;">
          <div style="background:#f9f6f1;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:0 4px 4px 0;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#C9A84C;">Your Notes</p>
            <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">${client.notes}</p>
          </div>
        </td></tr>` : ''}

        <!-- Location box -->
        <tr><td style="padding:0 40px 40px;">
          <div style="background:#1E1E1E;border-radius:4px;padding:24px 28px;text-align:center;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;">Location</p>
            <a href="https://maps.google.com/?q=700+Levering+Ave,+Los+Angeles,+CA" style="margin:0 0 4px;font-size:15px;color:#ffffff;font-weight:600;text-decoration:none;display:block;">700 Levering Ave, Los Angeles</a>
            <p style="margin:0 0 14px;font-size:12px;color:rgba(255,255,255,0.5);">Mon–Sat 9am–7pm &nbsp;·&nbsp; Sun 10am–5pm</p>
            <a href="tel:+13109859260" style="display:inline-block;background:#C9A84C;color:#1E1E1E;text-decoration:none;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:700;padding:10px 24px;border-radius:2px;">+1 310 985 9260</a>
          </div>
        </td></tr>

        <!-- Policy note -->
        <tr><td style="padding:0 40px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">Please arrive 10 minutes early &nbsp;·&nbsp; 24-hour cancellation notice required<br>Late arrivals may result in a shortened service</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9f6f1;padding:24px 40px;text-align:center;border-top:1px solid #ede8e0;">
          <p style="margin:0;font-size:11px;color:#bbb;">© 2025 Anderson Beauty &nbsp;·&nbsp; 700 Levering Ave, Los Angeles</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildOwnerEmailHtml(client, booking) {
  const name = `${client.firstName} ${client.lastName}`;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#1E1E1E;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#C9A84C;">Anderson Beauty — New Booking</p>
          <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);">Owner Notification</p>
        </td></tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,#C9A84C,#e8c97a,#C9A84C);"></td></tr>

        <!-- Summary line -->
        <tr><td style="padding:36px 40px 20px;text-align:center;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:400;color:#1E1E1E;">${booking.service.name}</h1>
          <p style="margin:0;font-size:15px;color:#C9A84C;font-weight:600;">${booking.dateStr} &nbsp;at&nbsp; ${booking.time}</p>
        </td></tr>

        <tr><td style="padding:0 40px;"><div style="height:1px;background:#ede8e0;"></div></td></tr>

        <!-- Client details -->
        <tr><td style="padding:28px 40px;">
          <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;">Client Details</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;width:38%;">Name</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;">Email</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;"><a href="mailto:${client.email}" style="color:#C9A84C;text-decoration:none;">${client.email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;">Phone</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;"><a href="tel:${client.phone}" style="color:#C9A84C;text-decoration:none;">${client.phone}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:12px;color:#9e9e9e;">First Visit</td>
              <td style="padding:8px 0;font-size:14px;color:#1E1E1E;">${client.firstTime}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Appointment details -->
        <tr><td style="padding:0 40px 28px;">
          <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;">Appointment Details</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;width:38%;">Service</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.service.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;">Specialist</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.specialist.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;">Date</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.dateStr}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;">Time</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.time}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:12px;color:#9e9e9e;">Duration</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#1E1E1E;">${booking.service.duration}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:12px;color:#9e9e9e;">Price</td>
              <td style="padding:8px 0;font-size:14px;color:#C9A84C;font-weight:600;">${booking.service.price}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Notes -->
        ${client.notes && client.notes !== 'None' ? `
        <tr><td style="padding:0 40px 28px;">
          <div style="background:#f9f6f1;border-left:3px solid #C9A84C;padding:14px 18px;border-radius:0 4px 4px 0;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#C9A84C;">Client Notes</p>
            <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">${client.notes}</p>
          </div>
        </td></tr>` : ''}

        <!-- Footer -->
        <tr><td style="background:#f9f6f1;padding:20px 40px;text-align:center;border-top:1px solid #ede8e0;">
          <p style="margin:0;font-size:11px;color:#bbb;">Anderson Beauty &nbsp;·&nbsp; 700 Levering Ave, Los Angeles &nbsp;·&nbsp; +1 310 985 9260</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function sendConfirmationEmails(client, booking) {
  if (!window.emailjs || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
    console.info('[Anderson Beauty] EmailJS not configured — skipping email send. See booking.js for setup instructions.');
    return;
  }

  const baseParams = {
    to_name:           `${client.firstName} ${client.lastName}`,
    to_email:          client.email,
    client_phone:      client.phone,
    service_name:      booking.service.name,
    service_price:     booking.service.price,
    service_duration:  booking.service.duration,
    specialist_name:   booking.specialist.name,
    appointment_date:  booking.dateStr,
    appointment_time:  booking.time,
    special_notes:     client.notes || 'None',
    is_first_visit:    client.firstTime,
    salon_address:     '700 Levering Ave, Los Angeles',
    salon_phone:       '+1 310 985 9260',
  };

  // Email to client — full branded HTML confirmation
  emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.clientTemplateId, {
    ...baseParams,
    message_html: buildClientEmailHtml(client, booking),
  })
    .then(() => console.info('[Anderson Beauty] Client confirmation email sent.'))
    .catch(err => console.error('[Anderson Beauty] Client email error:', err));

  // Email to salon owner — full booking details
  emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.ownerTemplateId, {
    ...baseParams,
    to_email:     'jepa614@gmail.com',
    message_html: buildOwnerEmailHtml(client, booking),
  })
    .then(() => console.info('[Anderson Beauty] Owner notification email sent.'))
    .catch(err => console.error('[Anderson Beauty] Owner email error:', err));
}

// ─── Sidebar ─────────────────────────────────────────────────

function updateSidebar() {
  document.getElementById('sum-service').textContent =
    state.selectedService ? state.selectedService.name : 'Not selected';

  document.getElementById('sum-specialist').textContent =
    state.selectedSpecialist ? state.selectedSpecialist.name : 'Not selected';

  const dateEl = document.getElementById('sum-date');
  dateEl.textContent = state.selectedDate
    ? state.selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'Not selected';

  document.getElementById('sum-time').textContent = state.selectedTime || 'Not selected';
  document.getElementById('sum-price').textContent = state.selectedService ? state.selectedService.price : '—';

  // Update service icon in sidebar
  const iconEl = document.getElementById('sum-service-icon');
  if (iconEl && state.selectedService) {
    iconEl.innerHTML = CAT_ICONS[state.selectedService.cat] || CAT_ICONS.hair;
  }
}

// ─── Reset ───────────────────────────────────────────────────

window.resetBooking = function() {
  state = {
    currentStep: 1,
    selectedService:    null,
    selectedSpecialist: null,
    selectedDate:       null,
    selectedTime:       null,
    calYear:  today.getFullYear(),
    calMonth: today.getMonth(),
  };

  ['first-name','last-name','email','phone','notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.style.borderColor = ''; }
  });
  const cb = document.getElementById('first-time');
  if (cb) cb.checked = false;

  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.category-tab[data-cat="all"]')?.classList.add('active');

  document.getElementById('step1-next').disabled = true;
  document.getElementById('step2-next').disabled = true;
  document.getElementById('step3-next').disabled = true;

  document.getElementById('booking-steps').style.display = '';
  document.getElementById('no-date-msg').style.display  = '';
  document.getElementById('timeslot-content').style.display = 'none';
  document.getElementById('timeslot-content').innerHTML = '';

  updateSidebar();
  renderServices('all');
  goToStep(1);
};
