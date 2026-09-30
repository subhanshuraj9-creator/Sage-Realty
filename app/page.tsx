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
const amenities = [
  { name: "Gymnasium", alt: "Contemporary fitness room with treadmills and strength equipment", photo: "https://images.pexels.com/photos/37352354/pexels-photo-37352354/free-photo-of-modern-gym-interior-with-fitness-equipment.jpeg?auto=compress&dpr=1&h=750&w=1260", credit: "Rana Matloob Hussain", source: "https://www.pexels.com/photo/modern-gym-interior-with-fitness-equipment-37352354/" },
  { name: "Swimming Pool", alt: "Modern apartment courtyard with a swimming pool", photo: "https://images.pexels.com/photos/27115003/pexels-photo-27115003/free-photo-of-a-swimming-pool-at-a-patio.jpeg?auto=compress&dpr=1&h=750&w=1260", credit: "Adina Yusuf", source: "https://www.pexels.com/photo/a-swimming-pool-at-a-patio-27115003/" },
  { name: "Club House", alt: "Bright resident lounge with contemporary seating", photo: "https://images.pexels.com/photos/35551655/pexels-photo-35551655/free-photo-of-modern-indoor-lounge-with-contemporary-design.jpeg?auto=compress&dpr=1&h=750&w=1260", credit: "dwi endah kusumawati", source: "https://www.pexels.com/photo/modern-indoor-lounge-with-contemporary-design-35551655/" },
  { name: "Landscaped Gardens", alt: "Apartment garden with leafy planting and a walking path", photo: "https://images.pexels.com/photos/34056718/pexels-photo-34056718/free-photo-of-modern-apartment-exterior-with-lush-garden.jpeg?auto=compress&dpr=1&h=750&w=1260", credit: "Thang Nguyen", source: "https://www.pexels.com/photo/modern-apartment-exterior-with-lush-garden-34056718/" },
  { name: "Acupressure Pathway", alt: "Green pedestrian pathway through a residential garden", photo: "https://images.pexels.com/photos/32203740/pexels-photo-32203740/free-photo-of-urban-green-pathway-between-residential-buildings.jpeg?auto=compress&dpr=1&h=750&w=1260", credit: "Elina Volkova", source: "https://www.pexels.com/photo/urban-green-pathway-between-residential-buildings-32203740/" },
  { name: "Senior Citizen Sitting Area", alt: "Senior couple relaxing together on a park bench", photo: "https://images.pexels.com/photos/9404060/pexels-photo-9404060.png?dpr=1&h=750&w=1260", credit: "Charlie Griffiths", source: "https://www.pexels.com/photo/elderly-man-and-woman-sitting-on-park-bench-9404060/" },
  { name: "Temple", alt: "Traditional Hindu temple architecture in India", photo: "https://images.pexels.com/photos/7470318/pexels-photo-7470318.jpeg?auto=compress&dpr=1&h=750&w=1260", credit: "Dev Patel", source: "https://www.pexels.com/photo/ancient-temple-7470318/" },
  { name: "Car Parking", alt: "Multi-storey car park with parked vehicles", photo: "https://images.pexels.com/photos/16551615/pexels-photo-16551615/free-photo-of-view-of-cars-parked-in-a-garage.jpeg?auto=compress&dpr=1&h=750&w=1260", credit: "Anastasiya Badun", source: "https://www.pexels.com/photo/view-of-cars-parked-in-a-garage-16551615/" },
];
const addressPoints = [
  ["Apollo SAGE Hospital", "Just beside the project"], ["Reliance Smart Point", "180 m"],
  ["SAGE International School Kolar", "3.4 km"], ["ISBT Bus Stand", "6.8 km"],
  ["Rani Kamlapati Railway Station", "6.8 km"], ["Raja Bhoj Airport", "24.5 km"],
];
const journey = [
  ["Discover", "Property content / Meta / Instagram"], ["Explore", "Interactive property experience"],
  ["Qualify", "Configuration + enquiry"], ["Connect", "Sales / WhatsApp follow-up"], ["Visit", "Site visit"],
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
    let lenis: { raf: (time: number) => void; destroy: () => void; on: (event: string, callback: () => void) => void } | undefined;
    let raf = 0;
    let context: { revert: () => void } | undefined;
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: Lenis }, { default: gsap }, { ScrollTrigger }]) => {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const frame = (time: number) => { lenis?.raf(time); raf = requestAnimationFrame(frame); };
      raf = requestAnimationFrame(frame);
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", () => ScrollTrigger.update());
      context = gsap.context(() => {
        gsap.to(".hero-media img", { yPercent: 10, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, { y: 54, opacity: 0, duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%" } });
        });
        const amenityTrack = root.current?.querySelector<HTMLElement>(".amenity-track");
        const amenityWindow = root.current?.querySelector<HTMLElement>(".amenity-window");
        if (amenityTrack && amenityWindow) {
          gsap.to(amenityTrack, {
            x: () => -Math.max(0, amenityTrack.scrollWidth - amenityWindow.clientWidth),
            ease: "none",
            scrollTrigger: {
              trigger: ".amenities",
              start: "top top",
              end: () => `+=${Math.max(0, amenityTrack.scrollWidth - amenityWindow.clientWidth)}`,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
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
        <div className="hero-media"><Image src="/images/skyline-hero.webp" alt="SAGE Skyline residences at sunset" fill priority sizes="100vw" /></div>
        <div className="hero-shade" />
        <div className="hero-content"><p className="eyebrow">SAGE Skyline · Bhopal</p><h1><span>Rise above</span><span className="serif-italic">the ordinary.</span></h1>
          <div className="hero-foot"><p>SAGE SKYLINE<br />3 • 4 • 5 BHK APARTMENTS &amp; PENTHOUSES<br />BAWADIYA KALAN, BHOPAL</p>
            <div className="hero-actions"><a className="button button-light" href="#project">View project <ArrowDown /></a></div>
          </div>
        </div><span className="scroll-cue">Scroll to discover</span>
      </section>

      <section className="idea section-pad" id="idea"><div className="idea-grid">
        <h2 data-reveal>See it<br /><em>before</em><br />you visit it.</h2><div className="idea-copy" data-reveal><p>A considered first look helps future residents understand the project, compare configurations and arrive for a visit with better questions.</p><span className="source-note">An independent digital campaign study.</span></div>
      </div><div className="discovery-sequence" data-reveal aria-label="Discover, explore, enquire, visit">{['Discover', 'Explore', 'Enquire', 'Visit'].map((item, index) => <div key={item}><strong>{item}</strong>{index < 3 && <ArrowDown />}</div>)}</div></section>

      <section className="project section-pad" id="project"><div className="project-title" data-reveal><p className="eyebrow">The project</p><h2>SAGE<br /><em>Skyline</em></h2></div>
        <div className="project-facts" data-reveal><div><span>Location</span><strong>Bawadiya Kalan,<br />Bhopal</strong></div><div><span>RERA</span><strong>P-BPL-25-5653</strong></div><div><span>Configurations</span><strong>3 BHK<br />4 BHK<br />5 BHK</strong></div><div><span>Property type</span><strong>Apartments<br />&amp; Penthouses</strong></div></div>
      </section>

      <section className="residences section-pad" id="residences"><div className="section-heading compact" data-reveal><div><p className="eyebrow">Residences</p></div><h2>Choose your<br /><em>configuration</em></h2></div>
        <div className="configuration-shell" data-reveal><div className="configuration-tabs" role="tablist" aria-label="Apartment configurations">{(Object.keys(configurations) as Configuration[]).map((item) => <button key={item} role="tab" aria-selected={configuration === item} onClick={() => setConfiguration(item)}>{item}</button>)}</div>
          <div className="configuration-content" key={configuration}><div className="configuration-copy"><p>{configurations[configuration].note}</p><h3>{configuration}</h3><div className="size-list">{configurations[configuration].sizes.map((size) => <strong key={size}>{size}</strong>)}</div><span>Area information and plan artwork sourced from the official SAGE Skyline project page.</span></div><div className="floor-plan"><Image src={configurations[configuration].image} alt={`${configuration} floor plan`} fill sizes="(max-width: 800px) 100vw, 50vw" /></div></div>
        </div>
      </section>

      <section className="film section-pad" id="film"><div className="film-media"><video autoPlay muted loop controls playsInline preload="metadata" poster="/images/skyline-front.webp" aria-label="SAGE Skyline property film"><source src="/videos/IMG_1260.mp4" type="video/mp4" />Your browser does not support MP4 video.</video><div className="film-overlay" />
        <div className="film-title"><h2>The<br /><em>property film</em></h2></div></div>
      </section>

      <section className="panorama section-pad"><div className="panorama-lines" aria-hidden="true" /><p className="eyebrow">Official external experience</p><h2 data-reveal>Experience it<br /><em>in 360°</em></h2><a className="round-link" href="https://emarketlinkage.com/sage/" target="_blank" rel="noreferrer">Explore 360° <ExternalLink /></a></section>

      <section className="address section-pad" id="address"><div className="address-map"><iframe title="SAGE Skyline location map" src="https://maps.google.com/maps?q=23.1775879%2C77.4420732&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a className="map-open-link" href="https://www.google.com/maps/place/SAGE+Skyline+:+3,+4+%26+5+Bhk+apartment+in+Bawadiya+Kala/@23.1775879,77.4420732,17z/data=!3m1!4b1!4m6!3m5!1s0x397c43007a9547f9:0xcf3677fac95d06b9!8m2!3d23.1775879!4d77.4420732!16s%2Fg%2F11x0fgjnyp?hl=en&entry=ttu" target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink /></a></div>
        <div className="address-content"><p className="eyebrow">The address</p><h2 data-reveal>Placed within<br /><em>Bhopal</em></h2><div className="distance-list" data-reveal>{addressPoints.map(([place, distance]) => <div key={place}><strong>{place}</strong><em>{distance}</em></div>)}</div></div>
      </section>

      <section className="amenities section-pad"><div className="amenities-head" data-reveal><div><p className="eyebrow">Verified amenities</p></div><h2>Designed for<br /><em>everyday ritual</em></h2></div>
        <div className="amenity-window" role="region" aria-label="Amenities photo gallery; scroll the page to explore" tabIndex={0}><div className="amenity-track">{amenities.map((item, index) => <article className="amenity-item" key={item.name}>
          <div className="amenity-image"><img src={item.photo} alt={item.alt} loading={index < 3 ? "eager" : "lazy"} /></div>
          <div className="amenity-caption"><strong>{item.name}</strong><a href={item.source} target="_blank" rel="noreferrer">Photo: {item.credit} / Pexels</a></div>
        </article>)}</div></div>
        <p className="amenity-scroll-hint" aria-hidden="true">Keep scrolling to explore</p>
        <p className="amenity-source">Illustrative stock photography. Amenities listed on the official SAGE Skyline project page.</p>
      </section>

      <section className="journey section-pad"><div className="journey-intro" data-reveal><p className="eyebrow">Campaign system</p><h2>From discovery<br /><em>to site visit</em></h2><p>A connected campaign journey designed to move attention into informed intent.</p></div>
        <div className="journey-flow" data-reveal>{journey.map(([title, copy]) => <div key={title}><strong>{title}</strong><p>{copy}</p></div>)}</div>
      </section>

      <section className="enquiry section-pad" id="enquire"><div className="enquiry-copy" data-reveal><p className="eyebrow">Demo / conceptual form</p><h2>Begin your<br /><em>site visit</em></h2><p>This interface demonstrates the final step in the digital journey. No personal data is sent or stored.</p></div>
        <form className="enquiry-form" onSubmit={submitDemo} noValidate data-reveal><label><span>Name</span><input name="name" type="text" autoComplete="name" placeholder="Your full name" /></label><label><span>Phone</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" /></label><label><span>Preferred configuration</span><select name="configuration" defaultValue=""><option value="" disabled>Select a residence</option><option>3 BHK</option><option>4 BHK</option><option>5 BHK</option></select></label><label><span>Purchase timeline</span><select name="timeline" defaultValue=""><option value="" disabled>Select a timeline</option><option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>Exploring</option></select></label><button className="button button-gold" type="submit">Request a site visit <ArrowUpRight /></button>{formState === "error" && <p className="form-message error" role="alert">Please add your name and a valid 10-digit phone number.</p>}{formState === "success" && <p className="form-message success" role="status">Demo complete. In a live campaign, the sales team would receive this request.</p>}</form>
      </section>

      <footer className="finale section-pad"><h2 data-reveal>Rise above<br /><em>the ordinary.</em></h2><div className="signature" data-reveal><p>This is how I see<br />real-estate marketing.</p><div><strong>Subhanshu Raj</strong><span>Digital Marketing &amp; AI-Assisted<br />Digital Experience Specialist</span></div></div><div className="footer-line"><span>Independent campaign concept</span><span>Not affiliated with or endorsed by SAGE Realty</span><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
