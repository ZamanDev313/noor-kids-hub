/* =========================================================
   Noor Kids Hub — content data
   ========================================================= */

/* ---------- Levels (moon-themed titles) ---------- */
const LEVELS = [
  { level:1, title:"New Crescent",     minXP:0    },
  { level:2, title:"Rising Star",      minXP:80   },
  { level:3, title:"Bright Crescent",  minXP:200  },
  { level:4, title:"Half Moon Hero",   minXP:380  },
  { level:5, title:"Shining Star",     minXP:600  },
  { level:6, title:"Full Moon Scholar",minXP:900  },
  { level:7, title:"Little Hafiz",     minXP:1300 },
  { level:8, title:"Young Da'ee",      minXP:1800 },
  { level:9, title:"Community Star",   minXP:2400 },
  { level:10,title:"Ummah Hero",       minXP:3200 }
];

/* ---------- Badges ---------- */
const BADGES = [
  { id:"first_steps",   icon:"🌙", name:"First Steps",      desc:"Play your very first game" },
  { id:"quiz_wizard",   icon:"🧠", name:"Quiz Wizard",       desc:"Score 8/10 or more in the quiz" },
  { id:"quiz_perfect",  icon:"🏆", name:"Perfect Ten",       desc:"Get a perfect 10/10 quiz score" },
  { id:"arabic_explorer",icon:"🕌", name:"Arabic Explorer",  desc:"Finish the Arabic letters match game" },
  { id:"dua_master",    icon:"🤲", name:"Dua Master",        desc:"Match every dua correctly" },
  { id:"salah_star",    icon:"⭐", name:"Salah Star",        desc:"Put every step of Salah in order" },
  { id:"word_hero",     icon:"🔤", name:"Word Hero",         desc:"Solve 5 word scrambles" },
  { id:"streak_3",      icon:"🔥", name:"3-Day Streak",      desc:"Visit and play 3 days in a row" },
  { id:"streak_7",      icon:"🌟", name:"7-Day Streak",      desc:"Visit and play 7 days in a row" },
  { id:"xp_500",        icon:"💎", name:"500 XP Club",       desc:"Earn 500 total XP" },
  { id:"xp_1500",       icon:"👑", name:"1500 XP Club",      desc:"Earn 1500 total XP" },
  { id:"all_learner",   icon:"📖", name:"Knowledge Seeker",  desc:"Open every lesson tab in Learn" }
];

/* ---------- Quiz questions ---------- */
const QUIZ_QUESTIONS = [
  { q:"How many times a day do Muslims pray Salah?", options:["3","5","7","2"], a:1, cat:"Salah" },
  { q:"What is the holy book of Islam called?", options:["Torah","Injeel","Qur'an","Zabur"], a:2, cat:"Basics" },
  { q:"What is the Islamic month of fasting called?", options:["Shawwal","Ramadan","Muharram","Rajab"], a:1, cat:"Ramadan" },
  { q:"How many Pillars of Islam are there?", options:["4","5","6","3"], a:1, cat:"Pillars" },
  { q:"What does 'Zakat' mean?", options:["Fasting","Pilgrimage","Charity given to the poor","Prayer"], a:2, cat:"Pillars" },
  { q:"What is the pilgrimage to Makkah called?", options:["Hajj","Umrah only","Sawm","Iftar"], a:0, cat:"Pillars" },
  { q:"What do we say before starting to eat?", options:["Alhamdulillah","Bismillah","SubhanAllah","Ameen"], a:1, cat:"Manners" },
  { q:"What is the capital city closest to the Kaaba?", options:["Madinah","Makkah","Cairo","Islamabad"], a:1, cat:"Basics" },
  { q:"What do Muslims say after sneezing... and what should others reply?", options:["Ameen","Alhamdulillah (and others say YarhamukAllah)","SubhanAllah","Wa alaikum"], a:1, cat:"Manners" },
  { q:"Which prayer is offered right after sunset?", options:["Fajr","Zuhr","Maghrib","Asr"], a:2, cat:"Salah" },
  { q:"Which prayer is offered before sunrise?", options:["Fajr","Isha","Asr","Zuhr"], a:0, cat:"Salah" },
  { q:"What is the greeting Muslims say to each other?", options:["Good morning","Assalamu Alaikum","Shukriya","Namaste"], a:1, cat:"Manners" },
  { q:"What is Pakistan's national language, spoken by most Pakistani Muslim families?", options:["Arabic","Urdu","Persian","Turkish"], a:1, cat:"Pakistan" },
  { q:"On which day of the week do Muslims gather for a special congregational prayer?", options:["Sunday","Friday (Jumu'ah)","Monday","Saturday"], a:1, cat:"Basics" },
  { q:"What are the two main Eid festivals called?", options:["Eid ul-Fitr & Eid ul-Adha","Eid ul-Noor & Eid ul-Iman","Eid Milad & Eid Ramadan","Eid Kabir & Eid Sagheer only"], a:0, cat:"Ramadan" },
  { q:"What does 'Wudu' mean?", options:["A type of prayer","Ritual washing before prayer","A holy book","A charity"], a:1, cat:"Salah" },
  { q:"Which angel brought revelation to Prophet Muhammad ﷺ?", options:["Angel Mikael","Angel Jibreel (Gabriel)","Angel Israfil","Angel Malik"], a:1, cat:"Basics" },
  { q:"What is the direction Muslims face during prayer called?", options:["Qiblah","Minbar","Adhan","Sujood"], a:0, cat:"Salah" },
  { q:"What does 'Sabr' mean?", options:["Speed","Patience","Sound","Silence"], a:1, cat:"Manners" },
  { q:"What does 'Jannah' mean?", options:["Fire","Garden/Paradise","Book","Mosque"], a:1, cat:"Basics" }
];

/* ---------- Arabic letters (memory match: letter <-> name) ---------- */
const ARABIC_LETTERS = [
  { ar:"ا", name:"Alif" },
  { ar:"ب", name:"Bā" },
  { ar:"ت", name:"Tā" },
  { ar:"ج", name:"Jīm" },
  { ar:"د", name:"Dāl" },
  { ar:"ر", name:"Rā" },
  { ar:"س", name:"Sīn" },
  { ar:"م", name:"Mīm" }
];

/* ---------- Duas (name <-> meaning matching) ---------- */
const DUAS = [
  { name:"Dua Before Eating", translit:"Bismillah", meaning:"In the name of Allah" },
  { name:"Dua After Eating", translit:"Alhamdulillah alladhi at'amana", meaning:"Praise be to Allah who fed us" },
  { name:"Dua Before Sleeping", translit:"Bismika Allahumma amutu wa ahya", meaning:"In Your name, O Allah, I die and I live" },
  { name:"Dua When Waking Up", translit:"Alhamdulillahi alladhi ahyana", meaning:"Praise be to Allah who gave us life after death (sleep)" },
  { name:"Dua Before Leaving Home", translit:"Bismillahi tawakkaltu 'ala Allah", meaning:"In the name of Allah, I place my trust in Allah" },
  { name:"Dua Entering Toilet", translit:"Allahumma inni a'udhu bika", meaning:"O Allah, I seek refuge in You from harm" }
];

/* ---------- Salah steps (ordered) ---------- */
const SALAH_STEPS = [
  "Make Wudu (ritual washing)",
  "Face the Qiblah (direction of the Kaabah)",
  "Make Niyyah (intention) in your heart",
  "Say Takbir 'Allahu Akbar' to begin",
  "Stand and recite Surah Al-Fatihah",
  "Bow down in Ruku",
  "Stand up straight again",
  "Go down into Sujood (prostration)",
  "Sit briefly, then prostrate again",
  "Finish with Salam, turning right and left"
];

/* ---------- Word scramble (Islamic vocabulary) ---------- */
const SCRAMBLE_WORDS = [
  { word:"SALAH", hint:"The daily prayer" },
  { word:"ZAKAT", hint:"Charity for those in need" },
  { word:"QURAN", hint:"The holy book" },
  { word:"IMAN", hint:"Faith / belief" },
  { word:"TAQWA", hint:"God-consciousness" },
  { word:"JANNAH", hint:"Paradise" },
  { word:"RAMADAN", hint:"Month of fasting" },
  { word:"WUDU", hint:"Washing before prayer" },
  { word:"SABR", hint:"Patience" },
  { word:"MASJID", hint:"A mosque" }
];

/* ---------- Learn content ---------- */
const KALIMAS = [
  { name:"Kalima Tayyibah", translit:"Lā ilāha illallāhu Muhammadur Rasūlullāh", meaning:"There is no god but Allah, Muhammad is the Messenger of Allah" },
  { name:"Kalima Shahādah", translit:"Ashhadu al-lā ilāha illallāh, wa ashhadu anna Muhammadan 'abduhū wa rasūluh", meaning:"I bear witness there is no god but Allah, and that Muhammad is His servant and Messenger" }
];

const PILLARS = [
  { name:"Shahādah", meaning:"Declaring faith — believing there is One God and Muhammad ﷺ is His final Messenger." },
  { name:"Salah", meaning:"Praying five times a day, connecting with Allah every day." },
  { name:"Zakat", meaning:"Giving a small share of savings to help people in need." },
  { name:"Sawm", meaning:"Fasting in the month of Ramadan, from dawn to sunset." },
  { name:"Hajj", meaning:"A journey to Makkah once in a lifetime, if a person is able to." }
];

const MANNERS = [
  "Say 'Assalamu Alaikum' when you meet someone.",
  "Say 'Bismillah' before eating and 'Alhamdulillah' after.",
  "Be kind and gentle with parents, teachers, and younger children.",
  "Always tell the truth, even when it's hard.",
  "Help clean up and keep your surroundings tidy.",
  "Share your things and be generous with friends.",
  "Respect elders and greet guests warmly.",
  "Be patient (Sabr) when things don't go your way."
];

const PROPHET_LESSONS = [
  { name:"Prophet Adam (AS)", lesson:"The first human being and prophet, taught by Allah to know the names of things." },
  { name:"Prophet Nuh (AS)", lesson:"Known for his patience, he built a great ark and called his people to worship One God for many years." },
  { name:"Prophet Ibrahim (AS)", lesson:"Known as a friend of Allah, famous for his courage and unwavering trust in Allah." },
  { name:"Prophet Musa (AS)", lesson:"Spoke to Allah directly and led his people out of hardship with great courage." },
  { name:"Prophet Isa (AS)", lesson:"Known for his gentleness, wisdom, and miracles by Allah's permission." },
  { name:"Prophet Muhammad ﷺ", lesson:"The final Messenger, known for honesty, mercy, and kindness to all — even to those who were unkind to him." }
];

const RAMADAN_FACTS = [
  "Ramadan is the 9th month of the Islamic (lunar) calendar.",
  "Muslims fast from dawn (Fajr) until sunset (Maghrib) — no food or drink.",
  "The meal before dawn is called Suhoor, and breaking the fast is called Iftar.",
  "Ramadan ends with the celebration of Eid ul-Fitr.",
  "It's a month for extra prayer, kindness, patience, and giving charity.",
  "Young children, the sick, travelers, and elderly people are not required to fast."
];
