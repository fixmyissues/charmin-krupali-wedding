// Builds the printable invitation cards as multi-page A4 PDFs, in the look of the printed kankotri:
// parchment, red roses, gold frame, lanterns, and the icons cut from the printed card (pdf/art/*.png).
//
// Usage: node pdf/make-cards.mjs "<path to Chrome binary>" <out dir> [preview dir]
// Needs Node 23.6+ (reads app/content.ts directly, global WebSocket and fetch). No npm packages.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { gu, en } = await import(pathToFileURL(path.join(here, '../app/content.ts')).href);
const [exe, outDir, previewDir] = process.argv.slice(2);
const art = (n) => pathToFileURL(path.join(here, 'art', n + '.png')).href;
const img = (n, cls = '') => `<img class="${cls}" src="${art(n)}" alt="">`;

// ---------- text that is only on the printed cards (names and long lines were read from the cards) ----------
const PHONES = ['9909145335', '7069996588', '9016184664', '9925362343'];
const RECEPTION_PHONES = ['9909145335', '7069996588', '9925362343'];
const SHLOKA = ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'];

const TXT = {
  gu: {
    t: gu, dateLabel: 'લગ્ન તારીખ', recLabel: 'સત્કાર સમારંભ', weds: 'ના શુભ લગ્ન', dear: 'સ્નેહી શ્રી,', dearEnd: 'આપશ્રી/આપ બંને/સહ પરિવાર', dearL: 'સ્નેહી સ્વજન શ્રી,',
    gods: ['॥ શ્રી ગણેશાય નમઃ ॥', '॥ શ્રી મહાકાળી માતાય નમઃ ॥', '॥ શ્રી ઉમિયા માતાય નમઃ ॥'],
    intro: 'ઉરના આંગણિયે ઉમંગના ઉત્સવ ઉજવાય છે. અમારા પરિવારના માંડવે અવસરના તોરણ બંધાય છે.',
    venueBar: 'લગ્ન સ્થળ : કોલવડા હાઈસ્કૂલ પટાંગણ, કોલવડા, તા. વિજાપુર',
    eventNote: { 2: 'સ્થળ : ઉમિયા વાડી, રામપુરા (કાંસા)', 4: 'રામપુરાથી નીકળી કોલવડા જશે.' },
    evTime: (e) => { const [d, tm] = e.time.split(' · '); return [`તા. ${d.replace(/^.*?, /, '')}, ${d.split(',')[0]}`, tm.replace(/(સવારે|બપોરે|સાંજે) (.*)/, '$1 $2 કલાકે.')]; },
    mamera: ['॥ મામેરૂ શોભાવશે ॥', 'કંથરાવી નિવાસી'], darshan: '॥ દર્શનાભિલાષી ॥', poemTitle: ':: મીઠો કલરવ ::',
    mameraList: [['પટેલ અમૃતલાલ વિઠ્ઠલદાસ', 'પટેલ બાબુલાલ વિઠ્ઠલદાસ', 'પટેલ મનીષકુમાર અમૃતલાલ', 'પટેલ સંદિપકુમાર બાબુલાલ', 'પટેલ ગૌરવકુમાર બાબુલાલ'], ['પટેલ સુભદ્રાબેન અમૃતલાલ', 'પટેલ શોભનાબેન બાબુલાલ', 'પટેલ ધર્મિષ્ઠાબેન મનીષકુમાર', 'પટેલ કેતનાબેન સંદિપકુમાર', 'પટેલ સ્નેહાબેન ગૌરવકુમાર']],
    darshanList: [['પટેલ જેસલ ગણપતભાઈ', 'પટેલ દેવ ગણપતભાઈ', 'પટેલ માધવી વિક્રમભાઈ', 'પટેલ પ્રેરણા વિક્રમભાઈ', 'પટેલ વીર વિક્રમભાઈ'], ['પટેલ યોગેશભાઈ વસંતભાઈ', 'પટેલ ધવલભાઈ રમેશભાઈ', 'પટેલ આશીષ અશ્વિનભાઈ', 'પટેલ વીર ધવલભાઈ', 'પટેલ પલકબેન ધવલભાઈ', 'પટેલ મોનિકાબેન આશિષભાઈ']],
    poem: ['ઘર અમારૂ મંદિર, સંસ્કાર અમારી શોભા, મૌન અમારી ભાષા,', 'પ્રેમ અમારી પરિભાષા, શાનમાં કહીએ કે કાનમાં,', 'ના ના કહેવાદોને જાહેરમાં...પરણે છે અમારા કાકાના લગ્નમાં જરૂર જરૂરથી પધારશો...'], poemBy: '- દિત્યા, વૃતિ, રીયાંશી...',
    mangalGods: ['॥ શ્રી ગણેશાય નમઃ ॥', 'રિદ્ધિ–સિદ્ધિ સહિત પધારજો, ગૌરીનંદન ગણેશ ।<br>સહકુટુંબ સહિત પધારજો, બ્રહ્મા, વિષ્ણુ, મહેશ ॥', '॥ શ્રી ઉમિયા માતાય નમઃ ॥'], mangalTitle: '॥ લગ્ન માંગલ્ય ॥',
    p1: 'સહર્ષ ખુશાલી સાથે જણાવવાનું કે શ્રી ઉમિયા માતાજીની અસીમ કૃપાથી<br><b>રામપુરા(કાંસા) નિવાસી (હાલ-સુરત)</b><br><b>અ.સૌ. અલ્પાબેન તથા શ્રી કમલેશભાઈ ચતુરભાઈ પટેલ (શાખે-વિસનગરા) ના સુપુત્ર</b>',
    p2: '<b>કોલવડા નિવાસી અ.સૌ. ભગવતીબેન તથા શ્રી નરેશકુમાર બળદેવદાસ પટેલ (શાખે-શેઠીયા) ની સુપુત્રી</b>',
    p3: 'સાથે સંવત ૨૦૮૩ ના કારતક વદ-૧૩ ને રવિવાર તા. ૦૬-૧૨-૨૦૨૬ ના રોજ શુભ લગ્ન નિરધાર્યા છે, તો પ્રભુતામાં પગલાં માંડી રહેલ મંગલમયી યુગલને આ શુભ અવસરે આશીર્વાદ આપવા પધારી શોભામાં અભિવૃધ્ધિ કરશોજી.',
    divya: '॥ દિવ્ય આશિષ ॥', divyaL: ['શ્રી ચતુરભાઈ દ્વારકાદાસ પટેલ', 'સ્વ. ઈશ્વરભાઈ દ્વારકાદાસ પટેલ'], divyaR: ['સ્વ. ડાહીબેન ચતુરભાઈ પટેલ', 'ગં.સ્વ. શારદાબેન ઈશ્વરભાઈ પટેલ'],
    sneh: '॥ સ્નેહાધિન ॥',
    snehList: [['શ્રી ગણપતભાઈ ચતુરભાઈ પટેલ', 'શ્રી વિક્રમભાઈ ઈશ્વરદાસ પટેલ', 'શ્રી વસંતભાઈ હરગોવનદાસ પટેલ', 'સ્વ. રમેશભાઈ હરગોવનદાસ પટેલ', 'શ્રી અશ્વિનભાઈ હરગોવનદાસ પટેલ'], ['અ.સૌ. આરતીબેન ગણપતભાઈ પટેલ', 'અ.સૌ. અલ્કાબેન વિક્રમભાઈ પટેલ', 'અ.સૌ. ગીતાબેન વસંતભાઈ પટેલ', 'ગં.સ્વ. અનુબેન રમેશભાઈ પટેલ', 'અ.સૌ. જશીબેન અશ્વિનભાઈ પટેલ'], ['શ્રી નારાયણભાઈ વિઠ્ઠલદાસ પટેલ', 'શ્રી ગણપતભાઈ મોહનદાસ પટેલ', 'શ્રી સતિષભાઈ વિઠ્ઠલદાસ પટેલ', 'શ્રી વિષ્ણુભાઈ મનોહરદાસ પટેલ', 'શ્રી જીતુભાઈ નરોત્તમદાસ પટેલ']],
    snehKids: 'જેસલ, દેવ, માધવી, પ્રેરણા, વીર',
    shubh: ':: શુભ સ્થળ ::', firm: '॥ ફર્મ ॥', firms: ['ગાયત્રી ટ્રેડિંગ, સુરત', 'મહાકાળી એન્જીનિયરીંગ, સુરત', 'એગ્રી બિજનેશ સેન્ટર(ABC), ઓલપાડ'],
    recTitle: '॥ સત્કાર સમારંભ ॥', bhojan: '॥ ભોજન સમારંભ ॥', recWhen: 'તા. ૧૨–૧૨–૨૦૨૬, શનિવાર સાંજે ૬–૩૦ કલાકે', sthal: 'સ્થળ : ',
    digits: gu.digits,
  },
  en: {
    t: en, dateLabel: 'Wedding date', recLabel: 'Satkar Samarambh', weds: 'together in marriage', dear: 'Dear Shri,', dearEnd: 'You / both of you / with family', dearL: 'Dear Shri,',
    gods: ['॥ Shri Ganeshaya Namah ॥', '॥ Shri Mahakali Mataye Namah ॥', '॥ Shri Umiya Mataye Namah ॥'],
    intro: 'Festivals of joy are celebrated in our courtyard, and the toran of celebration is tied at our family’s mandap.',
    venueBar: 'Wedding venue: Kolvada High School Ground, Kolvada, Taluka Vijapur',
    eventNote: { 2: 'Venue: Umiya Wadi, Ramapura (Kansa)', 4: 'From Ramapura towards Kolvada.' },
    evTime: (e) => { const [d, tm] = e.time.split(' · '); return [`${d.split(', ')[0]}, ${d.split(', ')[1]}`, tm]; },
    mamera: ['॥ Mameru brought by ॥', 'Residents of Kanthravi'], darshan: '॥ Darshanabhilashi ॥', poemTitle: ':: Sweet Chatter ::',
    mameraList: [['Patel Amrutlal Vitthaldas', 'Patel Babulal Vitthaldas', 'Patel Manishkumar Amrutlal', 'Patel Sandipkumar Babulal', 'Patel Gauravkumar Babulal'], ['Patel Subhadraben Amrutlal', 'Patel Shobhanaben Babulal', 'Patel Dharmishthaben Manishkumar', 'Patel Ketnaben Sandipkumar', 'Patel Snehaben Gauravkumar']],
    darshanList: [['Patel Jesal Ganpatbhai', 'Patel Dev Ganpatbhai', 'Patel Madhavi Vikrambhai', 'Patel Prerna Vikrambhai', 'Patel Veer Vikrambhai'], ['Patel Yogeshbhai Vasantbhai', 'Patel Dhavalbhai Rameshbhai', 'Patel Ashish Ashwinbhai', 'Patel Veer Dhavalbhai', 'Patel Palakben Dhavalbhai', 'Patel Monikaben Ashishbhai']],
    poem: ['Home is our temple, values are our pride, silence is our language,', 'love is our definition. Whisper it in the ear, never announce it in public...', 'Our uncle is getting married, do come, without fail...'], poemBy: '- Dityaa, Vruti, Riyanshi...',
    mangalGods: ['॥ Shri Ganeshaya Namah ॥', 'Come with Riddhi-Siddhi, O Gauri-nandan Ganesh.<br>Come with your family, O Brahma, Vishnu, Mahesh.', '॥ Shri Umiya Mataye Namah ॥'], mangalTitle: '॥ Lagna Mangalya ॥',
    p1: 'By the boundless grace of Shri Umiya Mataji,<br><b>Smt. Alpaben and Shri Kamleshbhai Chaturbhai Patel (Shakhe-Visnagara)<br>of Ramapura (Kansa), now of Surat,</b><br>joyfully announce the wedding of their son',
    p2: 'with the daughter of <b>Smt. Bhagvatiben and Shri Nareshkumar Baldevdas Patel (Shakhe-Sethiya) of Kolvada.</b>',
    p3: 'Their wedding is fixed for Sunday, Kartak Vad 13, Samvat 2083, 06-12-2026. Please come to bless the couple as they take their first steps into married life, and add to our joy.',
    divya: '॥ Divine Blessings ॥', divyaL: ['Shri Chaturbhai Dwarkadas Patel', 'Late Ishwarbhai Dwarkadas Patel'], divyaR: ['Late Dahiben Chaturbhai Patel', 'Late Smt. Sharadaben Ishwarbhai Patel'],
    sneh: '॥ Snehadhin (with love) ॥',
    snehList: [['Shri Ganpatbhai Chaturbhai Patel', 'Shri Vikrambhai Ishwardas Patel', 'Shri Vasantbhai Hargovandas Patel', 'Late Rameshbhai Hargovandas Patel', 'Shri Ashwinbhai Hargovandas Patel'], ['Smt. Aartiben Ganpatbhai Patel', 'Smt. Alkaben Vikrambhai Patel', 'Smt. Gitaben Vasantbhai Patel', 'Late Smt. Anuben Rameshbhai Patel', 'Smt. Jashiben Ashwinbhai Patel'], ['Shri Narayanbhai Vitthaldas Patel', 'Shri Ganpatbhai Mohandas Patel', 'Shri Satishbhai Vitthaldas Patel', 'Shri Vishnubhai Manohardas Patel', 'Shri Jitubhai Narottamdas Patel']],
    snehKids: 'Jesal, Dev, Madhavi, Prerna, Veer',
    shubh: ':: Shubh Sthal ::', firm: '॥ Firms ॥', firms: ['Gayatri Trading, Surat', 'Mahakali Engineering, Surat', 'Agri Business Center (ABC), Olpad'],
    recTitle: '॥ Satkar Samarambh ॥', bhojan: '॥ Bhojan Samarambh (Dinner) ॥', recWhen: 'Saturday, 12-12-2026, 6:30 PM', sthal: 'Venue: ',
    digits: en.digits,
  },
};

// ---------- art drawn in code: roses, leaves, lanterns, gold flourishes ----------
const rose = (x, y, r, c = ['#B3162A', '#D42A45', '#8E0F20']) =>
  `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${c[2]}"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse cy="${-r * 0.52}" rx="${r * 0.46}" ry="${r * 0.55}" fill="${c[0]}" stroke="${c[2]}" stroke-width="1.2" transform="rotate(${a})"/>`).join('')}<circle r="${r * 0.5}" fill="${c[1]}" stroke="${c[2]}" stroke-width="1.2"/><path d="M0 ${-r * 0.12}a${r * 0.16} ${r * 0.16} 0 1 1 ${r * 0.2} ${r * 0.1}a${r * 0.28} ${r * 0.28} 0 1 1 ${-r * 0.46} ${-r * 0.14}" fill="none" stroke="${c[2]}" stroke-width="1.4" stroke-linecap="round"/></g>`;
const leaf = (x, y, a, s = 1) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0C12-11 34-11 48 0C34 11 12 11 0 0Z" fill="#4A7A3F" stroke="#2F5230"/><path d="M4 0H44" stroke="#2F5230"/></g>`;
const bloom = (x, y, r) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cy="${-r * 0.7}" r="${r * 0.55}" fill="#F7E6CC" stroke="#D9B98C" transform="rotate(${a})"/>`).join('')}<circle r="${r * 0.35}" fill="#E7B84A"/></g>`;
const corner = (cls) => `<svg class="corner ${cls}" viewBox="0 0 260 260">
  ${[[20, 20, 30], [60, 12, 5], [14, 70, 80], [100, 30, 20], [40, 110, 50], [130, 60, 25], [70, 70, 35], [150, 10, 12], [10, 150, 70]].map(([x, y, a], i) => leaf(x + 14, y + 14, a * 1.5 - 10, 0.9 + (i % 3) * 0.15)).join('')}
  ${bloom(150, 70, 12)}${bloom(75, 150, 12)}${bloom(185, 24, 9)}${bloom(26, 190, 9)}
  ${rose(48, 48, 40)}${rose(122, 30, 26, ['#C23A55', '#E0617B', '#8E0F20'])}${rose(30, 128, 26, ['#C23A55', '#E0617B', '#8E0F20'])}${rose(104, 100, 24)}${rose(178, 14, 14, ['#E48AA2', '#F2AFC0', '#B04460'])}${rose(14, 190, 14, ['#E48AA2', '#F2AFC0', '#B04460'])}
</svg>`;
const lantern = (len, cls) => `<svg class="lantern ${cls}" width="44" height="${len + 78}" viewBox="0 0 44 ${len + 78}"><defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#C58E2A"/><stop offset=".5" stop-color="#F8DD8A"/><stop offset="1" stop-color="#B8801F"/></linearGradient></defs><line x1="22" y1="0" x2="22" y2="${len}" stroke="#B8923E" stroke-width="1.4"/><path d="M13 ${len}h18l-3 8H16z" fill="#B8923E"/><path d="M10 ${len + 8}h24l5 36q-17 12-34 0z" fill="url(#lg)" stroke="#9A6E1E"/><ellipse cx="22" cy="${len + 28}" rx="7" ry="11" fill="#FFF1B8" opacity=".85"/><path d="M14 ${len + 52}v18M22 ${len + 54}v22M30 ${len + 52}v18" stroke="#B8923E" stroke-width="1.6"/></svg>`;
const flourish = `<svg width="120" height="20" viewBox="0 0 120 20"><path d="M2 10h40M78 10h40" stroke="#E7CE92" stroke-width="1.2"/><path d="M60 2l8 8-8 8-8-8z" fill="none" stroke="#E7CE92" stroke-width="1.4"/><circle cx="60" cy="10" r="2.4" fill="#E7CE92"/></svg>`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@500&display=swap');
@page{size:794px 1123px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font:15px/1.55 'DM Sans','Noto Sans Gujarati',sans-serif;color:#4A1E12;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:794px;height:1123px;overflow:hidden;page-break-after:always;break-after:page;
  background:radial-gradient(ellipse at 50% 45%,#FDF5E0 0,#F6E6C4 70%,#EBD2A0 100%)}
.pg:before{content:"";position:absolute;inset:20px;border:2px solid #C9A24D;border-radius:14px;z-index:5;pointer-events:none}
.pg:after{content:"";position:absolute;inset:27px;border:1px solid #DDBE72;border-radius:9px;z-index:5;pointer-events:none}
.corner{position:absolute;width:176px;height:176px;z-index:4}
.corner.tl{left:8px;top:8px}.corner.tr{right:8px;top:8px;transform:scaleX(-1)}
.corner.bl{left:8px;bottom:50px;width:140px;height:140px;transform:scaleY(-1)}.corner.br{right:8px;bottom:50px;width:140px;height:140px;transform:scale(-1,-1)}
.lantern{position:absolute;z-index:6}
.band{position:absolute;left:22px;right:22px;bottom:22px;height:62px;z-index:3;background:#8C1007 repeating-linear-gradient(135deg,rgba(231,206,146,.2) 0 2px,transparent 2px 13px);border-top:3px double #E7CE92;border-radius:46px 46px 12px 12px/26px 26px 12px 12px;display:grid;place-items:center}
.in{position:absolute;left:62px;right:62px;top:58px;bottom:104px;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center}
.red{color:#8C1007}.gold{color:#B58A2E}
.ink{height:auto}
.god{white-space:nowrap;font:600 12.5px 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007}
.shloka{font:500 14px/1.7 'Noto Serif Devanagari',serif;color:#8C1007}
.name{font:700 46px/1.15 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007}
.pill{display:inline-block;border:2px solid #8C1007;border-radius:14px;padding:5px 26px;font:700 19px 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;background:rgba(255,251,242,.6)}
.label{display:inline-block;background:#8C1007;color:#FFF6E9;font:700 15px 'DM Sans','Noto Sans Gujarati',sans-serif;padding:3px 34px;letter-spacing:.02em}
.lbl{display:inline-block;border:2px solid #8C1007;border-radius:14px;padding:2px 22px;font:700 14px 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;background:rgba(255,251,242,.6)}
.dear{min-height:104px;width:100%;border:2px solid #8C1007;border-radius:14px 34px 14px 34px;padding:12px 18px 12px 18px;text-align:left;background:rgba(255,251,242,.5);position:relative}
.dear .ln{display:flex;align-items:flex-end;gap:8px;height:26px;font-weight:700;color:#8C1007}
.dear .ln i{flex:1;border-bottom:2px solid #8C1007;height:14px;position:relative}
.dear .ln i:after{content:"";position:absolute;right:-2px;bottom:-5px;border-left:9px solid #8C1007;border-top:5px solid transparent;border-bottom:5px solid transparent}
.dear img{position:absolute;left:16px;bottom:10px;height:52px}.dear .ln2{margin:18px 0 0 60px}
.padx{padding:0 40px;width:100%}.gh{height:126px}.sv{width:128px}.hosts{display:grid;grid-template-columns:1fr 1fr;gap:4px 26px;font:700 14px/1.45 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;align-items:start}
.hosts div{text-align:center;white-space:nowrap}
.addr{font:italic 600 13.5px/1.55 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007}
.row{display:flex;align-items:center;justify-content:center;gap:14px;width:100%}
.gods{display:flex;justify-content:space-between;width:100%;padding:0 130px}.hdr{display:grid;grid-template-columns:1fr 1.5fr 1fr;gap:8px;align-items:start;width:100%}
.hdr .god{padding-top:4px}.hdr .mid{font:500 12.5px/1.6 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007}
.title{font:700 25px 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007}
.txt{font:italic 500 13.5px/1.6 'DM Sans','Noto Sans Gujarati',sans-serif;color:#7A1A10}
.txt b{font-style:normal;font-weight:700;color:#8C1007}
.nrow{display:flex;align-items:center;justify-content:center;gap:12px}
.nrow img.fo{height:62px}
.nm2{font:700 30px 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007}
.cols{display:grid;gap:2px 16px;font:600 11.5px/1.5 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;text-align:left;white-space:nowrap}
.cols.c2{grid-template-columns:1fr 1fr}.cols.c3{grid-template-columns:1fr 1fr 1fr}
.evgrid{display:grid;grid-template-columns:repeat(3,1fr);width:100%;row-gap:16px}
.ev{padding:2px 10px;border-left:1.5px solid #C9A24D}.ev:nth-child(3n+1){border-left:0}
.ev h4{font:700 13px/1.35 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;margin-bottom:5px}
.ev p{font:italic 500 13px/1.5 'DM Sans','Noto Sans Gujarati',sans-serif;color:#7A1A10}
.bar{border:2px solid #8C1007;border-radius:14px;padding:5px 18px;font:700 14px 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;background:rgba(255,251,242,.6)}
.box{width:100%;border:2px solid #8C1007;border-radius:34px 34px 34px 34px;padding:12px 24px;background:rgba(255,251,242,.5)}
.box .h{font:700 15px 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;margin-top:-26px;background:#F6E6C4;display:inline-block;padding:0 14px;border-radius:8px}
.box p{font:italic 700 14.5px/1.6 'DM Sans','Noto Sans Gujarati',sans-serif;color:#8C1007;margin-top:2px}
.sp{height:6px}
.cut{height:56px}
`;

// ---------- pages ----------
const phones = (L, list) => list.map((n) => L.digits(`${n.slice(0, 5)} ${n.slice(5)}`)).join(', ');
const shell = (inner, lanterns = true, cls = '') => `<section class="pg ${cls}">${corner('tl')}${corner('tr')}${corner('bl')}${corner('br')}${lanterns ? lantern(10, 'l1') + lantern(10, 'l4') : ''}<div class="band">${flourish}</div><div class="in">${inner}</div></section>`;
const lanternCss = `.l1{left:34px;top:172px}.l4{right:34px;top:172px}`;

const hostsBlock = (L, address, tel) => `
  <div class="row"><span class="gold">❖</span><span class="label">${L.t.hosts.title}</span><span class="gold">❖</span></div>
  <div class="row hostrow" style="align-items:flex-start;gap:10px">${img('house', 'ink')}<div class="hosts">${L.t.hosts.families.map((f) => `<div>${f.join('<br>')}</div>`).join('')}</div>${img('house', 'ink')}</div>
  <div class="addr">${address}<br>${L.t.hosts.phone} ${tel}</div>`;
const cutCss = `.row img.ink.cut{height:48px}.hostrow img{height:44px}.hosts+.addr{margin-top:4px}`;

function cover(L, rec) {
  const t = L.t, tel = phones(L, rec ? RECEPTION_PHONES : PHONES);
  const address = rec ? t.reception.address : t.hosts.address;
  const date = rec ? `${t.reception.title} : ${t.reception.heroDate}` : `${L.dateLabel} : ${t.hero.date}`;
  return shell(`
    ${rec ? '<div style="height:44px"></div>' : `<div class="row" style="padding-top:2px">${img('hands', 'ink cut')}<div class="title" style="font-size:22px">${t.footer.welcome}</div>${img('hands', 'ink cut')}</div>`}
    <div class="shloka">${SHLOKA.join('<br>')}</div>
    <div class="row" style="align-items:center;justify-content:space-between;padding:0 6px">
      ${img('ganesh-head', 'ink gh')}
      <div style="flex:1">${rec ? `<div style="margin-bottom:8px">${img('satkar-title', 'ink').replace('class="ink"','class="ink" style="width:290px"')}</div>` : ''}<div class="name">${t.hero.names[0]}</div><div class="gold" style="font:600 14px 'DM Sans','Noto Sans Gujarati';margin:2px 0">${L.weds}</div><div class="name">${t.hero.names[1]}</div></div>
      ${rec ? '<div style="width:128px"></div>' : img('shubh-vivah', 'ink sv')}
    </div>
    <div class="pill">${date}</div>
    <div class="dear"><div class="ln">${L.dear}<i></i></div><div class="ln ln2"><i></i></div>${img('flower')}</div>
    ${img('om-ornament', 'ink')}
    <div class="padx" style="display:flex;flex-direction:column;align-items:center;gap:8px">${hostsBlock(L, address, tel)}</div>
  `);
}
const coverCss = `.pg .in>img.ink{width:360px}`;

function events(L) {
  const t = L.t;
  return shell(`
    <div class="gods"><div class="god">${L.gods[0]}</div><div class="god">${L.gods[2]}</div></div>
    <div class="god" style="margin-top:-8px">${L.gods[1]}</div>
    <div class="txt" style="font-style:normal;max-width:470px">${L.intro}</div>
    <div class="row"><span class="gold">☸</span><div class="title" style="font-size:30px">${t.events.title}</div><span class="gold">☸</span></div>
    <div class="evgrid">${t.events.list.map((e, i) => { const [dd, tm] = L.evTime(e); return `<div class="ev"><h4>॥ ${e.title} ॥</h4><p>${dd}<br>${tm}${L.eventNote[i] ? `<br><b>${L.eventNote[i]}</b>` : ''}</p></div>`; }).join('')}</div>
    <div class="bar">${L.venueBar}</div>
    <div class="row" style="align-items:flex-start;gap:30px;width:100%">
      <div><span class="lbl">${L.mamera[0]}</span><div class="txt" style="margin:4px 0 4px">${L.mamera[1]}</div><div class="cols c2">${L.mameraList.map((c) => `<div>${c.join('<br>')}</div>`).join('')}</div></div>
      <div><span class="lbl">${L.darshan}</span><div class="cols c2" style="margin-top:8px">${L.darshanList.map((c) => `<div>${c.join('<br>')}</div>`).join('')}</div></div>
    </div>
    <div><span class="lbl">${L.poemTitle}</span><div class="txt" style="margin-top:6px">${L.poem.join('<br>')}<br><b>${L.poemBy}</b></div></div>
  `);
}

function invitation(L, rec) {
  const t = L.t, tel = phones(L, rec ? RECEPTION_PHONES : PHONES);
  const address = rec ? t.reception.address : t.hosts.address;
  const kids = rec ? `<div class="cols" style="justify-content:center;margin-top:2px"><div style="grid-column:1/-1;text-align:center">${L.snehKids}</div></div>` : '';
  const box = rec
    ? `<div class="box"><span class="h">${L.bhojan}</span><p>${L.recWhen}<br>${L.sthal}${t.reception.place.name}, ${t.reception.place.place}</p></div>`
    : `<div class="row">${img('divya', 'ink')}<span class="lbl">${L.divya}</span></div>
       <div class="row" style="gap:22px"><div class="txt" style="text-align:right"><b>${L.divyaL.join('<br>')}</b></div>${img('divya', 'ink')}<div class="txt" style="text-align:left"><b>${L.divyaR.join('<br>')}</b></div></div>`;
  return shell(`
    <div class="gods"><div class="god">${rec ? L.gods[0] : L.mangalGods[0]}</div><div class="god">${rec ? L.gods[2] : L.mangalGods[2]}</div></div>
    <div class="${rec ? 'shloka' : 'txt'}" style="font-style:normal">${rec ? SHLOKA.join('<br>') : L.mangalGods[1]}</div>
    <div class="title">${rec ? L.recTitle : L.mangalTitle}</div>
    <div class="dear" style="border:0;padding:0;background:none;border-radius:0"><div class="ln">${L.dearL}<i></i></div><div class="txt" style="text-align:right;font-size:11px">${L.dearEnd}</div></div>
    <div class="txt">${L.p1}</div>
    <div class="nrow">${img('groom-folk', 'fo')}<div class="nm2">${t.hero.names[0]}</div>${img('couple-orn', 'fo')}<div class="nm2">${t.hero.names[1]}</div>${img('bride-folk', 'fo')}</div>
    <div class="txt">${L.p2}</div>
    <div class="txt">${rec ? t.reception.blessing : L.p3}</div>
    ${box}
    <div><span class="lbl">${L.sneh}</span><div class="cols c3" style="margin-top:8px">${L.snehList.map((c) => `<div>${c.join('<br>')}</div>`).join('')}</div>${kids}</div>
    <div class="row padx" style="align-items:flex-end;justify-content:space-between;padding:0 28px">
      <div style="flex:1.3;text-align:center">
        <div class="row" style="margin-bottom:4px">${img('house', 'ink')}<span class="lbl">${rec ? t.hosts.title : L.shubh}</span></div>
        <div class="hosts" style="font-size:12px;gap:4px 12px">${t.hosts.families.map((f) => `<div>${f.join('<br>')}</div>`).join('')}</div>
        <div class="addr" style="font-size:11.5px">${address}<br>${t.hosts.phone} ${tel}</div>
      </div>
      <div style="flex:.8;text-align:left;padding-left:10px"><span class="lbl">${L.firm}</span><div class="cols" style="margin-top:6px;font-size:11px">${L.firms.map((f) => `<div>● ${f}</div>`).join('')}</div></div>
    </div>
  `, false, 'inv');
}
const invCss = `.pg .in .nrow img.fo{height:60px}.pg.inv .in .row img.ink{max-height:42px}`;

const pagesFor = (L, mode) => mode === 'wedding' ? [cover(L, false), events(L), invitation(L, false)]
  : mode === 'full' ? [cover(L, false), events(L), invitation(L, false), invitation(L, true)]
  : [cover(L, true), invitation(L, true)];
const doc = (pages) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}${lanternCss}${cutCss}${coverCss}${invCss}</style></head><body>${pages.join('')}</body></html>`;

const JOBS = [
  ['gu', 'wedding', 'Charmin-Krupali-Kankotri-Gujarati.pdf'], ['en', 'wedding', 'Charmin-Krupali-Invitation-English.pdf'],
  ['gu', 'full', 'Charmin-Krupali-Kankotri-Gujarati-Wedding-and-Reception.pdf'], ['en', 'full', 'Charmin-Krupali-Invitation-English-Wedding-and-Reception.pdf'],
  ['gu', 'reception', 'Charmin-Krupali-Kankotri-Gujarati-Reception-Only.pdf'], ['en', 'reception', 'Charmin-Krupali-Invitation-English-Reception-Only.pdf'],
];

// ---------- drive Chrome over the DevTools protocol ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cards-chrome-'));
const chrome = spawn(exe, ['--headless=new', '--remote-debugging-port=9445', `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let tab;
for (let i = 0; i < 40 && !tab; i++) { await sleep(250); try { tab = await (await fetch('http://localhost:9445/json/new?about:blank', { method: 'PUT' })).json(); } catch {} }
if (!tab) { chrome.kill(); throw new Error('Chrome did not start'); }
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); const p = pending.get(d.id); if (p) { pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); } };
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cards-html-'));

for (const [lang, mode, file] of JOBS) {
  const pages = pagesFor(TXT[lang], mode);
  const html = path.join(tmp, `${lang}-${mode}.html`);
  fs.writeFileSync(html, doc(pages));
  await send('Page.navigate', { url: pathToFileURL(html).href });
  await sleep(3500); // web fonts and images load
  await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(()=>1)', awaitPromise: true });
  const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
  fs.writeFileSync(path.join(outDir, file), Buffer.from(pdf.data, 'base64'));
  if (previewDir) for (let i = 0; i < pages.length; i++) {
    const png = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: i * 1123, width: 794, height: 1123, scale: 1 } });
    fs.writeFileSync(path.join(previewDir, `${lang}-${mode}-${i + 1}.png`), Buffer.from(png.data, 'base64'));
  }
  console.log(file, pages.length, 'pages');
}
ws.close(); chrome.kill(); fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 }); fs.rmSync(tmp, { recursive: true, force: true });
