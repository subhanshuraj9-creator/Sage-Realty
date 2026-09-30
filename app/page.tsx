"use client";

import Image from "next/image";
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ExternalLink, Menu, X } from "lucide-react";

const configurations = {
  "3 BHK": { sizes: ["2,155 sq ft"], image: "/images/floor-3bhk.png", note: "D Type" },
  "4 BHK": { sizes: ["2,853 sq ft", "2,962 sq ft"], image: "/images/floor-4bhk.png", note: "C Type" },
  "5 BHK": { sizes: ["3,480 sq ft", "3,790 sq ft", "3,960 sq ft"], image: "/images/floor-5bhk.png", note: "A / B Type" },
} as const;

type Configuration = keyof typeof configurations;
const amenities = ["Gymnasium", "Swimming Pool", "Club House", "Landscaped Gardens", "Acupressure Pathway", "Senior Citizen Sitting Area", "Temple", "Car Parking"];
const addressPoints = [
  ["Apollo SAGE Hospital", "Just beside the project"], ["Reliance Smart Point", "180 m"],
  ["SAGE International School Kolar", "3.4 km"], ["ISBT Bus Stand", "6.8 km"],
  ["Rani Kamlapati Railway Station", "6.8 km"], ["Raja Bhoj Airport", "24.5 km"],
];
const journey = [
  ["01", "Discover", "Property content / Meta / Instagram"], ["02", "Explore", "Interactive property experience"],
  ["03", "Qualify", "Configuration + enquiry"], ["04", "Connect", "Sales / WhatsApp follow-up"], ["05", "Visit", "Site visit"],
];

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [configuration, setConfiguration] = useState<Configuration>("3 BHK");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "error" | "success">("idle");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { raf: (time: number) => void; destroy: () => void } | undefined;
    let raf = 0;
    let context: { revert: () => void } | undefined;
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: Lenis }, { default: gsap }, { ScrollTrigger }]) => {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const frame = (time: number) => { lenis?.raf(time); raf = requestAnimationFrame(frame); };
      raf = requestAnimationFrame(frame);
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.to(".hero-media img", { yPercent: 10, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, { y: 54, opacity: 0, duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%" } });
        });
      }, root);
    });
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); context?.revert(); };
  }, []);

  function submitDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").replace(/\D/g, "");
    setFormState(name.length >= 2 && phone.length >= 10 ? "success" : "error");
  }

  return (
    <main ref={root}>
      <div className="concept-bar"><span>Independent campaign concept</span><span>Not an official SAGE Realty website</span></div>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#top" className="wordmark" aria-label="SAGE Skyline concept home"><span>S</span> Skyline</a>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <button className="nav-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button>
          <a href="#residences" onClick={() => setMenuOpen(false)}>Residences</a>
          <a href="#address" onClick={() => setMenuOpen(false)}>Address</a><a href="#enquire" onClick={() => setMenuOpen(false)}>Enquire</a>
        </div>
        <button className="nav-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-media"><Image src="/images/skyline-night.webp" alt="SAGE Skyline exterior at night" fill priority sizes="100vw" /></div>
        <div className="hero-shade" /><div className="hero-index">01 / 11</div>
        <div className="hero-content"><p className="eyebrow">SAGE Skyline · Bhopal</p><h1><span>Rise above</span><span className="serif-italic">the ordinary.</span></h1>
          <div className="hero-foot"><p>SAGE SKYLINE<br />3 • 4 • 5 BHK APARTMENTS &amp; PENTHOUSES<br />BAWADIYA KALAN, BHOPAL</p>
            <div className="hero-actions"><a className="button button-light" href="#project">View project <ArrowDown /></a></div>
          </div>
        </div><span className="scroll-cue">Scroll to discover</span>
      </section>

      <section className="idea section-pad" id="idea"><div className="section-number">02</div><div className="idea-grid">
        <h2 data-reveal>See it<br /><em>before</em><br />you visit it.</h2><div className="idea-copy" data-reveal><p>A considered first look helps future residents understand the project, compare configurations and arrive for a visit with better questions.</p><span className="source-note">An independent digital campaign study.</span></div>
      </div><div className="discovery-sequence" data-reveal aria-label="Discover, explore, enquire, visit">{['Discover', 'Explore', 'Enquire', 'Visit'].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < 3 && <ArrowDown />}</div>)}</div></section>

      <section className="project section-pad" id="project"><div className="project-title" data-reveal><span className="section-number">03</span><p className="eyebrow">The project</p><h2>SAGE<br /><em>Skyline</em></h2></div>
        <div className="project-facts" data-reveal><div><span>Location</span><strong>Bawadiya Kalan,<br />Bhopal</strong></div><div><span>RERA</span><strong>P-BPL-25-5653</strong></div><div><span>Configurations</span><strong>3 BHK<br />4 BHK<br />5 BHK</strong></div><div><span>Property type</span><strong>Apartments<br />&amp; Penthouses</strong></div></div>
      </section>

      <section className="residences section-pad" id="residences"><div className="section-heading compact" data-reveal><div><span className="section-number">04</span><p className="eyebrow">Residences</p></div><h2>Choose your<br /><em>configuration</em></h2></div>
        <div className="configuration-shell" data-reveal><div className="configuration-tabs" role="tablist" aria-label="Apartment configurations">{(Object.keys(configurations) as Configuration[]).map((item) => <button key={item} role="tab" aria-selected={configuration === item} onClick={() => setConfiguration(item)}>{item}</button>)}</div>
          <div className="configuration-content" key={configuration}><div className="configuration-copy"><p>{configurations[configuration].note}</p><h3>{configuration}</h3><div className="size-list">{configurations[configuration].sizes.map((size) => <strong key={size}>{size}</strong>)}</div><span>Area information and plan artwork sourced from the official SAGE Skyline project page.</span></div><div className="floor-plan"><Image src={configurations[configuration].image} alt={`${configuration} floor plan`} fill sizes="(max-width: 800px) 100vw, 50vw" /></div></div>
        </div>
      </section>

      <section className="film section-pad" id="film"><div className="film-media"><Image src="/images/skyline-front.webp" alt="SAGE Skyline front exterior" fill sizes="100vw" /><div className="film-overlay" />
        <div className="film-caption"><span>Project film</span><span>SAGE Skyline</span></div><div className="film-title"><span className="section-number">05</span><h2>The<br /><em>property film</em></h2></div></div>
      </section>

      <section className="panorama section-pad"><div className="panorama-lines" aria-hidden="true" /><span className="section-number">06</span><p className="eyebrow">Official external experience</p><h2 data-reveal>Experience it<br /><em>in 360°</em></h2><a className="round-link" href="https://emarketlinkage.com/sage/" target="_blank" rel="noreferrer">Explore 360° <ExternalLink /></a></section>

      <section className="address section-pad" id="address"><div className="address-map" aria-hidden="true"><span className="map-ring ring-one" /><span className="map-ring ring-two" /><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-road road-three" /><span className="map-pin"><i />SAGE Skyline</span></div>
        <div className="address-content"><span className="section-number">07</span><p className="eyebrow">The address</p><h2 data-reveal>Placed within<br /><em>Bhopal</em></h2><div className="distance-list" data-reveal>{addressPoints.map(([place, distance], index) => <div key={place}><span>0{index + 1}</span><strong>{place}</strong><em>{distance}</em></div>)}</div></div>
      </section>

      <section className="amenities section-pad"><div className="amenities-head" data-reveal><div><span className="section-number">08</span><p className="eyebrow">Verified amenities</p></div><h2>Designed for<br /><em>everyday ritual</em></h2></div>
        <div className="amenity-track" data-reveal>{amenities.map((item, index) => <article className="amenity-item" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></article>)}</div>
        <p className="amenity-source">Amenities listed on the official SAGE Skyline project page.</p>
      </section>

      <section className="journey section-pad"><div className="journey-intro" data-reveal><span className="section-number">09</span><p className="eyebrow">Campaign system</p><h2>From discovery<br /><em>to site visit</em></h2><p>A connected campaign journey designed to move attention into informed intent.</p></div>
        <div className="journey-flow" data-reveal>{journey.map(([number, title, copy]) => <div key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
      </section>

      <section className="enquiry section-pad" id="enquire"><div className="enquiry-copy" data-reveal><span className="section-number">10</span><p className="eyebrow">Demo / conceptual form</p><h2>Begin your<br /><em>site visit</em></h2><p>This interface demonstrates the final step in the digital journey. No personal data is sent or stored.</p></div>
        <form className="enquiry-form" onSubmit={submitDemo} noValidate data-reveal><label><span>Name</span><input name="name" type="text" autoComplete="name" placeholder="Your full name" /></label><label><span>Phone</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" /></label><label><span>Preferred configuration</span><select name="configuration" defaultValue=""><option value="" disabled>Select a residence</option><option>3 BHK</option><option>4 BHK</option><option>5 BHK</option></select></label><label><span>Purchase timeline</span><select name="timeline" defaultValue=""><option value="" disabled>Select a timeline</option><option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>Exploring</option></select></label><button className="button button-gold" type="submit">Request a site visit <ArrowUpRight /></button>{formState === "error" && <p className="form-message error" role="alert">Please add your name and a valid 10-digit phone number.</p>}{formState === "success" && <p className="form-message success" role="status">Demo complete. In a live campaign, the sales team would receive this request.</p>}</form>
      </section>

      <footer className="finale section-pad"><span className="section-number">11</span><h2 data-reveal>Rise above<br /><em>the ordinary.</em></h2><div className="signature" data-reveal><p>This is how I see<br />real-estate marketing.</p><div><strong>Subhanshu Raj</strong><span>Digital Marketing &amp; AI-Assisted<br />Digital Experience Specialist</span></div></div><div className="footer-line"><span>Independent campaign concept</span><span>Not affiliated with or endorsed by SAGE Realty</span><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
