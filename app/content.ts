// Groom's home: shared Google Maps link, and its pin coordinates for the embedded map.
const HOME_LINK = "https://maps.app.goo.gl/6Pxqfg9gvRNSadeR8";
const HOME_QUERY = "23.7295449,72.5001822";

// All page text per language. Both languages render the same design from app/invitation.tsx.
export const gu = {
  lang: "gu",
  digits: (v: number | string) => String(v).replace(/\d/g, (d) => "૦૧૨૩૪૫૬૭૮૯"[+d]),
  switchTo: { href: "/", label: "English", lang: "en" },
  gate: { label: "કંકુ દબાવી રાખો", seal: "ચા|કૃ", title: "શુભ વિવાહ", hint: "કંકોતરી ખોલવા કંકુ દબાવી રાખો", line: "શુભ લગ્ન નિમંત્રણ", button: "કંકોતરી ખોલો", skip: "છોડો", done: "પધારજો, પરિવાર સાથે" },
  countdown: { kicker: "શુભ લગ્નને", title: "મંડપ સુધી", scratch: "સોનેરી વરખ ઘસો" },
  dock: { rsvp: "જવાબ", events: "પ્રસંગો", music: "સંગીત", share: "શેર" },
  hero: {
    top: "॥ શ્રી ગણેશાય નમઃ ॥ શ્રી ઉમિયા માતાય નમઃ ॥",
    names: ["ચિ. ચાર્મિન", "ચિ. કૃપાલિ"], weds: "ના શુભ લગ્ન", date: "૦૬-૧૨-૨૦૨૬, રવિવાર",
    count: ["દિવસ", "કલાક", "મિનિટ", "સેકન્ડ"],
  },
  seal: {
    title: "તારીખ જાણવા સીલ તોડો", open: ["સીલ", "તોડો"], close: ["સીલ", "બંધ કરો"],
    date: "૦૬ ડિસેમ્બર ૨૦૨૬",
    lines: ["રવિવાર, સંવત ૨૦૮૩ ના કારતક વદ-૧૩", "હસ્ત મેળાપ સવારે ૧૦:૦૦ કલાકે", "કોલવડા હાઈસ્કૂલ પટાંગણ, કોલવડા, તા. વિજાપુર"],
    blessing: "પ્રભુતામાં પગલાં માંડી રહેલ મંગલમયી યુગલને આ શુભ અવસરે આશીર્વાદ આપવા પધારી શોભામાં અભિવૃધ્ધિ કરશોજી.",
  },
  events: {
    title: "માંગલિક પ્રસંગો", prev: "પાછળ", next: "આગળ", prevLabel: "પાછળનું પાનું", nextLabel: "આગળનું પાનું",
    list: [
      { title: "લગ્ન વધાવવાનું મુહૂર્ત", time: "શુક્રવાર, ૦૪-૧૨-૨૦૨૬ · બપોરે ૧:૦૦", note: "" },
      { title: "ગણેશ સ્થાપના / ગ્રહશાંતિ", time: "શનિવાર, ૦૫-૧૨-૨૦૨૬ · સવારે ૮:૦૦", note: "અમારા નિવાસસ્થાને, રામપુરા (કાંસા)" },
      { title: "ભોજન સમારંભ", time: "શનિવાર, ૦૫-૧૨-૨૦૨૬ · સવારે ૧૧:૦૦", note: "ઉમિયા વાડી, રામપુરા (કાંસા)" },
      { title: "હલ્દી રસમ", time: "શનિવાર, ૦૫-૧૨-૨૦૨૬ · બપોરે ૩:૦૦", note: "" },
      { title: "જાન પ્રસ્થાન", time: "રવિવાર, ૦૬-૧૨-૨૦૨૬ · સવારે ૫:૩૦", note: "રામપુરાથી નીકળી કોલવડા જશે" },
      { title: "હસ્ત મેળાપ", time: "રવિવાર, ૦૬-૧૨-૨૦૨૬ · સવારે ૧૦:૦૦", note: "કોલવડા હાઈસ્કૂલ પટાંગણ" },
    ],
    main: 5,
  },
  venue: {
    title: "પ્રસંગ સ્થળ", maps: "Google Maps માં ખોલો", mapTitle: "અમારા નિવાસસ્થાનનો નકશો",
    places: [
      { event: "ગણેશ સ્થાપના / ગ્રહશાંતિ", name: "અમારું નિવાસસ્થાન", place: "મુ. રામપુરા (કાંસા), તા. વિસનગર, જિ. મહેસાણા", query: HOME_QUERY, link: HOME_LINK },
      { event: "ભોજન સમારંભ", name: "ઉમિયા વાડી", place: "રામપુરા (કાંસા)", query: "Umiya+Wadi+Ramapura+Kansa+Visnagar+Gujarat", link: "https://maps.app.goo.gl/M84L3K2vdrCiZjGS9" },
      { event: "હસ્ત મેળાપ (જાન અહીં પહોંચશે)", name: "કોલવડા હાઈસ્કૂલ પટાંગણ", place: "કોલવડા, તા. વિજાપુર", query: "Kolavada+High+School+Kolavada+Vijapur+Gujarat", link: "https://maps.app.goo.gl/myTNobgSidPLHrHk7" },
    ],
  },
  hosts: {
    title: "નિમંત્રક", address: "મુ. રામપુરા (કાંસા), તા. વિસનગર, જિ. મહેસાણા", phone: "મો.",
    families: [["શ્રી ચતુરભાઈ દ્વારકાદાસ પટેલ", "સ્વ. ડાહીબેન ચતુરભાઈ પટેલ"], ["શ્રી કમલેશભાઈ ચતુરભાઈ પટેલ", "અ.સૌ. અલ્પાબેન કમલેશભાઈ પટેલ"]],
  },
  rsvp: {
    title: "આપનો જવાબ", name: "આપનું નામ", contact: "મોબાઇલ અથવા ઇમેઇલ", attending: "આપ પધારશો?", yes: "હા, જરૂર", no: "ના, માફ કરશો",
    guests: "કુલ સભ્યો", message: "સંદેશ", send: "જવાબ મોકલો",
    wa: { head: "ચિ. ચાર્મિન & ચિ. કૃપાલિ ના શુભ લગ્ન માટે જવાબ", name: "નામ", contact: "સંપર્ક", attending: "પધારશો", guests: "કુલ સભ્યો", message: "સંદેશ" },
  },
  // Shown only on /reception pages, for guests invited to the Surat reception.
  reception: {
    title: "સત્કાર સમારંભ", heroDate: "૧૨-૧૨-૨૦૨૬, શનિવાર", date: "૧૨ ડિસેમ્બર ૨૦૨૬",
    lines: ["શનિવાર, સાંજે ૬:૩૦ કલાકે", "શ્રી બાવન બાવીસ કડવા પાટીદાર સમાજની વાડી, અમીઝરા-બમરોલી, સુરત"],
    blessing: "સાથેના લગ્ન પ્રસંગ નિમિત્તે યોજેલ “સત્કાર સમારંભમાં” નવદંપતિને અંતરના આશીર્વાદ આપવા પધારવા ભાવભીનું નિમંત્રણ છે.",
    rsvpHead: "ચિ. ચાર્મિન & ચિ. કૃપાલિ ના સત્કાર સમારંભ માટે જવાબ",
    address: "૪૭, અમીઝરા રેસીડેન્સી, ગોકુલધામ શેરી, બમરોલી રોડ હરિઓમ ઈન્ડ. બાજુમાં વડોદ સુરત.",
    event: { title: "સત્કાર સમારંભ", time: "શનિવાર, ૧૨-૧૨-૨૦૨૬ · સાંજે ૬:૩૦", note: "શ્રી બાવન બાવીસ કડવા પાટીદાર સમાજની વાડી, અમીઝરા-બમરોલી, સુરત" },
    place: { event: "સત્કાર સમારંભ", name: "શ્રી બાવન બાવીસ કડવા પાટીદાર સમાજની વાડી", place: "હરિઓમ ઈન્ડ. સોસાયટી-૩, શ્રી ઉમિયા માતાજી મંદિરની પાછળ, અમીઝરા-બમરોલી, સુરત", query: "Shri+Bavan+Bavis+Kadva+Patidar+Samaj+Wadi+Hariom+Industrial+Society+3+Amijhara+Bamroli+Surat", link: "" },
  },
  footer: { title: "ચિ. ચાર્મિન & ચિ. કૃપાલિ", welcome: "છગનભા પરિવાર આપનું હાર્દિક સ્વાગત કરે છે." },
};

export type Content = typeof gu;

export const en: Content = {
  lang: "en",
  digits: (v) => String(v),
  switchTo: { href: "/gu", label: "ગુજરાતી", lang: "gu" },
  gate: { label: "Press and hold the kanku", seal: "C|K", title: "Shubh Vivah", hint: "Press and hold the kanku to open the kankotri", line: "Shubh lagna nimantran", button: "Open the kankotri", skip: "Skip", done: "Padharo, come as family" },
  countdown: { kicker: "Shubh lagna in", title: "Until the mandap", scratch: "Scratch the gold leaf" },
  dock: { rsvp: "RSVP", events: "Events", music: "Music", share: "Share" },
  hero: {
    top: "॥ Shri Ganeshaya Namah ॥ Shri Umiya Mataye Namah ॥",
    names: ["Charmin", "Krupali"], weds: "together in marriage", date: "Sunday, 06-12-2026",
    count: ["Days", "Hours", "Minutes", "Seconds"],
  },
  seal: {
    title: "Break the seal to reveal the date", open: ["Break", "the seal"], close: ["Close", "the seal"],
    date: "06 December 2026",
    lines: ["Sunday, Kartak Vad 13, Samvat 2083", "Hasta Melap at 10:00 AM", "Kolvada High School Ground, Kolvada, Taluka Vijapur"],
    blessing: "As the couple takes their first steps into married life, please join us and bless them with your presence.",
  },
  events: {
    title: "Wedding Celebrations", prev: "Back", next: "Next", prevLabel: "Previous page", nextLabel: "Next page",
    list: [
      { title: "Lagna Vadhavanu Muhurat", time: "Friday, 04-12-2026 · 1:00 PM", note: "" },
      { title: "Ganesh Sthapana / Grah Shanti", time: "Saturday, 05-12-2026 · 8:00 AM", note: "At our home, Ramapura (Kansa)" },
      { title: "Wedding Feast", time: "Saturday, 05-12-2026 · 11:00 AM", note: "Umiya Wadi, Ramapura (Kansa)" },
      { title: "Haldi Ceremony", time: "Saturday, 05-12-2026 · 3:00 PM", note: "" },
      { title: "Wedding Procession Departure", time: "Sunday, 06-12-2026 · 5:30 AM", note: "From Ramapura towards Kolvada" },
      { title: "Hasta Melap", time: "Sunday, 06-12-2026 · 10:00 AM", note: "Kolvada High School Ground" },
    ],
    main: 5,
  },
  venue: {
    title: "Venues", maps: "Open in Google Maps", mapTitle: "Map to our home",
    places: [
      { event: "Ganesh Sthapana / Grah Shanti", name: "Our home", place: "Ramapura (Kansa), Taluka Visnagar, District Mehsana", query: HOME_QUERY, link: HOME_LINK },
      { event: "Wedding Feast", name: "Umiya Wadi", place: "Ramapura (Kansa)", query: "Umiya+Wadi+Ramapura+Kansa+Visnagar+Gujarat", link: "https://maps.app.goo.gl/M84L3K2vdrCiZjGS9" },
      { event: "Hasta Melap (the procession arrives here)", name: "Kolvada High School Ground", place: "Kolvada, Taluka Vijapur", query: "Kolavada+High+School+Kolavada+Vijapur+Gujarat", link: "https://maps.app.goo.gl/myTNobgSidPLHrHk7" },
    ],
  },
  hosts: {
    title: "Invited by", address: "Ramapura (Kansa), Taluka Visnagar, District Mehsana", phone: "Mobile:",
    families: [["Shri Chaturbhai Dwarkadas Patel", "Late Dahiben Chaturbhai Patel"], ["Shri Kamleshbhai Chaturbhai Patel", "Smt. Alpaben Kamleshbhai Patel"]],
  },
  rsvp: {
    title: "Your Reply", name: "Your name", contact: "Mobile or email", attending: "Will you attend?", yes: "Yes, with joy", no: "Sorry, can't make it",
    guests: "Number of guests", message: "Message", send: "Send reply",
    wa: { head: "RSVP for the wedding of Charmin & Krupali", name: "Name", contact: "Contact", attending: "Attending", guests: "Guests", message: "Message" },
  },
  reception: {
    title: "Satkar Samarambh", heroDate: "Saturday, 12-12-2026", date: "12 December 2026",
    lines: ["Saturday, 6:30 PM", "Shri Bavan Bavis Kadva Patidar Samaj Wadi, Amijhara-Bamroli, Surat"],
    blessing: "You are warmly invited to the “Satkar Samarambh” held on the occasion of the wedding, to bless the newly wed couple with your presence.",
    rsvpHead: "RSVP for the Satkar Samarambh of Charmin & Krupali",
    address: "47, Amijhara Residency, Gokuldham Sheri, Bamroli Road, beside Hariom Ind., Vadod, Surat.",
    event: { title: "Satkar Samarambh (Reception)", time: "Saturday, 12-12-2026 · 6:30 PM", note: "Shri Bavan Bavis Kadva Patidar Samaj Wadi, Amijhara-Bamroli, Surat" },
    place: { event: "Satkar Samarambh (Reception)", name: "Shri Bavan Bavis Kadva Patidar Samaj Wadi", place: "Hariom Ind. Society-3, behind Shri Umiya Mataji Mandir, Amijhara-Bamroli, Surat", query: "Shri+Bavan+Bavis+Kadva+Patidar+Samaj+Wadi+Hariom+Industrial+Society+3+Amijhara+Bamroli+Surat", link: "" },
  },
  footer: { title: "Charmin & Krupali", welcome: "The Chhaganbha family warmly welcomes you." },
};
