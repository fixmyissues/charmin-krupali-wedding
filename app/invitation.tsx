"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Content } from "./content";

const WEDDING_DATE = new Date("2026-12-06T10:00:00+05:30").getTime();
const RECEPTION_DATE = new Date("2026-12-12T18:30:00+05:30").getTime();
// Add a WhatsApp number in international format, without +, spaces or dashes. Empty lets the guest pick a chat.
const WHATSAPP_NUMBER = "";
const PHONES = ["9909145335", "7069996588", "9016184664", "9925362343"];
// The reception card prints only three numbers.
const RECEPTION_PHONES = ["9909145335", "7069996588", "9925362343"];
const HOLD_MS = 1400;
const pad = (n: number) => String(n).padStart(2, "0");

type Dust = { x: number; y: number; vx: number; vy: number; r: number; c: string; a: number; life: number };

// wedding: the public page. full: wedding plus the reception. reception: the reception only.
export type Mode = "wedding" | "full" | "reception";

export default function Invitation({ t, mode = "wedding" }: { t: Content; mode?: Mode }) {
  const reception = mode !== "wedding", only = mode === "reception";
  const [stage, setStage] = useState<"idle" | "open" | "done">("idle");
  const [open, setOpen] = useState(false); // the guest has come in
  const [gateGone, setGateGone] = useState(false);
  const [music, setMusic] = useState(false);
  const [left, setLeft] = useState<string[]>(["--", "--", "--", "--"]);
  const gate = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLButtonElement>(null);
  const fx = useRef<HTMLCanvasElement>(null);
  const burst = useRef<(x: number, y: number) => void>(() => {});
  const scratch = useRef<HTMLCanvasElement>(null);
  const hold = useRef({ t0: 0, raf: 0, p: 0, on: false });
  const audio = useRef<HTMLAudioElement | null>(null);
  const d = t.digits;
  const events = reception ? [...t.events.list, t.reception.event] : t.events.list;
  const places = only ? [t.reception.place] : reception ? [...t.venue.places, t.reception.place] : t.venue.places;
  const route = mode === "wedding" ? "" : "/" + mode;
  const langHref = t.lang === "gu" ? route || "/" : "/gu" + route;
  const title = only ? t.reception.title : t.gate.title;
  const [s1, s2] = t.gate.seal.split("|");
  const shortDate = only ? d("12 · 12 · 2026") : d("06 · 12 · 2026");

  // Page scroll stays locked until the guest enters.
  useEffect(() => {
    document.body.classList.toggle("lock", !open);
    return () => document.body.classList.remove("lock");
  }, [open]);

  // Each block fades in as it scrolls into view.
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
    document.querySelectorAll<HTMLElement>(".w").forEach((el) => { el.classList.add("rv"); io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const tick = () => {
      const x = Math.max(0, (only ? RECEPTION_DATE : WEDDING_DATE) - Date.now());
      setLeft([String(Math.floor(x / 864e5)), pad(Math.floor((x % 864e5) / 36e5)), pad(Math.floor((x % 36e5) / 6e4)), pad(Math.floor((x % 6e4) / 1e3))]);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [only]);

  // Gold dust drifting over the gate; a burst of it when the kanku is placed.
  useEffect(() => {
    const cv = fx.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx || gateGone || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = ["#E7CE92", "#FFF6E9", "#C79A3C"];
    let W = 0, H = 0, raf = 0;
    const rs = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    rs();
    window.addEventListener("resize", rs);
    const mk = (): Dust => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.2, vy: 0.15 + Math.random() * 0.4, r: 0.8 + Math.random() * 1.4, c: cols[(Math.random() * 3) | 0], a: 0.2 + Math.random() * 0.6, life: -1 });
    const P: Dust[] = Array.from({ length: 50 }, mk);
    burst.current = (x, y) => {
      for (let i = 0; i < 40; i++) { const a = Math.random() * 6.28, s = 1 + Math.random() * 3; P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 1.5 + Math.random() * 1.5, c: i % 2 ? "#FF3B2E" : "#E7CE92", a: 1, life: 60 }); }
    };
    const loop = () => {
      cx.clearRect(0, 0, W, H);
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.x += p.vx; p.y += p.vy;
        if (p.life >= 0) { p.vx *= 0.96; p.vy *= 0.96; if (--p.life <= 0) { P.splice(i, 1); continue; } }
        else if (p.y > H + 4) { p.y = -4; p.x = Math.random() * W; }
        cx.globalAlpha = p.life >= 0 ? (p.a * p.life) / 60 : p.a;
        cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.28); cx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", rs); };
  }, [gateGone]);

  // Gold leaf over the countdown, scratched away with a finger or the mouse.
  // shortcut: canvas is sized once, so a window resize keeps the old size; fine for a one-time scratch.
  useEffect(() => {
    const cv = scratch.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx) return;
    const w = (cv.width = cv.offsetWidth), h = (cv.height = cv.offsetHeight);
    const g = cx.createLinearGradient(0, 0, w, h);
    [[0, "#E7CE92"], [0.45, "#C79A3C"], [0.7, "#8C6A1E"], [1, "#E7CE92"]].forEach(([o, c]) => g.addColorStop(o as number, c as string));
    cx.fillStyle = g; cx.fillRect(0, 0, w, h);
    cx.fillStyle = "rgba(94,10,4,.75)"; cx.font = "600 14px 'DM Sans','Noto Sans Gujarati',sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(t.countdown.scratch, w / 2, h / 2);
    let down = false, last: [number, number] | null = null;
    // A thick round stroke joined between pointer events, so one or two swipes clear the leaf.
    const at = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      cx.globalCompositeOperation = "destination-out"; cx.lineWidth = 90; cx.lineCap = "round"; cx.lineJoin = "round";
      cx.beginPath(); cx.moveTo(...(last ?? [x, y])); cx.lineTo(x, y); cx.stroke(); last = [x, y];
    };
    const dn = (e: PointerEvent) => { down = true; last = null; cv.setPointerCapture(e.pointerId); at(e); };
    const mv = (e: PointerEvent) => { if (down) at(e); };
    const up = () => {
      if (!down) return;
      down = false;
      const px = cx.getImageData(0, 0, w, h).data;
      let n = 0, c = 0;
      for (let i = 3; i < px.length; i += 32) { n++; if (!px[i]) c++; }
      if (c / n > 0.3) cv.classList.add("gone");
    };
    cv.addEventListener("pointerdown", dn); cv.addEventListener("pointermove", mv); cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    return () => { cv.removeEventListener("pointerdown", dn); cv.removeEventListener("pointermove", mv); cv.removeEventListener("pointerup", up); cv.removeEventListener("pointercancel", up); };
  }, [t.countdown.scratch]);

  useEffect(() => () => audio.current?.pause(), []);

  // Press and hold the kanku: progress fills the thumbprint, then the cover unfolds.
  const setP = (p: number) => gate.current?.style.setProperty("--p", String(p));
  function holdStart() {
    const h = hold.current;
    if (stage !== "idle" || h.on) return;
    h.on = true; h.t0 = performance.now() - h.p * HOLD_MS;
    const step = (now: number) => {
      h.p = Math.min(1, (now - h.t0) / HOLD_MS); setP(h.p);
      if (h.p >= 1) { h.on = false; holdDone(); return; }
      h.raf = requestAnimationFrame(step);
    };
    h.raf = requestAnimationFrame(step);
  }
  function holdEnd() {
    const h = hold.current;
    if (!h.on) return;
    h.on = false; cancelAnimationFrame(h.raf);
    const back = () => { h.p = Math.max(0, h.p - 0.06); setP(h.p); if (h.p > 0 && !h.on) h.raf = requestAnimationFrame(back); };
    back();
  }
  function holdDone() {
    const b = thumb.current?.getBoundingClientRect();
    if (b) burst.current(b.left + b.width / 2, b.top + b.height / 2);
    navigator.vibrate?.(30);
    setStage("open");
    window.setTimeout(() => setStage("done"), 1500); // let the cover finish unfolding
  }

  function enter() {
    if (open) return;
    setOpen(true);
    toggleMusic(true);
    window.setTimeout(() => setGateGone(true), 1200); // wait for the gate to fade
  }

  // Browsers only allow sound after a tap, so the song starts from the "open" button and the dock toggles it.
  function toggleMusic(on = !music) {
    const a = (audio.current ??= Object.assign(new Audio("/vela-milan-ni.mp3"), { loop: true }));
    if (on) a.play().then(() => setMusic(true), () => setMusic(false));
    else { a.pause(); setMusic(false); }
  }

  function share() {
    if (navigator.share) navigator.share({ title: document.title, url: location.href }).catch(() => {});
    else navigator.clipboard?.writeText(location.href);
  }

  function sendRsvp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget), w = only ? { ...t.rsvp.wa, head: t.reception.rsvpHead } : t.rsvp.wa;
    const text = [
      w.head,
      `${w.name}: ${f.get("name")}`,
      `${w.contact}: ${f.get("contact")}`,
      `${w.attending}: ${f.get("attending")}`,
      `${w.guests}: ${f.get("guests")}`,
      f.get("message") ? `${w.message}: ${f.get("message")}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  const mono = <>{s1}<i>&amp;</i>{s2}</>;

  return (
    <div lang={t.lang} className={open ? "go" : ""}>
      {!gateGone && <div id="gate" ref={gate} className={`gate${open ? " open" : ""}${stage === "done" ? " done" : ""}`} data-stage={stage === "idle" ? "idle" : "open"} role="dialog" aria-label={t.gate.title}>
        <div className="op-scene" aria-hidden="true"><div className="velvet"/><div className="frame"/></div>
        <div className="op-ritual">
          <div className="card3d">
            <div className="inside"><span className="guj">{title}</span><span className="op-ini">{mono}</span><em>{shortDate}</em></div>
            <div className="cover l"><div className="face"/></div>
            <div className="cover r"><div className="face"/></div>
            <div className="front">
              <div className="invoc">{t.hero.top}</div>
              <i className="orn"/>
              <div className="line">{only ? t.reception.title : t.gate.line}</div>
              <button ref={thumb} type="button" className="thumb" aria-label={t.gate.label}
                onPointerDown={holdStart} onPointerUp={holdEnd} onPointerLeave={holdEnd} onPointerCancel={holdEnd} onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !e.repeat) { e.preventDefault(); holdStart(); } }} onKeyUp={holdEnd}>
                <span className="print"/><span className="ridges"/>
              </button>
            </div>
          </div>
        </div>
        <canvas className="op-fx" ref={fx} aria-hidden="true"/>
        <div className="op-hint" aria-live="polite"><i aria-hidden="true"/><span>{t.gate.hint}</span><b className="op-prog" aria-hidden="true"><s/></b></div>
        <button className="op-skip" type="button" onClick={enter}>{t.gate.skip}</button>
        <div className="op-done">
          <div className="op-card">
            <div className="op-mono" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="57"/><circle cx="60" cy="60" r="50"/></svg><span className="op-ini">{mono}</span></div>
            <small>{only ? t.reception.title : t.gate.line}</small>
            <h1>{t.footer.title}</h1>
            <div className="date">{shortDate}</div>
            <button className="enter" type="button" onClick={enter}>{t.gate.button}</button>
            <div className="op-sub">{t.gate.done}</div>
          </div>
        </div>
        <div className="op-flash" aria-hidden="true"/>
      </div>}

      <Link className="lang" href={langHref} lang={t.switchTo.lang}>{t.switchTo.label}</Link>

      <header className="hero">
        <div className="in">
          <div className="guj-line">{title}</div>
          <h1 className="names">{t.hero.names[0]}</h1><div className="amp">{t.hero.weds}</div><h1 className="names">{t.hero.names[1]}</h1>
          <div className="when">{only ? t.reception.heroDate : t.hero.date}</div>
        </div>
        <div className="cue" aria-hidden="true">↓</div>
      </header>

      <section className="invoke"><div className="w c">
        <div className="guj">{t.hero.top}</div>
        <div className="sh" lang="sa">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br/>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</div>
        <div className="kanku" aria-hidden="true"><i/><i/><i/></div>
        <p>{only ? t.reception.blessing : t.seal.blessing}</p>
      </div></section>

      <section><div className="w">
        <h2>{only ? t.reception.date : t.seal.date}</h2>
        <div className="prasange">{(only ? t.reception.lines : t.seal.lines).map((l) => <div className="row" key={l}><b>{l}</b></div>)}</div>
      </div></section>

      <section className="count-sec"><div className="w c">
        {!only && <small className="kick">{t.countdown.kicker}</small>}
        <h2>{only ? t.reception.title : t.countdown.title}</h2>
        <div className="count" role="timer">
          {t.hero.count.map((label, i) => <div key={label}><b>{left[i]}</b><small>{label}</small></div>)}
          <canvas className="scr" ref={scratch} aria-hidden="true"/>
        </div>
      </div></section>

      {!only && <section id="events"><div className="w wide">
        <h2>{t.events.title}</h2>
        <div className="wevs">{events.map((e, i) => {
          const [day, time] = e.time.split(" · ");
          return <article className={`wev${i === t.events.main ? " main" : ""}`} key={e.title}>
            <header><h3>{e.title}</h3><div className="when"><span>{day}</span>{time && <span>{time}</span>}</div></header>
            {e.note && <p>{e.note}</p>}
          </article>;
        })}</div>
      </div></section>}

      <section><div className="w wide">
        <h2>{t.hosts.title}</h2>
        <div className="wfam">
          {t.hosts.families.map((f) => <div className="fam" key={f[0]}><h3>{f[0]}</h3><p>{f[1]}</p></div>)}
          <p className="blessing">{reception ? t.reception.address : t.hosts.address}<br/>{t.hosts.phone} {(reception ? RECEPTION_PHONES : PHONES).map((n, i) => <span key={n}>{i ? ", " : ""}<a href={`tel:+91${n}`}>{d(`${n.slice(0, 5)} ${n.slice(5)}`)}</a></span>)}</p>
        </div>
      </div></section>

      <section><div className="w c">
        <h2>{t.venue.title}</h2>
        {places.map((v) => <div className="place" key={v.name}>
          <small>{v.event}</small>
          <p><b>{v.name}</b><br/>{v.place}</p>
          <a className="btn" href={v.link || `https://www.google.com/maps/search/?api=1&query=${v.query}`} target="_blank" rel="noreferrer">{t.venue.maps}</a>
        </div>)}
        <iframe className="map" title={t.venue.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${t.venue.places[0].query}&z=17&output=embed`}/>
      </div></section>

      <section id="rsvp" className="rsvp-sec"><div className="w">
        <h2>{t.rsvp.title}</h2>
        <form onSubmit={sendRsvp}>
          <label>{t.rsvp.name}<input name="name" required autoComplete="name"/></label>
          <label>{t.rsvp.contact}<input name="contact" required/></label>
          <fieldset className="choice"><legend>{t.rsvp.attending}</legend>
            <label><input type="radio" name="attending" value={t.rsvp.yes} required/> {t.rsvp.yes}</label>
            <label><input type="radio" name="attending" value={t.rsvp.no}/> {t.rsvp.no}</label>
          </fieldset>
          <label>{t.rsvp.guests}<select name="guests">{["1", "2", "3", "4", "5+"].map((g) => <option key={g}>{g}</option>)}</select></label>
          <label>{t.rsvp.message}<textarea name="message" rows={3}/></label>
          <button className="btn" type="submit">{t.rsvp.send}</button>
        </form>
      </div></section>

      <footer className="finale"><div>
        <div className="kanku" aria-hidden="true"><i/><i/><i/></div>
        <p>{t.footer.welcome}</p>
        <div className="fnames">{t.footer.title}</div>
      </div></footer>

      <nav className={`dock${gateGone ? " on" : ""}`}>
        <a className="pri" href="#rsvp">{t.dock.rsvp}</a>
        {!only && <a href="#events">{t.dock.events}</a>}
        <button type="button" onClick={() => toggleMusic()} aria-pressed={music}><span className={`eq${music ? " on" : ""}`}><i/><i/><i/></span>{t.dock.music}</button>
        <button type="button" onClick={share} aria-label={t.dock.share}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg></button>
      </nav>
    </div>
  );
}
