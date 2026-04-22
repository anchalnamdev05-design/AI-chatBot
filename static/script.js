/**
 * MediCaps University – Smart Enquiry Portal
 * script.js — All application logic
 *
 * Sections:
 *  1. Data Layer     (localStorage abstraction)
 *  2. Session        (login state management)
 *  3. Router         (page navigation)
 *  4. Validation     (form helpers)
 *  5. Toast          (notification utility)
 *  6. Auth           (register / login / logout)
 *  7. Chat           (AI-powered conversation)
 *  8. Admin          (dashboard, FAQs, history, students, college info)
 *  9. Init           (app bootstrap)
 */

/* ═══════════════════════════════════════════════════════════
   1. DATA LAYER  (localStorage-based persistence)
═══════════════════════════════════════════════════════════ */

const DB = {
  /** Generic getter – returns parsed value or null */
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch {
      return null;
    }
  },

  /** Generic setter */
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  /* ── Students ── */
  getStudents() { return this.get('mc_students') || []; },
  saveStudents(students) { this.set('mc_students', students); },

  /* ── FAQs ── */
  getFAQs() { return this.get('mc_faqs') || getDefaultFAQs(); },
  saveFAQs(faqs) { this.set('mc_faqs', faqs); },

  /* ── Chat sessions ── */
  getChats() { return this.get('mc_chats') || {}; },
  saveChats(chats) { this.set('mc_chats', chats); },

  /* ── College info ── */
  getCollegeInfo() {
    return this.get('mc_colinfo') || {
      name:    'MediCaps University',
      phone:   '+91-731-4259500',
      address: 'AB Road, Pigdamber, Rau, Indore – 453331',
      email:   'info@medicapsuniversity.ac.in',
      notice:  'Admissions open for 2024-25. Apply before 30th June 2024!'
    };
  },
  saveCollegeInfo(info) { this.set('mc_colinfo', info); }
};

/** Default FAQ seed data */
function getDefaultFAQs() {
  return [
    {
      id: 1,
      cat: 'Admissions',
      q: 'What is the admission process at MediCaps University?',
      a: 'The admission process involves:\n(1) Fill online application form at www.medicapsuniversity.ac.in\n(2) Submit Class 12th marksheets with PCM subjects\n(3) Provide JEE Main / MP-PET scores\n(4) Attend counseling session\n(5) Pay admission fee and confirm seat.\n\nDocuments needed: 10th & 12th marksheets, character certificate, transfer certificate, migration certificate, 6 passport photos, and Aadhar card.'
    },
    {
      id: 2,
      cat: 'Fee Structure',
      q: 'What is the fee structure for B.Tech courses?',
      a: 'B.Tech Annual Fee Structure:\n• B.Tech CSE / IT: ₹1,10,000/year\n• B.Tech ECE / ME / CE: ₹95,000/year\n• Hostel Fee: ₹60,000/year (including mess)\n• Exam Fee: ₹3,000/semester\n• Library & Lab Fee: ₹5,000/year\n\nTotal estimated cost per year: ₹1,78,000 (CSE with hostel). EMI options available. Bank loans supported.'
    },
    {
      id: 3,
      cat: 'Courses',
      q: 'What courses and programs are offered at MediCaps?',
      a: 'MediCaps University offers:\n\nUndergraduate (4 Years):\n• B.Tech CSE (120 seats)\n• B.Tech IT (60 seats)\n• B.Tech ECE (60 seats)\n• B.Tech ME (60 seats)\n• B.Tech Civil (60 seats)\n\nPostgraduate (2 Years):\n• MBA – Business Administration (120 seats)\n• M.Tech Computer Science (30 seats)\n\nAll programs are AICTE approved and affiliated to RGPV, Bhopal.'
    },
    {
      id: 4,
      cat: 'Placements',
      q: 'What is the placement record and which companies visit?',
      a: "MediCaps University has a 94% placement rate (2023 batch).\n\nTop Recruiters: TCS, Infosys, Wipro, Accenture, Capgemini, HCL, Cognizant, IBM, Tech Mahindra, Deloitte, Byju's, Amazon, Flipkart.\n\nPackage Stats:\n• Average Package: ₹4–6 LPA\n• Highest Package: ₹18 LPA\n• Median Package: ₹4.2 LPA\n\nPre-placement training includes aptitude tests, coding practice, group discussions, and mock interviews."
    },
    {
      id: 5,
      cat: 'Scholarships',
      q: 'What scholarships are available for students?',
      a: 'MediCaps University offers multiple scholarships:\n\n1. Merit Scholarship: 50% fee waiver for students scoring 90%+ in Class 12th\n2. Sports Scholarship: For state/national-level athletes\n3. Cultural Scholarship: For outstanding artistic talent\n4. MP Government Scholarship: Via MP Scholarship Portal\n5. SC/ST/OBC Scholarship: Government-funded\n\nContact: scholarship@medicapsuniversity.ac.in or visit the Scholarship Cell, Admin Block, Room 105.'
    },
    {
      id: 6,
      cat: 'Hostel & Campus',
      q: 'What campus facilities and hostel are available?',
      a: 'Campus Facilities (20-acre campus in Indore):\n• Central Library: 50,000+ books, e-journals, 24/7 reading room\n• Computer Labs: 500+ systems with high-speed internet\n• Research Labs: Electronics, Robotics, AI/ML Labs\n• Sports Complex: Cricket ground, Football field, Basketball & Volleyball courts, Gymnasium\n• Hostel: Separate boys & girls hostels with 24/7 security\n• Cafeteria: Multiple food options, veg & non-veg\n• Medical Center with resident doctor\n• Wi-Fi across entire campus\n• ATM & Bank branch on campus'
    },
    {
      id: 7,
      cat: 'Faculty',
      q: 'Tell me about faculty and professors at MediCaps University',
      a: 'MediCaps University has 200+ highly qualified faculty members.\n\nCSE Department Highlights:\n• HOD: Dr. Priya Sharma (PhD – IIT Bombay, 20 years experience)\n• Dr. Rajesh Kumar – AI/ML, Data Science (15+ publications)\n• Prof. Anita Patel – Web Technologies, Cloud Computing\n• Dr. Suresh Verma – Computer Networks, Cybersecurity\n\nFaculty Qualifications:\n• 40% faculty hold PhD degrees\n• 95% have industry experience\n• Active research in AI, IoT, Blockchain, and Clean Energy\n\nTeacher-Student Ratio: 1:15'
    },
    {
      id: 8,
      cat: 'Timetable & Events',
      q: 'What are the upcoming events and exam timetable?',
      a: 'Academic Calendar 2024-25:\n\n📅 Odd Semester (Jul–Nov):\n• Classes start: July 15, 2024\n• Mid-semester exam: September 16-20, 2024\n• Cultural Fest "Utsav 2024": October 25-27\n• End-semester exam: November 18-30, 2024\n\n📅 Even Semester (Jan–May):\n• Classes start: January 6, 2025\n• Mid-semester exam: February 17-21, 2025\n• Tech Fest "TechNova 2025": March 14-16\n• End-semester exam: April 21 – May 3, 2025\n\nExact timetables are published on the student portal.'
    },
    {
      id: 9,
      cat: 'Contact',
      q: 'How can I contact the college or admission office?',
      a: 'MediCaps University Contact Information:\n\n🏛️ Address: AB Road, Pigdamber, Rau, Indore – 453331, Madhya Pradesh\n📞 Phone: +91-731-4259500, +91-731-4259501\n✉️ Email: info@medicapsuniversity.ac.in\n🌐 Website: www.medicapsuniversity.ac.in\n\nDepartment Contacts:\n• Admissions: admissions@medicapsuniversity.ac.in\n• Exams: exams@medicapsuniversity.ac.in\n• Placements: placement@medicapsuniversity.ac.in\n• Hostel: hostel@medicapsuniversity.ac.in\n\n⏰ Office Hours: Monday–Saturday, 9:00 AM – 5:00 PM'
    }
  ];
}

/* Admin credentials (hardcoded for demo purposes) */
const ADMIN_CREDS = { username: 'admin', password: 'admin@123' };


/* ═══════════════════════════════════════════════════════════
   2. SESSION MANAGEMENT
═══════════════════════════════════════════════════════════ */

let currentUser   = null;   // currently logged-in student object
let chatMessages  = [];     // conversation history for current session
let isAITyping    = false;  // prevents double-sends while AI is responding

/**
 * Reads the stored session and returns:
 *   'chat'  – valid student session
 *   'admin' – valid admin session
 *   null    – no valid session
 */
function checkSession() {
  const session = DB.get('mc_session');
  if (session && session.type === 'student') {
    const user = DB.getStudents().find(s => s.email === session.email);
    if (user) { currentUser = user; return 'chat'; }
  }
  if (session && session.type === 'admin') return 'admin';
  return null;
}


/* ═══════════════════════════════════════════════════════════
   3. ROUTER
═══════════════════════════════════════════════════════════ */

/**
 * Shows the page with id="page-{name}" and hides all others.
 * @param {string} page  e.g. 'landing', 'login', 'chat', 'admin'
 */
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
}


/* ═══════════════════════════════════════════════════════════
   4. VALIDATION HELPERS
═══════════════════════════════════════════════════════════ */

/** Show a field-level error message */
function showErr(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

/** Hide a field-level error message */
function hideErr(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

/** Basic email format check */
function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Show an alert box above a form */
function showAlert(id, type, message) {
  const el = document.getElementById(id);
  el.className = 'alert-box ' + type + ' show';
  el.textContent = message;
}

/** Hide an alert box */
function hideAlert(id) {
  document.getElementById(id).className = 'alert-box';
}


/* ═══════════════════════════════════════════════════════════
   5. TOAST NOTIFICATION
═══════════════════════════════════════════════════════════ */

/**
 * Display a brief notification at the bottom-right corner.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = 'toast ' + type;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}


/* ═══════════════════════════════════════════════════════════
   6. AUTH — Register / Login / Logout
═══════════════════════════════════════════════════════════ */

/** Handle student registration form submission */
function doRegister() {
  const fname  = document.getElementById('reg-fname').value.trim();
  const lname  = document.getElementById('reg-lname').value.trim();
  const email  = document.getElementById('reg-email').value.trim();
  const course = document.getElementById('reg-course').value;
  const pass   = document.getElementById('reg-pass').value;
  const cpass  = document.getElementById('reg-cpass').value;

  hideAlert('reg-alert');
  ['err-fname','err-lname','err-email','err-course','err-pass','err-cpass'].forEach(hideErr);

  let valid = true;
  if (!fname)                { showErr('err-fname');  valid = false; }
  if (!lname)                { showErr('err-lname');  valid = false; }
  if (!isEmail(email))       { showErr('err-email');  valid = false; }
  if (!course)               { showErr('err-course'); valid = false; }
  if (pass.length < 6)       { showErr('err-pass');   valid = false; }
  if (pass !== cpass)        { showErr('err-cpass');  valid = false; }
  if (!valid) return;

  const students = DB.getStudents();
  if (students.find(s => s.email === email)) {
    showAlert('reg-alert', 'error', 'This email is already registered. Please login instead.');
    return;
  }

  const student = {
    id:           Date.now(),
    fname, lname,
    name:         fname + ' ' + lname,
    email, course, pass,
    registeredAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  students.push(student);
  DB.saveStudents(students);
  DB.set('mc_session', { type: 'student', email });
  currentUser = student;

  showAlert('reg-alert', 'success', 'Account created successfully! Redirecting…');
  setTimeout(() => enterChat(), 800);
}

/** Handle student login form submission */
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;

  hideAlert('login-alert');
  ['err-login-email', 'err-login-pass'].forEach(hideErr);

  let valid = true;
  if (!isEmail(email)) { showErr('err-login-email'); valid = false; }
  if (!pass)           { showErr('err-login-pass');  valid = false; }
  if (!valid) return;

  const user = DB.getStudents().find(s => s.email === email && s.pass === pass);
  if (!user) {
    showAlert('login-alert', 'error', 'Invalid email or password. Please check and try again.');
    return;
  }

  currentUser = user;
  DB.set('mc_session', { type: 'student', email });
  enterChat();
}

/** Transition to the chat page and populate UI with user info */
function enterChat() {
  goTo('chat');
  document.getElementById('student-name').textContent   = currentUser.name;
  document.getElementById('student-course').textContent = currentUser.course;
  document.getElementById('student-av').textContent     = currentUser.name.charAt(0).toUpperCase();
  chatMessages = []; // fresh conversation
}

/** Log out the current student */
function doLogout() {
  DB.set('mc_session', null);
  currentUser  = null;
  chatMessages = [];
  resetWelcomeCard();
  goTo('landing');
}

/** Reset the messages area back to the welcome card */
function resetWelcomeCard() {
  document.getElementById('messages-area').innerHTML = `
    <div class="welcome-card" id="welcome-card">
      <div class="wc-icon">🤖</div>
      <h3>Hello! I'm Your MediCaps AI Guide</h3>
      <p>Ask me anything about MediCaps University — admissions, courses, fees, placements, hostel, faculty, events, and more.</p>
      <div class="quick-questions">
        <button class="qq-btn" onclick="sendQuick('How to apply for admission?')">How to apply?</button>
        <button class="qq-btn" onclick="sendQuick('What is the B.Tech CSE fee?')">B.Tech fees</button>
        <button class="qq-btn" onclick="sendQuick('What companies come for placement?')">Placements</button>
        <button class="qq-btn" onclick="sendQuick('Is hostel available?')">Hostel</button>
      </div>
    </div>`;
}


/* ── Admin Auth ───────────────────────────────────────────── */

/** Handle admin login form submission */
function doAdminLogin() {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;

  hideAlert('admin-login-alert');

  let valid = true;
  const errU = document.getElementById('err-admin-u');
  const errP = document.getElementById('err-admin-p');

  if (!username) { errU.classList.add('show');    valid = false; }
  else             errU.classList.remove('show');
  if (!password) { errP.classList.add('show');    valid = false; }
  else             errP.classList.remove('show');

  if (!valid) return;

  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    DB.set('mc_session', { type: 'admin' });
    goTo('admin');
    initAdminDashboard();
  } else {
    showAlert('admin-login-alert', 'error', 'Invalid admin credentials. Access denied.');
  }
}

/** Log out the admin */
function adminLogout() {
  DB.set('mc_session', null);
  goTo('landing');
}


/* ═══════════════════════════════════════════════════════════
   7. CHAT — AI-Powered Conversation
═══════════════════════════════════════════════════════════ */

/** Send message on Enter key (Shift+Enter = newline) */
function chatKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChat();
  }
}

/** Auto-resize textarea and update character count */
function chatResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  document.getElementById('chat-char').textContent = el.value.length + '/500';
}

/** Pre-fill and send a quick-topic question */
function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  sendChat();
  document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
}

/** Clear the chat and show the welcome card again */
function clearChat() {
  chatMessages = [];
  resetWelcomeCard();
}

/** Main send handler – calls Claude AI API */
async function sendChat() {
  if (isAITyping) return;

  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;

  // Clear input
  input.value = '';
  input.style.height = 'auto';
  document.getElementById('chat-char').textContent = '0/500';

  // Remove welcome card on first message
  const welcomeCard = document.getElementById('welcome-card');
  if (welcomeCard) welcomeCard.remove();

  // Render user message
  appendMsg('user', text);
  chatMessages.push({ role: 'user', content: text });
  saveChatHistory(text, null);

  isAITyping = true;
  const typingId = appendTyping();

  try {
    const faqs      = DB.getFAQs();
    const colInfo   = DB.getCollegeInfo();
    const faqContext = faqs
      .map(f => `Category: ${f.cat}\nQ: ${f.q}\nA: ${f.a}`)
      .join('\n\n---\n\n');

    const systemPrompt = `You are the official AI chatbot for ${colInfo.name}, a premier engineering university in Indore, Madhya Pradesh, India.

COLLEGE INFORMATION:
- Name: ${colInfo.name}
- Phone: ${colInfo.phone}
- Address: ${colInfo.address}
- Email: ${colInfo.email}
- Latest Notice: ${colInfo.notice}

KNOWLEDGE BASE (FAQs):
${faqContext}

INSTRUCTIONS:
- Answer questions ONLY about ${colInfo.name} using the knowledge base above.
- Be friendly, professional, and helpful. Use bullet points and structure for clarity.
- If asked about something not in your knowledge base, politely say you don't have that specific info and suggest contacting the college directly.
- Never answer unrelated topics (politics, entertainment, etc.) — stay focused on college enquiries.
- Format responses clearly with line breaks and structure for readability.
- Greet the student warmly on first message.
- Current student: ${currentUser?.name} (${currentUser?.course})`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     systemPrompt,
        messages:   chatMessages.slice(-10)   // keep last 10 turns in context
      })
    });

    const data  = await response.json();
    const reply = data.content?.[0]?.text
      || "I'm having a bit of trouble connecting right now. Please try again in a moment, or contact the college directly at +91-731-4259500.";

    removeTyping(typingId);
    isAITyping = false;

    appendMsg('bot', reply);
    chatMessages.push({ role: 'assistant', content: reply });
    saveChatHistory(null, reply);

  } catch (error) {
    console.error('AI API error:', error);
    removeTyping(typingId);
    isAITyping = false;

    // Fall back to local FAQ matching
    const fallback = getLocalFallback(text);
    appendMsg('bot', fallback);
    chatMessages.push({ role: 'assistant', content: fallback });
    saveChatHistory(null, fallback);
  }
}

/**
 * Simple keyword-based FAQ fallback (used when API is unavailable).
 * @param {string} text  User's input
 * @returns {string}     Best matching FAQ answer or a contact message
 */
function getLocalFallback(text) {
  const lower = text.toLowerCase();
  for (const faq of DB.getFAQs()) {
    const keywords = faq.q.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (keywords.some(k => lower.includes(k))) return faq.a;
  }
  return 'I\'m unable to connect to the AI service right now. Please try again shortly, or contact MediCaps University directly:\n📞 +91-731-4259500\n✉️ info@medicapsuniversity.ac.in';
}

/**
 * Persist a message to the chat history in localStorage.
 * @param {string|null} userMsg
 * @param {string|null} botMsg
 */
function saveChatHistory(userMsg, botMsg) {
  if (!currentUser) return;

  const chats = DB.getChats();
  const uid   = currentUser.email;
  const time  = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (!chats[uid]) {
    chats[uid] = { user: currentUser.name, course: currentUser.course, messages: [] };
  }
  if (userMsg) chats[uid].messages.push({ role: 'user', text: userMsg, time });
  if (botMsg)  chats[uid].messages.push({ role: 'bot',  text: botMsg,  time });

  chats[uid].lastActive = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  DB.saveChats(chats);
}


/* ── Message Rendering ────────────────────────────────────── */

/** Returns current time as HH:MM */
function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Append a message bubble to the messages area.
 * @param {'user'|'bot'} role
 * @param {string} text  Plain text (may include markdown-lite)
 */
function appendMsg(role, text) {
  const area  = document.getElementById('messages-area');
  const group = document.createElement('div');
  group.className = 'msg-group ' + role;

  const av = document.createElement('div');
  av.className  = 'msg-av ' + role;
  av.textContent = role === 'bot' ? '🤖' : (currentUser?.name?.charAt(0) || 'S');

  const content = document.createElement('div');
  content.className = 'msg-content';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble ' + role;
  bubble.innerHTML = formatMsg(text);

  const time = document.createElement('div');
  time.className  = 'msg-time';
  time.textContent = getTime();

  content.appendChild(bubble);
  content.appendChild(time);
  group.appendChild(av);
  group.appendChild(content);
  area.appendChild(group);
  area.scrollTop = area.scrollHeight;
}

/**
 * Convert plain-text message to safe HTML with basic markdown support.
 * Supports: **bold**, • bullet lists, numbered lists, newlines.
 */
function formatMsg(text) {
  return text
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• (.+)$/gm,    '<li style="margin-left:16px;list-style:disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm,'<li style="margin-left:16px">$1</li>')
    .replace(/\n/g, '<br/>');
}

/** Append an animated typing indicator and return its element ID */
function appendTyping() {
  const area  = document.getElementById('messages-area');
  const id    = 'typing_' + Date.now();

  const group = document.createElement('div');
  group.className = 'msg-group bot';
  group.id = id;

  const av = document.createElement('div');
  av.className  = 'msg-av bot';
  av.textContent = '🤖';

  const content = document.createElement('div');
  content.className = 'msg-content';

  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML =
    '<div class="typing-dot"></div>' +
    '<div class="typing-dot"></div>' +
    '<div class="typing-dot"></div>';

  content.appendChild(indicator);
  group.appendChild(av);
  group.appendChild(content);
  area.appendChild(group);
  area.scrollTop = area.scrollHeight;

  return id;
}

/** Remove a typing indicator by its element ID */
function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}


/* ═══════════════════════════════════════════════════════════
   8. ADMIN DASHBOARD
═══════════════════════════════════════════════════════════ */

/** Tab title/subtitle map */
const TAB_META = {
  overview: { title: 'Dashboard Overview',          sub: 'Welcome back, Administrator' },
  faqs:     { title: 'Manage FAQs & Responses',     sub: 'Add, edit, or delete chatbot knowledge base entries' },
  history:  { title: 'Student Chat History',         sub: 'View all chat sessions from registered students' },
  students: { title: 'Student Account Management',  sub: 'View and manage all registered student accounts' },
  info:     { title: 'College Information',          sub: 'Update college details and announcements' }
};

/**
 * Switch the active admin tab.
 * @param {string} tab  e.g. 'overview', 'faqs', 'history', 'students', 'info'
 */
function adminTab(tab) {
  // Update nav + panel visibility
  document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('nav-' + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');

  // Update topbar text
  document.getElementById('admin-page-title').textContent = TAB_META[tab].title;
  document.getElementById('admin-page-sub').textContent   = TAB_META[tab].sub;

  // Load tab-specific data
  const loaders = {
    overview: renderOverview,
    faqs:     () => renderFAQTable(''),
    history:  () => renderHistoryList(''),
    students: () => renderStudentTable(''),
    info:     loadCollegeInfoForm
  };
  loaders[tab]?.();
}

/** Called once when the admin navigates to the dashboard */
function initAdminDashboard() {
  renderOverview();
  renderFAQTable('');
  loadCollegeInfoForm();
  document.getElementById('faq-count').textContent     = DB.getFAQs().length;
  document.getElementById('student-count').textContent = DB.getStudents().length;
}

/* ── Overview ─────────────────────────────────────────────── */

function renderOverview() {
  const students  = DB.getStudents();
  const chats     = DB.getChats();
  const faqs      = DB.getFAQs();
  const totalMsgs = Object.values(chats).reduce((sum, c) => sum + c.messages.length, 0);

  // Stat cards
  document.getElementById('stat-cards-area').innerHTML = `
    <div class="stat-card">
      <div class="stat-card-icon">👥</div>
      <div class="stat-card-label">Total Students</div>
      <div class="stat-card-num">${students.length}</div>
      <div class="stat-card-sub">↑ Registered users</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon">💬</div>
      <div class="stat-card-label">Total Messages</div>
      <div class="stat-card-num">${totalMsgs}</div>
      <div class="stat-card-sub">↑ Across all sessions</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon">📋</div>
      <div class="stat-card-label">FAQ Entries</div>
      <div class="stat-card-num">${faqs.length}</div>
      <div class="stat-card-sub">Knowledge base items</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon">🗂️</div>
      <div class="stat-card-label">Chat Sessions</div>
      <div class="stat-card-num">${Object.keys(chats).length}</div>
      <div class="stat-card-sub">Unique student sessions</div>
    </div>`;

  // Recent students
  const recentStudentsList = document.getElementById('recent-students-list');
  if (students.length === 0) {
    recentStudentsList.innerHTML =
      '<div style="padding:20px;font-size:13px;color:var(--text3);text-align:center">No students registered yet.</div>';
  } else {
    recentStudentsList.innerHTML = students.slice(-5).reverse().map(s => `
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
        <div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--sky),var(--blue2));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:white;flex-shrink:0">
          ${s.name.charAt(0)}
        </div>
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--navy)">${s.name}</div>
          <div style="font-size:11.5px;color:var(--text3)">${s.email}</div>
        </div>
        <div class="badge badge-blue" style="margin-left:auto">${s.registeredAt}</div>
      </div>`).join('');
  }

  // Recent chat activity
  const recentChatsList = document.getElementById('recent-chats-list');
  const chatEntries = Object.entries(chats);
  if (chatEntries.length === 0) {
    recentChatsList.innerHTML =
      '<div style="padding:20px;font-size:13px;color:var(--text3);text-align:center">No chats yet.</div>';
  } else {
    recentChatsList.innerHTML = chatEntries.slice(-5).reverse().map(([email, c]) => `
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer" onclick="viewChat('${email}')">
        <div style="font-size:13px;font-weight:600;color:var(--navy)">${c.user}</div>
        <div style="font-size:11.5px;color:var(--text3)">${c.messages.length} messages · ${c.lastActive || ''}</div>
      </div>`).join('');
  }
}


/* ── FAQ Management ───────────────────────────────────────── */

/**
 * Render the FAQ table with an optional text filter.
 * @param {string} filter  Case-insensitive keyword to filter rows
 */
function renderFAQTable(filter) {
  const allFaqs = DB.getFAQs();
  const faqs    = filter
    ? allFaqs.filter(f =>
        f.q.toLowerCase().includes(filter.toLowerCase()) ||
        f.cat.toLowerCase().includes(filter.toLowerCase()))
    : allFaqs;

  document.getElementById('faq-count').textContent = allFaqs.length;

  const tbody = document.getElementById('faq-table-body');
  if (faqs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:24px">No FAQs found.</td></tr>';
    return;
  }

  tbody.innerHTML = faqs.map(f => `
    <tr>
      <td><span class="badge badge-blue">${f.cat}</span></td>
      <td style="font-weight:500;max-width:200px">${f.q}</td>
      <td style="color:var(--text2);max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${f.a.substring(0, 80)}…
      </td>
      <td>
        <div class="action-btns">
          <button class="act-btn act-edit" onclick="editFAQ(${f.id})">✏️ Edit</button>
          <button class="act-btn act-delete" onclick="deleteFAQ(${f.id})">🗑 Del</button>
        </div>
      </td>
    </tr>`).join('');
}

/** Save new FAQ or update existing one */
function saveFAQ() {
  const cat    = document.getElementById('faq-cat').value;
  const q      = document.getElementById('faq-q').value.trim();
  const a      = document.getElementById('faq-a').value.trim();
  const editId = document.getElementById('editing-faq-id').value;

  if (!q || !a) {
    showToast('Please fill in both question and answer.', 'error');
    return;
  }

  let faqs = DB.getFAQs();
  if (editId) {
    faqs = faqs.map(f => f.id == editId ? { ...f, cat, q, a } : f);
    showToast('FAQ updated successfully!');
  } else {
    faqs.push({ id: Date.now(), cat, q, a });
    showToast('FAQ added to knowledge base!');
  }

  DB.saveFAQs(faqs);
  renderFAQTable('');
  cancelEditFAQ();
}

/** Populate the FAQ form for editing */
function editFAQ(id) {
  const faq = DB.getFAQs().find(f => f.id === id);
  if (!faq) return;

  document.getElementById('faq-cat').value         = faq.cat;
  document.getElementById('faq-q').value           = faq.q;
  document.getElementById('faq-a').value           = faq.a;
  document.getElementById('editing-faq-id').value  = faq.id;
  document.getElementById('faq-form-title').textContent = '✏️ Edit FAQ';
  document.getElementById('faq-q').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/** Reset the FAQ form to "add new" state */
function cancelEditFAQ() {
  document.getElementById('faq-cat').value          = 'Admissions';
  document.getElementById('faq-q').value            = '';
  document.getElementById('faq-a').value            = '';
  document.getElementById('editing-faq-id').value   = '';
  document.getElementById('faq-form-title').textContent = '➕ Add New FAQ / Response';
}

/** Delete a FAQ by ID */
function deleteFAQ(id) {
  if (!confirm('Delete this FAQ? This cannot be undone.')) return;
  DB.saveFAQs(DB.getFAQs().filter(f => f.id !== id));
  renderFAQTable('');
  showToast('FAQ deleted.', 'error');
}


/* ── Chat History ─────────────────────────────────────────── */

/**
 * Render the list of chat sessions with an optional student-name filter.
 * @param {string} filter
 */
function renderHistoryList(filter) {
  const chats = DB.getChats();
  const list  = document.getElementById('chat-history-list');
  const entries = Object.entries(chats).filter(([, c]) =>
    !filter || c.user.toLowerCase().includes(filter.toLowerCase())
  );

  if (entries.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text3);padding:40px;font-size:13px">No chat history found.</div>';
    return;
  }

  list.innerHTML = entries.map(([email, c]) => `
    <div class="chat-history-item" onclick="viewChat('${email}')">
      <div class="chi-header">
        <div class="chi-user">👤 ${c.user}</div>
        <div class="chi-time">${c.lastActive || ''}</div>
      </div>
      <div class="chi-preview">${c.course || ''}</div>
      <div class="chi-count">${c.messages.length} messages</div>
    </div>`).join('');
}

/**
 * Open a modal showing the full chat history for a student.
 * @param {string} email  Student's email (used as chat session key)
 */
function viewChat(email) {
  const chat = DB.getChats()[email];
  if (!chat) return;

  document.getElementById('modal-title').textContent = `💬 Chat History — ${chat.user}`;
  document.getElementById('modal-body').innerHTML = chat.messages.map(m => `
    <div style="display:flex;gap:8px;margin-bottom:12px;${m.role === 'user' ? 'flex-direction:row-reverse' : ''}">
      <div style="
        width:28px;height:28px;border-radius:8px;flex-shrink:0;
        background:${m.role === 'bot' ? 'var(--navy)' : 'linear-gradient(135deg,var(--sky),var(--blue2))'};
        display:flex;align-items:center;justify-content:center;font-size:13px;color:white">
        ${m.role === 'bot' ? '🤖' : '👤'}
      </div>
      <div style="max-width:75%">
        <div style="
          padding:9px 12px;font-size:13px;line-height:1.6;
          border-radius:${m.role === 'bot' ? '4px 12px 12px 12px' : '12px 4px 12px 12px'};
          background:${m.role === 'bot' ? 'var(--off)' : 'var(--navy)'};
          color:${m.role === 'bot' ? 'var(--text)' : 'white'};
          border:1px solid var(--border)">
          ${m.text.replace(/\n/g, '<br>')}
        </div>
        <div style="font-size:11px;color:var(--text3);margin-top:3px;${m.role === 'user' ? 'text-align:right' : ''}">
          ${m.time || ''}
        </div>
      </div>
    </div>`).join('');

  document.getElementById('chat-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('chat-modal').classList.remove('open');
}


/* ── Student Management ───────────────────────────────────── */

/**
 * Render the students table with an optional filter.
 * @param {string} filter
 */
function renderStudentTable(filter) {
  const allStudents = DB.getStudents();
  const students    = filter
    ? allStudents.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.email.toLowerCase().includes(filter.toLowerCase()))
    : allStudents;

  const chats = DB.getChats();
  document.getElementById('student-count').textContent = allStudents.length;

  const tbody = document.getElementById('student-table-body');
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px">No students registered yet.</td></tr>';
    return;
  }

  tbody.innerHTML = students.map(s => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="
            width:28px;height:28px;border-radius:7px;
            background:linear-gradient(135deg,var(--sky),var(--blue2));
            display:flex;align-items:center;justify-content:center;
            font-size:12px;font-weight:600;color:white;flex-shrink:0">
            ${s.name.charAt(0)}
          </div>
          <span style="font-weight:500">${s.name}</span>
        </div>
      </td>
      <td style="color:var(--text2)">${s.email}</td>
      <td><span class="badge badge-blue" style="font-size:11px">
        ${s.course?.split('–')[0]?.trim() || s.course || 'N/A'}
      </span></td>
      <td style="color:var(--text3);font-size:12px">${s.registeredAt || 'N/A'}</td>
      <td><span class="badge badge-green">${chats[s.email]?.messages?.length || 0} msgs</span></td>
      <td>
        <div class="action-btns">
          <button class="act-btn act-edit" onclick="viewChat('${s.email}')">💬 Chats</button>
          <button class="act-btn act-delete" onclick="deleteStudent('${s.email}')">🗑 Del</button>
        </div>
      </td>
    </tr>`).join('');
}

/** Delete a student account by email */
function deleteStudent(email) {
  if (!confirm('Delete this student account? This cannot be undone.')) return;
  DB.saveStudents(DB.getStudents().filter(s => s.email !== email));
  renderStudentTable('');
  renderOverview();
  showToast('Student deleted.', 'error');
}


/* ── College Info ─────────────────────────────────────────── */

/** Populate the college info form with stored values */
function loadCollegeInfoForm() {
  const info = DB.getCollegeInfo();
  document.getElementById('ci-name').value    = info.name;
  document.getElementById('ci-phone').value   = info.phone;
  document.getElementById('ci-address').value = info.address;
  document.getElementById('ci-email').value   = info.email;
  document.getElementById('ci-notice').value  = info.notice;
  renderCollegeInfoDisplay(info);
}

/** Read form values, save, and refresh the display */
function saveCollegeInfo() {
  const info = {
    name:    document.getElementById('ci-name').value.trim(),
    phone:   document.getElementById('ci-phone').value.trim(),
    address: document.getElementById('ci-address').value.trim(),
    email:   document.getElementById('ci-email').value.trim(),
    notice:  document.getElementById('ci-notice').value.trim()
  };
  DB.saveCollegeInfo(info);
  renderCollegeInfoDisplay(info);
  showToast('College info saved successfully!');
}

/**
 * Render the "current info" card below the edit form.
 * @param {object} info
 */
function renderCollegeInfoDisplay(info) {
  document.getElementById('college-info-display').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div><strong style="color:var(--navy)">Name:</strong> ${info.name}</div>
      <div><strong style="color:var(--navy)">Phone:</strong> ${info.phone}</div>
      <div><strong style="color:var(--navy)">Email:</strong> ${info.email}</div>
      <div style="grid-column:span 1"><strong style="color:var(--navy)">Address:</strong> ${info.address}</div>
    </div>
    <div style="margin-top:12px;padding:12px;background:var(--gold-light);border-radius:var(--radius-sm);border-left:3px solid var(--gold)">
      <strong style="color:var(--navy);font-size:12px">📢 NOTICE:</strong><br/>${info.notice}
    </div>`;
}


/* ═══════════════════════════════════════════════════════════
   9. INIT — App Bootstrap
═══════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
  // Secret admin route via URL query string or hash
  if (location.search.includes('admin') || location.hash === '#admin-login') {
    goTo('admin-login');
    return;
  }

  const session = checkSession();
  if (session === 'chat' && currentUser) {
    enterChat();
  } else if (session === 'admin') {
    goTo('admin');
    initAdminDashboard();
  } else {
    goTo('landing');
  }
});

// Keyboard shortcut: Ctrl + Shift + A  →  Admin login
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') goTo('admin-login');
});

// Close modal when clicking the overlay background
document.getElementById('chat-modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});
