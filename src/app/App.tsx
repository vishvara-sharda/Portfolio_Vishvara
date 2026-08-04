import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from 'motion/react';
import CaseStudyPage from "./CaseStudyPage";
import MurmurCaseStudyPage from "./MurmurCaseStudyPage";
import DesignerMind from "./DesignerMind";
import ConstellationCaseStudies from "./ConstellationCaseStudies";
import SignalsSection from "./SignalsSection";
import DesignLensSection from "./DesignLensSection";
import OutsideWork from "./OutsideWork";
import LoadingScreen from "./LoadingScreen";
import girlImg from "../imports/ChatGPT_Image_May_26__2026__08_22_25_PM.png";
import profileImg from "./components/Pictures/me1.png";
import heartUrl from "../imports/logo/heart.svg";
import starUrl from "../imports/logo/star.svg";
import murmurBannerUrl from "../imports/Murmur/banner.png";

function YouTubeFacade({ videoId, title, borderRadius = "14px" }: { videoId: string; title: string; borderRadius?: string }) {
  const [active, setActive] = React.useState(false);
  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: "100%", aspectRatio: "16/9", borderRadius, border: "none", display: "block" }}
      />
    );
  }
  return (
    <div
      onClick={() => setActive(true)}
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius, overflow: "hidden", cursor: "pointer", background: "#000" }}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.3)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
        </div>
      </div>
    </div>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function eio(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function seg(v: number, s: number, e: number) {
  return Math.max(0, Math.min(1, (v - s) / (e - s)));
}


const HERO_CONSTELLATIONS = [
  // Large cluster — upper left, partially cropped
  { nodes: [[-2,8],[4,14],[8,10],[14,18],[10,24],[3,22]], edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[1,5]], opacity: 0.15 },
  // Large cluster — upper center-right
  { nodes: [[52,12],[58,7],[65,14],[62,20],[55,22],[70,9]], edges:[[0,1],[1,2],[2,3],[3,4],[4,0],[1,5]], opacity: 0.18 },
  // Small cluster — mid left
  { nodes: [[18,38],[22,32],[26,36]], edges:[[0,1],[1,2]], opacity: 0.12 },
  // Small cluster — far right mid (keep clear of moon at 86%,16%)
  { nodes: [[74,34],[78,28],[82,36],[79,42]], edges:[[0,1],[1,2],[2,3]], opacity: 0.14 },
];

const BACKGROUND_STARS = Array.from({ length: 500 }, (_, i) => ({
  id: i,
  x: (Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453)) % 100,
  y: Math.pow((Math.abs(Math.sin(i * 269.5 + 183.3) * 43758.5453)) % 1, 2.8) * 100,
  r: (Math.abs(Math.sin(i * 419.2)) % 1.2) + 0.3,
  dur: (Math.abs(Math.sin(i * 53.7)) % 3) + 2,
  delay: (Math.abs(Math.sin(i * 71.3)) % 2),
}));


const caseStudiesData = [
  {
    id: "margdarshak",
    tag: "Self-Initiated Project",
    title: "Margdarshak — Empowering the Common Man",
    subtitle: "Bridging the last-mile gap between welfare schemes and the low-income families they're meant to serve",
    meta: [
      { label: "Role", value: "Product Designer" },
      { label: "Timeline", value: "3 months" },
      { label: "Team", value: "GURUX" }
    ],
    images: [
      { type: 'cover', label: 'Cover' },
      { type: 'screen', label: 'Home' },
      { type: 'screen', label: 'Dashboard' },
      { type: 'cover', label: 'Flow' },
      { type: 'screen', label: 'Profile' },
      { type: 'cover', label: 'Process' }
    ],
    situation: "India has 740+ central and 65+ centrally sponsored welfare schemes, yet ~58% of the salaried workforce lacks social security access. Low-income families remain excluded due to procedural, linguistic, and emotional barriers.",
    task: "Bridge the last-mile gap between scheme entitlement and actual access. Design an intervention that reduces cognitive load, builds trust, and preserves user dignity — built on existing digital fluency.",
    actionTitle: "Designed a three-tier inclusive system — app for independent users, guide network for low digital confidence, counselor support for users without smartphones — to reach every Indian, not just the digitally confident.",
    actions: [
      "Surfaced 3 core patterns: Awareness Gap, Fear, Digital Confidence",
      "Ran 20 primary interviews across 5 cities",
      "Applied SCAMPER to arrive at unified direction",
      "Designed AI eligibility matching reducing 740+ to 3–5",
      "Built a one-time document vault and plain-language translation layer"
    ],
    result: "A tested high fidelity prototype where a 19-year-old semi-urban participant navigated the app end-to-end with no prior guidance.",
    metrics: [
      { value: "740→3–5", label: "SCHEMES FILTERED" },
      { value: "15→3", label: "FLOW REDUCTION" },
      { value: "20", label: "INTERVIEWS" }
    ],
    tools: ["FigJam", "Figma Make", "Figma Design", "Maze", "ChatGPT", "Perplexity", "Claude", "Adobe Suite", "Gemini", "Flow AI", "Google Forms"],
    deliverables: ["Research", "Flows", "IA", "Wireframes", "UI", "Prototype", "Testing", "Design System"],
    links: { full: "#", live: "#", promo: "#", presentation: "https://1drv.ms/b/c/FE99C4DEA30CBBD9/AY2UKf80iaBGsfJcBTDchpM?e=wyQUxM" }
  },
  {
    id: "murmur",
    tag: "B2B SaaS",
    title: "Murmur — Healthcare Portal",
    subtitle: "AI-powered postpartum couples platform that reads maternal distress signals and translates them into one actionable daily nudge for the partner.",
    meta: [
      { label: "Role", value: "Lead Product Designer" },
      { label: "Timeline", value: "6 months" },
      { label: "Team", value: "Murmur Dev Team" }
    ],
    images: [
      { type: 'cover', label: 'Hero Concept' },
      { type: 'screen', label: 'Dashboard' },
      { type: 'screen', label: 'Analytics' },
      { type: 'screen', label: 'Patients' }
    ],
    situation: "22% of Indian mothers get PPD, 55% feel unsupported, 80% of fathers feel useless — yet 0 of 587 apps address the couple's emotional gap.",
    task: "Build an AI that reads her voice, wearables, and mood — then gives him one specific, non-blaming daily action, unlocked only when both partners join.",
    actionTitle: "Researched 59 studies, mapped 587 apps with zero competitors, and designed a multi-modal AI pipeline with a four-part nudge formula, safety guardrails, and identity restoration — none of which exist in the market.",
    actions: [
      "Conducted extensive stakeholder workshops",
      "Created wireframes for the patient onboarding flow",
      "Iterated on high-fidelity dashboard data visualizations",
      "Established a new clinical accessibility-focused design system",
      "Handed off production-ready assets to engineering"
    ],
    result: "Blue ocean with zero direct competitors in an unstudied category — targeting India's 19-23.5% PPD market with cultural moats no global app can replicate.",
    metrics: [
      { value: "+40%", label: "ONBOARDING SPEED" },
      { value: "2.5x", label: "DATA ACCURACY" },
      { value: "50+", label: "CLINICS LAUNCHED" }
    ],
    tools: ["Figma", "Miro", "Jira", "Notion", "Zeplin"],
    deliverables: ["Wireframes", "UI Design", "Design System", "Handoff Docs", "User Testing"],
    links: { full: "#", live: "#", promo: "#", presentation: "#" }
  },
  {
    id: "openlee",
    tag: "Consumer App",
    title: "Openlee — Social Platform",
    subtitle: "Connecting communities through transparent, location-based storytelling",
    meta: [
      { label: "Role", value: "UI/UX Designer" },
      { label: "Timeline", value: "4 months" },
      { label: "Team", value: "Openlee Startup" }
    ],
    images: [
      { type: 'cover', label: 'Brand Concept' },
      { type: 'screen', label: 'Feed Flow' },
      { type: 'screen', label: 'Map View' },
      { type: 'screen', label: 'Profile' }
    ],
    situation: "Communities are increasingly disconnected despite social media. Localized information is fragmented across Nextdoor, Facebook groups, and physical bulletin boards.",
    task: "Design an intuitive mobile-first platform that makes local discovery engaging and helps users feel connected to their immediate surroundings.",
    actionTitle: "Core Sprints",
    actions: [
      "Mapped user journeys for hyper-local discovery",
      "Designed an interactive, gesture-based map interface",
      "Prototyped the immersive storytelling submission flow",
      "Created a vibrant, Gen-Z friendly visual identity",
      "Conducted usability testing with college campuses"
    ],
    result: "Achieved a highly engaging prototype that secured seed funding. The gesture-based map interaction increased time-on-task satisfaction significantly compared to traditional list views.",
    metrics: [
      { value: "1.2M", label: "SEED FUNDING" },
      { value: "+60%", label: "UX SATISFACTION" },
      { value: "300+", label: "BETA SIGNUPS" }
    ],
    tools: ["Figma", "Principle", "Framer", "Illustrator"],
    deliverables: ["Brand Identity", "App UI", "Interactions", "Pitch Deck", "Asset Library"],
    links: { full: "#", live: "#", promo: "#", presentation: "#" }
  },
  {
    id: "behive",
    tag: "Coming Soon",
    title: "Behive",
    subtitle: "Coming soon",
    meta: [],
    images: [],
    situation: "Coming soon",
    task: "Coming soon",
    actionTitle: "Coming soon",
    actions: [],
    result: "Coming soon",
    metrics: [],
    tools: [],
    deliverables: [],
    links: { full: "#", live: "#", promo: "#", presentation: "#" }
  },
];



const GlobalStyles = React.memo(() => (
  <style>{`
    body {
      background-color: var(--color-bg);
      margin: 0;
      padding: 0;
    }
    #skew-container {
      overflow-x: clip;
      width: 100%;
    }

    /* Editorial Marquee */
    @keyframes editorial-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .ribbon-word {
      color: #111;
      text-shadow: 
        -1px -1px 0 rgba(255, 255, 255, 0.15),
         1px -1px 0 rgba(255, 255, 255, 0.15),
        -1px  1px 0 rgba(255, 255, 255, 0.15),
         1px  1px 0 rgba(255, 255, 255, 0.15);
      transition: all 0.4s ease;
      pointer-events: auto;
      cursor: crosshair;
    }
    .ribbon-word:hover {
      color: var(--color-sky);
      text-shadow: 0 0 30px rgba(147, 197, 253, 0.6);
    }

    /* Premium Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--color-bg); 
      border-left: 1px solid rgba(255, 255, 255, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: #333; 
      border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-pink); 
    }

    @keyframes star-drift {
      0% { transform: translate(0, 0) scale(1.1); }
      33% { transform: translate(-15px, 15px) scale(1.1); }
      66% { transform: translate(10px, -10px) scale(1.1); }
      100% { transform: translate(0, 0) scale(1.1); }
    }
    a, button, [role="button"], .photo-card-outer, .c-node, .clickable {
      cursor: url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cG9seWdvbiBwb2ludHM9IjEyLDQgMTMuOSw5LjQgMTkuNiw5LjUgMTUsMTMgMTYuNywxOC41IDEyLDE1LjIgNy4zLDE4LjUgOSwxMyA0LjQsOS41IDEwLjEsOS40IiBmaWxsPSIjRkFGRkM3IiBzdHJva2U9IiNGQUZGQzciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==') 12 12, pointer !important;
    }
    .video-card-hover:hover {
      box-shadow: 0 0 80px var(--color-border-flat) !important;
    }
    .featured-btn-primary:hover {
      box-shadow: 0 0 24px rgba(242, 167, 196, 0.6) !important;
      transform: translateY(-2px);
    }
    .featured-btn-secondary:hover {
      border-color: rgba(147, 197, 253, 0.8) !important;
      box-shadow: 0 0 15px rgba(147, 197, 253, 0.15) inset, 0 0 15px rgba(147, 197, 253, 0.15) !important;
    }
    .btn-shine {
      background: linear-gradient(90deg, var(--color-pink) 0%, var(--color-lemon) 50%, var(--color-pink) 100%);
      background-size: 200% auto;
      animation: shine 4s linear infinite;
      color: #111111;
      border: none;
    }
    @keyframes marquee-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: flex;
      width: fit-content;
      animation: marquee-scroll 40s linear infinite;
    }
    .marquee-text {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(3rem, 10vw, 7rem);
      font-weight: 700;
      text-transform: uppercase;
      color: rgba(147, 197, 253, 0.15);
      letter-spacing: 0.05em;
      padding-right: 2rem;
      white-space: nowrap;
      text-shadow: 0 0 18px rgba(147, 197, 253, 0.35), 0 0 40px rgba(147, 197, 253, 0.15);
    }
    @media (max-width: 640px) {
      .featured-buttons-container {
        flex-direction: column !important;
      }
    }
    .liquid-target {
      will-change: filter;
    }
    @media (max-width: 640px) {
      .hero-girl { width: 120px !important; height: 120px !important; }
    }
    @keyframes shine {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .role-shine {
      background: linear-gradient(
        105deg,
        #c97fa0 0%,
        var(--color-pink) 30%,
        #fff8e7 48%,
        #fffde0 52%,
        var(--color-pink) 70%,
        var(--color-lemon) 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      animation: shine 3.6s linear infinite;
      letter-spacing: 0.22em;
    }
    .photo-card-outer {
      flex-shrink: 0;
    }
    .testimonial-slider-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 380px;
      width: 100%;
    }
    .testimonial-nav-btn {
      position: absolute;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #FFF;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 20;
      transition: all 0.3s ease;
    }
    .testimonial-nav-btn:hover {
      background: rgba(242, 167, 196, 0.1);
      border-color: var(--color-pink);
    }
    .testimonial-nav-btn-left {
      left: 0;
    }
    .testimonial-nav-btn-right {
      right: 0;
    }
    .testimonial-mobile-nav {
      display: none;
    }
    .testimonial-card-main {
      width: 100%;
      max-width: 600px;
      background: var(--color-surface-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 32px 40px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .testimonial-text-swap {
      position: relative;
      overflow: hidden;
      min-height: 85px;
      width: 100%;
    }
    .default-teaser {
      position: relative;
      display: block;
      transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.5s ease;
    }
    .alternate-quote {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 100%);
      width: 100%;
      max-width: 460px;
      transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.5s ease;
      opacity: 0;
      color: var(--color-pink);
      font-family: 'Sora', sans-serif;
      font-style: italic;
      font-size: 20px;
      line-height: 1.5;
    }
    .testimonial-card-main:hover .default-teaser {
      transform: translateY(-100%);
      opacity: 0;
    }
    .testimonial-card-main:hover .alternate-quote {
      transform: translate(-50%, 0);
      opacity: 1;
    }

    @media (max-width: 768px) {
      .testimonial-slider-container {
        flex-direction: column;
        min-height: auto;
        gap: 24px;
      }
      .testimonial-slider-container > .testimonial-nav-btn {
        display: none;
      }
      .testimonial-mobile-nav {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 16px;
      }
      .testimonial-mobile-nav .testimonial-nav-btn {
        position: static;
        display: flex;
      }
      .testimonial-card-main {
        padding: 24px 20px;
        max-width: 100%;
      }
      .alternate-quote {
        font-size: 17px !important;
      }
      .testimonial-text-swap {
        min-height: 100px;
      }
    }
    .constellation-svg { pointer-events: all; }
    @media (hover: none) { .constellation-svg { pointer-events: none; } }
    .c-line {
      stroke-width: 0.6;
      opacity: 0.07;
      filter: none;
      transition: none;
    }
    .c-node {
      opacity: 0.3;
      filter: none;
      stroke: var(--node-color, white);
      stroke-width: 0;
      transition: none;
    }

    .live-grain {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.04;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
    @media (max-width: 800px) {
      .case-grid {
        grid-template-columns: 1fr !important;
      }
    }

    /* Method Study horizontal scroll */
    .method-study-track::-webkit-scrollbar { display: none; }

    /* Testimonials infinite scroll */
    .testimonial-scroll-outer {
      position: relative;
    }
    .testimonial-scroll-outer::before,
    .testimonial-scroll-outer::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 80px;
      z-index: 2;
      pointer-events: none;
    }
    .testimonial-scroll-outer::before {
      left: 0;
      background: linear-gradient(to right, var(--color-bg), transparent);
    }
    .testimonial-scroll-outer::after {
      right: 0;
      background: linear-gradient(to left, var(--color-bg), transparent);
    }
    .testimonial-track {
      display: flex;
      gap: 24px;
      overflow-x: scroll;
      scroll-behavior: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
      cursor: grab;
    }
    .testimonial-track::-webkit-scrollbar {
      display: none;
    }
    .testimonial-track:active {
      cursor: grabbing;
    }
    .testimonial-card {
      flex-shrink: 0;
      width: 380px;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(250,255,199,0.08);
      border-color: var(--color-pink) !important;
    }
    .testimonial-card:hover .testimonial-sticky {
      transform: translateY(0%);
    }
    .testimonial-sticky {
      transform: translateY(100%);
      transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
    }
    @media (prefers-reduced-motion: reduce) {
      .testimonial-sticky {
        transform: translateY(0%) !important;
        transition: none !important;
        opacity: 1 !important;
      }
    }

    @keyframes scroll-bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
      50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
    }
    .scroll-indicator {
      position: absolute;
      bottom: 36px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      animation: scroll-bounce 1.6s ease-in-out infinite;
      opacity: 0.4;
    }

    @media (prefers-reduced-motion: no-preference) {
      @keyframes girl-bob {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-2px); }
      }
      .hero-girl-bob {
        animation: girl-bob 1.5s ease-in-out infinite;
      }
    }

    /* Hero phase 0 — full-bleed portrait + left text column */
    .hero-text-col {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      padding-left: clamp(48px, 9vw, 120px);
      max-width: 46vw;
    }
    .hero-portrait-wrap {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 48vw;
      z-index: 1;
      -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.85) 32%, black 45%);
      mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.85) 32%, black 45%);
    }
    .hero-portrait-top-fade {
      width: 100%;
      height: 100%;
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%);
      mask-image: linear-gradient(to bottom, transparent 0%, black 8%);
    }
    .hero-portrait-img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 15%;
    }
    .hero-stats-inline {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
    }

    @media (max-width: 900px) {
      .hero-landing-panel {
        align-items: flex-end !important;
        justify-content: flex-end !important;
        padding-bottom: 40px !important;
      }
      .hero-text-col {
        max-width: 100% !important;
        padding: 0 24px !important;
      }
      .hero-portrait-wrap {
        left: 0 !important;
        width: 100% !important;
        height: 45vh !important;
        -webkit-mask-image: linear-gradient(to top, transparent 0%, black 30%) !important;
        mask-image: linear-gradient(to top, transparent 0%, black 30%) !important;
      }
      .hero-portrait-top-fade {
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }
      .hero-portrait-img {
        object-position: center top !important;
      }
      .hero-buttons-row {
        flex-direction: column !important;
        width: 100% !important;
      }
      .hero-buttons-row button,
      .hero-buttons-row a {
        width: 100% !important;
        justify-content: center !important;
      }
    }

    /* ── Meet Me section ── */
    .meetme-layout {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 clamp(32px, 6vw, 80px);
      gap: 7%;
      box-sizing: border-box;
    }
    .meetme-copy {
      flex: 0 0 38%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .meetme-headline {
      font-family: 'Sora', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: clamp(1.2rem, 2vw, 2rem);
      color: rgba(232,228,201,0.70);
      line-height: 1.6;
      margin: 0;
      letter-spacing: 0.01em;
    }
    .meetme-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(0.8rem, 1.05vw, 0.95rem);
      color: rgba(232,228,201,0.55);
      margin: 24px 0 0;
      font-weight: 400;
      line-height: 1.55;
    }
    .meetme-buttons {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 12px;
      margin-top: 32px;
    }
    .meetme-linkedin {
      display: inline-block;
      margin-top: 14px;
      margin-left: 5px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      color: rgba(232,228,201,0.5);
      text-decoration: none;
      letter-spacing: 0.03em;
    }
    .meetme-linkedin:hover { text-decoration: underline; }
    .meetme-linkedin:focus-visible { outline: 2px solid rgba(232,228,201,0.6); outline-offset: 2px; border-radius: 2px; }
    .meetme-video-col {
      flex: 0 0 55%;
      position: relative;
    }
    .meetme-glow {
      position: absolute;
      inset: -100px;
      background: radial-gradient(ellipse at center, rgba(242,237,203,0.10) 0%, transparent 65%);
      pointer-events: none;
      z-index: 0;
      transition: opacity 800ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .meetme-glow.playing { opacity: 1.15; }
    .meetme-frame {
      position: relative;
      z-index: 1;
      border: 1px solid rgba(232,228,201,0.2);
      border-radius: 14px;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      background: #000;
    }
    .meetme-frame img,
    .meetme-frame iframe {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
      object-fit: cover;
    }
    .meetme-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #E8E4C9;
      opacity: 0.5;
      z-index: 3;
      pointer-events: none;
    }
    .meetme-dot-tl { top: -9px;    left: -9px;  }
    .meetme-dot-tr { top: -9px;    right: -9px; }
    .meetme-dot-bl { bottom: -9px; left: -9px;  }
    .meetme-dot-br { bottom: -9px; right: -9px; }
    .meetme-play {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 56px; height: 56px;
      border-radius: 50%;
      border: 1px solid rgba(232,228,201,0.4);
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      z-index: 3;
      transition: border-color 300ms ease, box-shadow 300ms ease;
    }
    .meetme-play:hover {
      border-color: rgba(232,228,201,0.7);
      box-shadow: 0 0 20px rgba(242,237,203,0.12);
    }
    .meetme-play:focus-visible {
      outline: 2px solid rgba(232,228,201,0.65);
      outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
      .meetme-glow { transition: none !important; }
    }
    @media (max-width: 900px) {
      .meetme-layout {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 24px;
        gap: 28px;
      }
      .meetme-copy { flex: 0 0 auto; width: 100%; order: 2; }
      .meetme-video-col { flex: 0 0 auto; width: 100%; order: 1; }
      .meetme-glow { inset: -55px; }
      .meetme-buttons { flex-direction: column; width: 100%; }
      .meetme-buttons button,
      .meetme-buttons a { width: 100%; justify-content: center !important; }
    }

    /* Coming Soon section animations */
    @keyframes signal-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.1; }
    }
    @keyframes freq-pulse {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(1.6); }
    }
    @media (prefers-reduced-motion: reduce) {
      .freq-bar { animation: none !important; }
      .signal-dot { animation: none !important; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes hp-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }


    @keyframes star-blink {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.04; }
    }
    .star-blink {
      animation: star-blink 3s ease-in-out infinite;
    }

    /* Contact section — input focus glow */
    .contact-input:focus,
    .contact-textarea:focus {
      border-color: rgba(242,167,196,0.5) !important;
      box-shadow: 0 0 0 3px rgba(242,167,196,0.08) !important;
    }

    /* Contact section — placeholder color */
    .contact-grid input::placeholder,
    .contact-grid textarea::placeholder {
      color: rgba(255,255,255,0.22);
    }

    /* Contact section — mobile layout */
    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr !important;
      }
      .contact-left {
        min-height: 280px !important;
        border-radius: 16px 16px 0 0 !important;
      }
      .contact-left img {
        width: 100px !important;
      }
      .contact-right {
        border-radius: 0 0 16px 16px !important;
        padding: 32px 24px !important;
      }
    }

    /* About section — grid areas (desktop) */
    .about-section { justify-items: start; }
    .about-role-badge { grid-area: role; z-index: 1; }
    .about-name-block { grid-area: name; z-index: 1; }
    .about-tagline    { grid-area: tagline; z-index: 1; }
    .about-stats      { grid-area: stats; z-index: 1; }
    .about-ctas       { grid-area: ctas; z-index: 1; }
    .about-section .photo-card-outer { grid-area: photo; align-self: center; z-index: 1; }

    /* About section — mobile responsive */
    @media (max-width: 768px) {
      .about-section {
        grid-template-columns: 1fr !important;
        grid-template-areas: "role" "name" "photo" "tagline" "stats" "ctas" !important;
        padding: 60px 24px 80px !important;
        row-gap: 0 !important;
        column-gap: 0 !important;
        justify-items: center !important;
        text-align: center;
      }
      .about-name-block {
        margin-left: 0 !important;
        align-items: center !important;
        width: 100% !important;
      }
      .about-tagline {
        text-align: center !important;
        max-width: 100% !important;
        margin-bottom: 28px !important;
      }
      .about-stats {
        justify-content: center !important;
      }
      .about-ctas {
        justify-content: center !important;
        width: 100% !important;
      }
      .about-ctas button {
        flex: 1 1 0 !important;
        min-width: 0 !important;
        font-size: clamp(13px, 3.5vw, 15px) !important;
        padding: 14px 20px !important;
      }
      .about-section .photo-card-outer {
        justify-self: center !important;
        transform: rotate(2deg) !important;
        margin-top: 12px;
        margin-bottom: 20px;
      }
      .about-section .photo-card-outer > div:first-child {
        width: clamp(160px, 55vw, 240px) !important;
      }
    }


    /* Coming soon card */
    @media (max-width: 640px) {
      .coming-soon-card {
        padding: 28px 20px !important;
      }
      .coming-soon-top-row {
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
    }

    /* Nav hover text swap — mirrors hover-text-swap.html exactly */
    .nav-swap {
      display: inline-block;
      position: relative;
      height: 22px;
      line-height: 22px;
      overflow: hidden;
      background: none;
      border: none;
      padding: 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .nav-swap .ns-default {
      display: block;
      color: var(--color-sky);
      transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1), color 0.3s ease;
    }
    .nav-swap .ns-alt {
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      font-family: 'Sora', sans-serif;
      font-style: italic;
      font-weight: 400;
      font-size: 13px;
      letter-spacing: 0.04em;
      text-transform: none;
      color: var(--color-pink);
      transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
      white-space: nowrap;
    }
    .nav-swap:hover .ns-default {
      transform: translateY(-100%);
      color: var(--color-pink);
    }
    .nav-swap:hover .ns-alt {
      transform: translateY(-100%);
    }

    /* Overlay nav swap — same mechanic, big text */
    .overlay-swap {
      position: relative;
      overflow: visible;
      height: 1.1em;
      clip-path: inset(-20% -100% 0 -100%);
    }
    .overlay-swap .os-default {
      display: block;
      transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1), color 0.3s ease;
    }
    .overlay-swap .os-alt {
      display: block;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Sora', sans-serif;
      font-style: italic;
      font-weight: 400;
      color: var(--color-pink);
      letter-spacing: 0.01em;
      transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
      white-space: nowrap;
    }
    .overlay-swap:hover .os-default {
      transform: translateY(-100%);
      color: var(--color-pink);
    }
    .overlay-swap:hover .os-alt {
      transform: translateX(-50%) translateY(-100%);
    }
  `}</style>
));

function HorizontalScrollSection({
  siteReady, meetmeVideoPlaying, setMeetmeVideoPlaying, heroStarLayerRef,
}: {
  siteReady: boolean;
  meetmeVideoPlaying: boolean;
  setMeetmeVideoPlaying: (v: boolean) => void;
  heroStarLayerRef: React.RefObject<SVGGElement | null>;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    let sectionTop = outer.getBoundingClientRect().top + window.scrollY;

    const update = () => {
      const localScroll = window.scrollY - sectionTop;
      const maxScroll = window.innerHeight;
      const p = Math.max(0, Math.min(1, localScroll / maxScroll));
      track.style.transform = `translateX(${-p * window.innerWidth}px)`;
      const dot = Math.round(p);
      setActiveDot(prev => prev === dot ? prev : dot);
    };

    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; update(); });
    };
    const onResize = () => {
      sectionTop = outer.getBoundingClientRect().top + window.scrollY;
      update();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    update();

    const obs = new IntersectionObserver(([entry]) => {
      if (track) track.style.willChange = entry.isIntersecting ? 'transform' : 'auto';
    });
    obs.observe(outer);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      obs.disconnect();
    };
  }, [isMobile]);

  const hpAnim = (delay: number): React.CSSProperties => ({
    animation: `hp-fade-up 0.7s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
    animationPlayState: siteReady ? 'running' : 'paused',
  });

  const heroBg = (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }} aria-hidden="true">
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" /><stop offset="55%" stopColor="#000000" /><stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <radialGradient id="moonGlow">
              <stop offset="0%" stopColor="#EDE5D8" stopOpacity="0.18" /><stop offset="100%" stopColor="#EDE5D8" stopOpacity="0" />
            </radialGradient>
            <mask id="crescentMask">
              <rect x="0" y="0" width="800" height="500" fill="white" />
              <circle cx="89.6%" cy="22%" r="24" fill="black" />
            </mask>
            <filter id="northStarGlow" x="-500%" y="-500%" width="1100%" height="1100%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="starSoft"><feGaussianBlur stdDeviation="1.2" /></filter>
          </defs>
          <rect width="800" height="500" fill="url(#skyGrad)" />
          <g ref={heroStarLayerRef} style={{ willChange: "transform" }}>
            <g fill="#ffffff">
              {BACKGROUND_STARS.map(star => (
                <circle key={`bg-star-${star.id}`} cx={star.x + "%"} cy={star.y + "%"} r={star.r} opacity={0.3}>
                  <animate attributeName="opacity" values="0.1;0.7;0.1" dur={`${star.dur}s`} begin={`${star.delay}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
            <g fill="#ffffff">
              {Array.from({ length: 100 }, (_, i) => (
                <circle key={`us-${i}`}
                  cx={((Math.abs(Math.sin(i * 317.4 + 521.9) * 43758.5453)) % 100) + "%"}
                  cy={((Math.abs(Math.sin(i * 193.7 + 47.3) * 43758.5453)) % 30) + "%"}
                  r={(Math.abs(Math.sin(i * 89.1)) % 0.5) + 0.2} opacity={0.6}
                />
              ))}
            </g>
            <g fill="#ffffff">
              {Array.from({ length: 200 }, (_, i) => (
                <circle key={`ts-${i}`}
                  cx={((Math.abs(Math.sin(i * 431.7 + 219.3) * 43758.5453)) % 100) + "%"}
                  cy={((Math.abs(Math.sin(i * 157.9 + 83.1) * 43758.5453)) % 50) + "%"}
                  r={(Math.abs(Math.sin(i * 61.3)) % 0.4) + 0.15} opacity={0.5}
                />
              ))}
            </g>
            {HERO_CONSTELLATIONS.map((cluster, ci) => (
              <g key={`cluster-${ci}`}>
                {cluster.edges.map(([a, b], ei) => (
                  <line key={`cl-${ci}-${ei}`} x1={cluster.nodes[a][0] + "%"} y1={cluster.nodes[a][1] + "%"} x2={cluster.nodes[b][0] + "%"} y2={cluster.nodes[b][1] + "%"} stroke="#E8E4C9" strokeWidth="1" opacity={cluster.opacity} />
                ))}
                {cluster.nodes.map(([nx, ny], ni) => (
                  <circle key={`cn-${ci}-${ni}`} cx={nx + "%"} cy={ny + "%"} r={1.5} fill="#E8E4C9" opacity={0.3 + (ci * 0.05)} />
                ))}
              </g>
            ))}
          </g>
          <circle cx="86.6%" cy="22%" r="64" fill="url(#moonGlow)" />
          <circle cx="86.6%" cy="22%" r="24" fill="#EDE5D8" opacity="0.85" mask="url(#crescentMask)" />
        </svg>
      </div>
    </div>
  );

  const panelStyle = (extra: React.CSSProperties = {}): React.CSSProperties =>
    isMobile
      ? { width: '100vw', position: 'relative', ...extra }
      : { width: '100vw', height: '100vh', flexShrink: 0, position: 'relative', ...extra };

  const panel1 = (
    <div tabIndex={0} aria-label="Hero" style={panelStyle({ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100vh' : undefined })}>
      {heroBg}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="hero-landing-panel" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div className="hero-portrait-wrap" style={{ opacity: siteReady ? 1 : 0, transition: 'opacity 1s cubic-bezier(0.22,1,0.36,1) 0.05s' }}>
            <div className="hero-portrait-top-fade">
              <img src={profileImg} alt="Vishvara Gandharv, product designer" className="hero-portrait-img" />
            </div>
          </div>
          <div className="hero-text-col">
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: "0.22em", color: "rgba(242,237,203,0.6)", textTransform: "uppercase", display: "block", ...hpAnim(0.1) }}>
              PRODUCT DESIGNER
            </span>
            <div style={{ marginTop: 12, ...hpAnim(0.18) }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "clamp(3rem, 5.4vw, 4.86rem)", color: "var(--color-pink)", letterSpacing: "-0.02em", lineHeight: 1.1, display: "block" }}>
                Vishvara.G
              </span>
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontStyle: "italic", fontSize: "clamp(0.85rem, 1.2vw, 1rem)", color: "rgba(242,237,203,0.55)", marginTop: 20, marginBottom: 0, ...hpAnim(0.26) }}>
              Designing for the humans behind the metrics.
            </p>
            <div className="hero-stats-inline" style={{ marginTop: 24, ...hpAnim(0.34) }}>
              <span style={{ color: "rgba(242,237,203,0.9)" }}>3</span><span style={{ color: "rgba(242,237,203,0.45)" }}> PROJECTS</span>
              <span style={{ color: "rgba(242,237,203,0.25)" }}> Â· </span>
              <span style={{ color: "rgba(242,237,203,0.9)" }}>2</span><span style={{ color: "rgba(242,237,203,0.45)" }}> DOMAINS</span>
              <span style={{ color: "rgba(242,237,203,0.25)" }}> Â· </span>
              <span style={{ color: "rgba(242,237,203,0.9)" }}>6</span><span style={{ color: "rgba(242,237,203,0.45)" }}> MONTHS</span>
            </div>
            <div className="hero-buttons-row" style={{ display: "flex", flexDirection: "row", gap: 12, marginTop: 28, ...hpAnim(0.42) }}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: "linear-gradient(135deg, var(--color-pink), #F2EDCB)", color: "#111", borderRadius: 9999, padding: "13px 28px", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", cursor: "pointer" }}>
                Contact Me
              </button>
              <a href="/Vishvara_Gandharv_Resume.pdf" download style={{ background: "transparent", border: "1px solid rgba(242,237,203,0.35)", color: "#F2EDCB", borderRadius: 9999, padding: "13px 28px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, letterSpacing: "0.06em", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const panel2 = (
    <div tabIndex={0} aria-label="Meet Me" style={panelStyle({ height: isMobile ? 'auto' : '100vh' })}>
      <div style={{ position: isMobile ? 'relative' : 'absolute', inset: 0, display: 'flex', alignItems: 'center', height: isMobile ? 'auto' : '100%' }}>
        <div className="meetme-layout">
          <div className="meetme-copy">
            <h2 className="meetme-headline">I don't design frictionless,<br />I design to navigate<br />the friction.</h2>
            <p className="meetme-sub">Open to product design roles globally.</p>
            <div className="meetme-buttons">
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: "linear-gradient(135deg, var(--color-pink), #F2EDCB)", color: "#111", borderRadius: 9999, padding: "13px 28px", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", cursor: "pointer" }}>Contact Me</button>
              <a href="/Vishvara_Gandharv_Resume.pdf" download style={{ background: "transparent", border: "1px solid rgba(232,228,201,0.35)", color: "#E8E4C9", borderRadius: 9999, padding: "13px 28px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, letterSpacing: "0.06em", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Download Resume</a>
            </div>
          </div>
          <div className="meetme-video-col">
            <div aria-hidden className={`meetme-glow${meetmeVideoPlaying ? " playing" : ""}`} />
            <div className="meetme-frame">
              <div className="meetme-dot meetme-dot-tl" aria-hidden /><div className="meetme-dot meetme-dot-tr" aria-hidden />
              <div className="meetme-dot meetme-dot-bl" aria-hidden /><div className="meetme-dot meetme-dot-br" aria-hidden />
              {meetmeVideoPlaying ? (
                <iframe src="https://www.youtube-nocookie.com/embed/CGPjBUCOn2M?autoplay=1&controls=1&rel=0&modestbranding=1" title="Introduction video — Vishvara Gandharv" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              ) : (
                <>
                  <img src="https://img.youtube.com/vi/CGPjBUCOn2M/maxresdefault.jpg" alt="Video thumbnail" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <button className="meetme-play" aria-label="Play introduction video" onClick={() => setMeetmeVideoPlaying(true)}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden><polygon points="5,2 16,9 5,16" fill="#E8E4C9" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return <>{panel1}{panel2}</>;
  }

  return (
    <div ref={outerRef} style={{ height: '200vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div ref={trackRef} style={{ display: 'flex', width: '200vw', height: '100vh' }}>
          {panel1}{panel2}
        </div>
        <div aria-hidden style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 50 }}>
          {[0,1].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8E4C9', opacity: activeDot === i ? 1 : 0.2, transition: 'opacity 0.3s ease' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const heroStarLayerRef = useRef<SVGGElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navBtnHovered, setNavBtnHovered] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showFullCaseStudy, setShowFullCaseStudy] = useState(false);
  const [showMurmurCaseStudy, setShowMurmurCaseStudy] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactFocused, setContactFocused] = useState(false);
  const [meetmeVideoPlaying, setMeetmeVideoPlaying] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const emailInput = formRef.current.querySelector<HTMLInputElement>('input[name="from_email"]');
    if (emailInput && !validateEmail(emailInput.value)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    const msgInput = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    if (msgInput) {
      const msg = msgInput.value.trim();
      if (msg.length < 20) {
        setMessageError("Please write at least a sentence — 20 characters minimum.");
        return;
      }
      const words = msg.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      if (words.length >= 4) {
        const counts: Record<string, number> = {};
        for (const w of words) counts[w] = (counts[w] || 0) + 1;
        const maxFreq = Math.max(...Object.values(counts));
        if (maxFreq / words.length > 0.45) {
          setMessageError("Message looks repetitive. Tell me what's on your mind.");
          return;
        }
      }
    }
    setMessageError("");
    setFormStatus("sending");

    emailjs
      .sendForm("service_portfolio", "template_portfolio", formRef.current, "Nke3KeO0cDGhmg4zo")
      .then(() => {
        setFormStatus("sent");
        formRef.current?.reset();
        setTimeout(() => setFormStatus("idle"), 4000);
      })
      .catch(() => setFormStatus("error"));
  };


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!glowRef.current) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 1.5)));
      const spread = progress * 180;
      const opacity = progress * 0.97;
      glowRef.current.style.background = `radial-gradient(circle ${spread}% at 50% 28%, rgba(255,253,224,${opacity}) 0%, rgba(255,220,120,${opacity * 0.5}) 45%, rgba(255,253,224,0) 100%)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!siteReady) return;
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchstart', cancel, { passive: true, once: true });
    window.addEventListener('keydown', cancel, { once: true });

    const timer = setTimeout(() => {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
      if (cancelled) return;
      const aboutEl = document.getElementById('about');
      if (!aboutEl) return;
      const start = window.scrollY;
      const target = aboutEl.getBoundingClientRect().top + window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 1) return;
      const duration = 900;
      const startTime = performance.now();
      const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, start + distance * ease(progress));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [siteReady]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ('ontouchstart' in window) return;
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      applyParallax();
    };
    const applyParallax = () => {
      const scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
      const tx = mouseX * 8;
      const ty = mouseY * 8 + scrollProgress * -30;
      const hero = heroStarLayerRef.current;
      if (hero) hero.style.transform = `translate(${tx}px, ${ty}px)`;
    };
    const onScroll = () => applyParallax();
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);



  return (
    <>
      <div id="skew-container" style={{ transformOrigin: "center center", willChange: "transform" }}>

      <GlobalStyles />

      {/* Global Live Animated Grain Overlay */}
      <div className="live-grain" aria-hidden="true" style={{ display: "none" }} />

      {/* Global Fixed Star Field — one render, visible across all sections */}
      <svg
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 750 }).map((_, i) => {
          const cx = (Math.abs(Math.sin(i * 12.9898 + 1.5) * 43758.5453) % 100) + "%";
          const cy = (Math.abs(Math.sin(i * 78.233 + 2.1) * 43758.5453) % 100) + "%";
          // 3 strict sizes — more small, fewer large for a natural sky
          const r = i < 375 ? 0.5 : i < 625 ? 1.0 : 2.0;
          const fill = i % 3 === 0 ? "var(--color-lemon)" : i % 5 === 0 ? "#FFF" : "var(--color-pink)";
          // Even index = static, odd index = blinking (~375 each)
          const isBlinking = i % 2 === 1;
          const delay = ((i * 11) % 50) / 10 + "s";
          const dur = (2.5 + ((i * 7) % 30) / 10).toFixed(1) + "s";
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={fill}
              opacity={0.55}
              className={isBlinking ? "star-blink" : undefined}
              style={isBlinking ? { animationDelay: delay, animationDuration: dur } : undefined}
            />
          );
        })}
      </svg>

      {/* Scroll glow overlay */}
      <div ref={glowRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 8 }} />

      {/* Hero + Meet Me horizontal scroll (200vh) */}
      <HorizontalScrollSection
        siteReady={siteReady}
        meetmeVideoPlaying={meetmeVideoPlaying}
        setMeetmeVideoPlaying={setMeetmeVideoPlaying}
        heroStarLayerRef={heroStarLayerRef}
      />

      {/* Design Lens — scroll-driven depth animation */}
      <div id="design-lens"><DesignLensSection /></div>

      {/* Designer Mind */}
      <div id="designers-mind" style={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 28, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9C4B8', opacity: 0.35, marginBottom: 24, userSelect: 'none' }}>
          I think in systems
        </div>
        <DesignerMind />
      </div>

      {/* CASE STUDIES + SIGNALS — 500 extra stars behind */}
      <div style={{ position: 'relative' }}>
        <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
          {Array.from({ length: 500 }).map((_, i) => {
            const cx = (Math.abs(Math.sin(i * 37.1247 + 9.2) * 43758.5453) % 100) + '%';
            const cy = (Math.abs(Math.sin(i * 61.453  + 4.8) * 43758.5453) % 100) + '%';
            const r  = i < 300 ? 0.5 : i < 460 ? 1.0 : 1.5;
            const fill = i % 5 === 0 ? 'var(--color-lemon)' : i % 9 === 0 ? 'var(--color-pink)' : '#FFF';
            const isBlinking = i < 200;
            const delay = ((i * 17) % 50) / 10 + 's';
            const dur   = (2.0 + ((i * 9) % 35) / 10).toFixed(1) + 's';
            return (
              <circle key={`cs-star-${i}`} cx={cx} cy={cy} r={r} fill={fill} opacity={0.5}
                className={isBlinking ? 'star-blink' : undefined}
                style={isBlinking ? { animationDelay: delay, animationDuration: dur } : undefined}
              />
            );
          })}
        </svg>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ConstellationCaseStudies
            caseStudiesData={caseStudiesData}
            murmurBannerUrl={murmurBannerUrl}
            onMargdarshakOpen={() => { setActiveTab(0); setShowFullCaseStudy(true); }}
            onMurmurOpen={() => { setActiveTab(1); setShowMurmurCaseStudy(true); }}
          />
          <p style={{
            fontFamily:"'Sora',sans-serif", fontWeight:300,
            fontSize:28, color:'#C9C4B8', opacity:0.35,
            letterSpacing:'0.22em', textAlign:'center', margin:'0',
          }}>Who shaped how I think, and what I'm making of it.</p>
          <SignalsSection />
        </div>
      </div>

      <div id="outside-work"><OutsideWork /></div>


      {/* ── CONTACT SECTION ── */}
      <section
        id="contact"
        className="section"
        style={{
          position: "relative",
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          alignItems: "stretch",
        }}
          className="contact-grid"
        >

          {/* ── LEFT COLUMN — ILLUSTRATION POSTCARD ── */}
          <div
            style={{
              position: "relative",
              minHeight: "560px",
              borderRadius: "16px 0 0 16px",
              overflow: "hidden",
            }}
            className="contact-left"
          >
            {/* Hero SVG landscape — static, no animations */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            >
              <defs>
                <linearGradient id="cs-skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="55%" stopColor="#000000" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <radialGradient id="cs-moonGlow">
                  <stop offset="0%" stopColor="#F8F3EC" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#F8F3EC" stopOpacity="0" />
                </radialGradient>
                <mask id="cs-crescentMask">
                  <rect x="0" y="0" width="800" height="500" fill="white" />
                  <circle cx="500" cy="118" r="10" fill="black" />
                </mask>
                <filter id="cs-blur80">
                  <feGaussianBlur stdDeviation="80" />
                </filter>
              </defs>
              <rect width="800" height="500" fill="url(#cs-skyGrad)" />
              <circle cx="150" cy="180" r="160" fill="var(--color-pink)" opacity="0.02" filter="url(#cs-blur80)" />
              <circle cx="650" cy="160" r="180" fill="#6D1F2A" opacity="0.034" filter="url(#cs-blur80)" />
              {/* Static background stars — 50 across the sky */}
              <g fill="#ffffff">
                {BACKGROUND_STARS.slice(0, 50).map(star => (
                  <circle key={`cs-star-${star.id}`} cx={star.x + "%"} cy={star.y * 0.7 + "%"} r={star.r} opacity={0.55} />
                ))}
              </g>
              <circle cx="500" cy="118" r="30" fill="url(#cs-moonGlow)" />
              <circle cx="510" cy="118" r="10" fill="#F8F3EC" mask="url(#cs-crescentMask)" />

              {/* Far hill */}
              <path d="M-10 500 L-10 455 Q200 440 400 448 Q540 454 620 445 Q700 438 810 448 L810 500 Z" fill="#1C1C1C" />

              {/* Tiny hut — on far hill, within visible SVG area (x≈580) */}
              <g transform="translate(510, 422) scale(0.85)">
                <circle cx="24" cy="8"  r="1.4" fill="#D8D6D2" opacity="0.3" />
                <circle cx="26" cy="4"  r="1.8" fill="#D8D6D2" opacity="0.2" />
                <rect x="22" y="10" width="4" height="7" fill="#463328" />
                <path d="M8 22 L24 10 L40 22 Z" fill="#2E1E12" />
                <rect x="10" y="21" width="28" height="18" rx="1" fill="#4A3526" />
                <rect x="19" y="28" width="8" height="11" rx="1" fill="#1E120A" />
                <rect x="12" y="27" width="5" height="5" fill="#EACD8A" opacity="0.8" />
                <rect x="31" y="27" width="5" height="5" fill="#EACD8A" opacity="0.8" />
              </g>

              {/* Near hill — girl stands on this */}
              <path d="M-10 500 L-10 478 Q200 468 400 474 Q580 480 810 472 L810 500 Z" fill="#111111" />
            </svg>

            {/* Subtle dark overlay that lifts when form is focused */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.15)",
                opacity: contactFocused ? 0 : 1,
                transition: "opacity 0.6s ease",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {/* Pre-lit static constellations */}
            <svg
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
            >
              {/* Cluster 1 — top-left ~20%, 25% */}
              <g filter="drop-shadow(0 0 6px var(--color-pink))">
                <line x1="18%" y1="22%" x2="23%" y2="28%" stroke="var(--color-pink)" strokeWidth="0.8" opacity="0.45" />
                <line x1="23%" y1="28%" x2="20%" y2="32%" stroke="var(--color-pink)" strokeWidth="0.8" opacity="0.45" />
                <line x1="20%" y1="32%" x2="26%" y2="30%" stroke="var(--color-pink)" strokeWidth="0.8" opacity="0.45" />
                <circle cx="18%" cy="22%" r="2.5" fill="var(--color-pink)" opacity="0.9" />
                <circle cx="23%" cy="28%" r="2.5" fill="var(--color-pink)" opacity="0.9" />
                <circle cx="20%" cy="32%" r="2.5" fill="var(--color-pink)" opacity="0.9" />
                <circle cx="26%" cy="30%" r="2.5" fill="var(--color-pink)" opacity="0.9" />
              </g>
              {/* Cluster 2 — center ~48%, 20% */}
              <g filter="drop-shadow(0 0 5px var(--color-lemon))">
                <line x1="45%" y1="18%" x2="50%" y2="22%" stroke="var(--color-lemon)" strokeWidth="0.7" opacity="0.4" />
                <line x1="50%" y1="22%" x2="47%" y2="26%" stroke="var(--color-lemon)" strokeWidth="0.7" opacity="0.4" />
                <line x1="50%" y1="22%" x2="53%" y2="19%" stroke="var(--color-lemon)" strokeWidth="0.7" opacity="0.4" />
                <line x1="47%" y1="26%" x2="52%" y2="27%" stroke="var(--color-lemon)" strokeWidth="0.7" opacity="0.4" />
                <circle cx="45%" cy="18%" r="2" fill="var(--color-lemon)" opacity="0.85" />
                <circle cx="50%" cy="22%" r="2" fill="var(--color-lemon)" opacity="0.85" />
                <circle cx="47%" cy="26%" r="2" fill="var(--color-lemon)" opacity="0.85" />
                <circle cx="53%" cy="19%" r="2" fill="var(--color-lemon)" opacity="0.85" />
                <circle cx="52%" cy="27%" r="2" fill="var(--color-lemon)" opacity="0.85" />
              </g>
              {/* Cluster 3 — mid-right ~80%, 38% */}
              <g filter="drop-shadow(0 0 4px var(--color-pink))">
                <line x1="78%" y1="35%" x2="83%" y2="39%" stroke="var(--color-pink)" strokeWidth="0.8" opacity="0.45" />
                <line x1="83%" y1="39%" x2="80%" y2="43%" stroke="var(--color-pink)" strokeWidth="0.8" opacity="0.45" />
                <circle cx="78%" cy="35%" r="2" fill="var(--color-pink)" opacity="0.8" />
                <circle cx="83%" cy="39%" r="2" fill="var(--color-pink)" opacity="0.8" />
                <circle cx="80%" cy="43%" r="2" fill="var(--color-pink)" opacity="0.8" />
              </g>
            </svg>

            {/* Girl PNG */}
            <img
              src={girlImg}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "1%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "140px",
                objectFit: "contain",
                mixBlendMode: "screen",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 3,
              }}
            />


            {/* Postcard address lines — bottom left */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "32px",
                left: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                zIndex: 4,
              }}
            >
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
              }}>TO:</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.12em",
              }}>Friend</span>
            </div>

            {/* 2026 label — top right */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.2em",
                zIndex: 4,
                userSelect: "none",
              }}
            >
              2026
            </span>

            {/* Dashed vertical divider on right edge */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 0,
                top: "10%",
                height: "80%",
                borderRight: "1px dashed var(--color-border-flat)",
                zIndex: 4,
              }}
            />
          </div>

          {/* ── RIGHT COLUMN — FORM ── */}
          <div
            style={{
              background: "#1A1215",
              borderRadius: "0 16px 16px 0",
              padding: "52px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            className="contact-right"
          >
            {/* Section label */}
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.28em",
              textTransform: "uppercase" as const,
              color: "var(--color-pink)",
              opacity: 0.72,
              margin: "0 0 16px 0",
            }}>
              Send a message
            </p>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              color: "white",
              lineHeight: 1.1,
              margin: "0 0 16px 0",
            }}>
              You've made it this far.
            </h2>

            {/* Subheadline */}
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontStyle: "italic",
              fontSize: "1.4rem",
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 36px 0",
            }}>
              Let's talk.
            </p>

            {/* Form */}
            <form ref={formRef} onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <label htmlFor="contact-name" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Your name</label>
              <input
                id="contact-name"
                type="text"
                name="from_name"
                required
                placeholder="Your name"
                onFocus={() => setContactFocused(true)}
                onBlur={() => setContactFocused(false)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(242,167,196,0.12)",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "white",
                  width: "100%",
                  boxSizing: "border-box" as const,
                  outline: "none",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}
                onMouseOver={e => (e.currentTarget.style.borderColor = "rgba(242,167,196,0.5)")}
                onMouseOut={e => (e.currentTarget.style.borderColor = "rgba(242,167,196,0.12)")}
              />

              <label htmlFor="contact-email" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Your email</label>
              <input
                id="contact-email"
                type="email"
                name="from_email"
                required
                placeholder="Your email"
                onFocus={() => setContactFocused(true)}
                onBlur={e => {
                  setContactFocused(false);
                  if (e.currentTarget.value && !validateEmail(e.currentTarget.value)) {
                    setEmailError("Please enter a valid email address.");
                  } else {
                    setEmailError("");
                  }
                }}
                onChange={() => emailError && setEmailError("")}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${emailError ? "rgba(255,100,100,0.5)" : "rgba(242,167,196,0.12)"}`,
                  borderRadius: "10px",
                  padding: "14px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "white",
                  width: "100%",
                  boxSizing: "border-box" as const,
                  outline: "none",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}
                onMouseOver={e => (e.currentTarget.style.borderColor = "rgba(242,167,196,0.5)")}
                onMouseOut={e => (e.currentTarget.style.borderColor = emailError ? "rgba(255,100,100,0.5)" : "rgba(242,167,196,0.12)")}
              />
              {emailError && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,100,100,0.8)",
                  marginTop: "-12px",
                }}>
                  {emailError}
                </span>
              )}

              <label htmlFor="contact-message" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>What's on your mind</label>
              <textarea
                id="contact-message"
                name="message"
                required
                placeholder="What's on your mind"
                onFocus={() => setContactFocused(true)}
                onBlur={() => setContactFocused(false)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(242,167,196,0.12)",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "white",
                  width: "100%",
                  boxSizing: "border-box" as const,
                  outline: "none",
                  height: "120px",
                  resize: "none",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}
                onMouseOver={e => (e.currentTarget.style.borderColor = "rgba(242,167,196,0.5)")}
                onMouseOut={e => (e.currentTarget.style.borderColor = "rgba(242,167,196,0.12)")}
              />

              {messageError && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,100,100,0.8)",
                  marginTop: "-12px",
                }}>
                  {messageError}
                </span>
              )}

              {/* Privacy note */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.08em",
                margin: "4px 0 0 0",
              }}>
                No spam. Just signal.
              </p>

              {/* Submit button or state feedback */}
              {formStatus === "sent" ? (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "var(--color-pink)",
                  textAlign: "center" as const,
                  animation: "fadeIn 0.4s ease forwards",
                  margin: 0,
                }}>
                  Transmission received ✦
                </p>
              ) : formStatus === "error" ? (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "rgba(255,100,100,0.8)",
                  textAlign: "center" as const,
                  margin: 0,
                }}>
                  Something went wrong. Try again.
                </p>
              ) : (
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="btn-shine"
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "none",
                    borderRadius: "10px",
                    color: "#111111",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.06em",
                    cursor: formStatus === "sending" ? "not-allowed" : "pointer",
                    opacity: formStatus === "sending" ? 0.5 : 1,
                    transition: "box-shadow 0.25s, border-color 0.25s",
                  }}
                  onMouseOver={e => {
                    if (formStatus !== "sending") {
                      e.currentTarget.style.boxShadow = "0 0 28px rgba(242,167,196,0.4), 0 0 28px rgba(250,255,199,0.2)";
                      e.currentTarget.style.filter = "brightness(1.08)";
                    }
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                >
                  {formStatus === "sending" ? "Sending…" : "Send it →"}
                </button>
              )}
            </form>

            {/* Quick links */}
            <div style={{ display: "flex", gap: "16px", marginTop: "28px", alignItems: "center", flexWrap: "wrap" as const }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginRight: "4px" }}>
                Or reach me directly:
              </span>
              <a
                href="mailto:vishvara.ux@gmail.com"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "var(--color-sky)",
                  opacity: 0.7,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.textDecoration = "underline"; }}
                onMouseOut={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.textDecoration = "none"; }}
              >
                vishvara.ux@gmail.com
              </a>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px" }}>Â·</span>
              <a
                href="https://www.linkedin.com/in/vishvara-gandharv"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "var(--color-sky)",
                  opacity: 0.7,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.textDecoration = "underline"; }}
                onMouseOut={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.textDecoration = "none"; }}
              >
                LinkedIn
              </a>
            </div>
          </div>

        </div>
      </section>


      </div>


      {/* ── Fixed Hill (stays at bottom of viewport as page scrolls) ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, pointerEvents: "none", zIndex: 15 }}>
        <svg
          viewBox="0 0 800 160"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "clamp(70px, 15vw, 140px)" }}
        >
          <defs>
            <linearGradient id="hillGradFixed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#E8E4C9" stopOpacity="0.3" />
              <stop offset="50%"  stopColor="#E8E4C9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E8E4C9" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <g transform="translate(0,-340)">
            <path fill="url(#hillGradFixed)" d="M0 395 C70 365 150 390 250 410 C360 430 470 380 590 400 C700 420 760 390 800 405 L800 500 L0 500 Z" />
          </g>
        </svg>
      </div>

      {/* ── Floating Nav Trigger (outside skew-container so position:fixed works) ── */}
      <AnimatePresence>
        {(scrolled || navOpen) && (
          <motion.button
            key="nav-trigger"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNavOpen(prev => !prev)}
            onMouseEnter={() => setNavBtnHovered(true)}
            onMouseLeave={() => setNavBtnHovered(false)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 1002,
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: navOpen || navBtnHovered ? "var(--color-lemon)" : "var(--color-pink)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: navOpen || navBtnHovered
                ? "0 2px 12px rgba(250,255,199,0.18)"
                : "0 2px 12px rgba(242,167,196,0.18)",
              transition: "background 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            {navOpen || navBtnHovered ? (
              <img src={starUrl} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
            ) : (
              <svg width="32" height="32" viewBox="0 0 530 530" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="nav-heart-mask" style={{maskType:"alpha"} as React.CSSProperties} maskUnits="userSpaceOnUse" x="0" y="0" width="530" height="530">
                  <rect width="530" height="530" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#nav-heart-mask)">
                  <path d="M161.673 132.598L226.355 48.5822C231.14 42.3253 236.953 37.5405 243.795 34.228C250.634 30.9155 257.719 29.2593 265.05 29.2593C272.378 29.2593 279.447 30.9155 286.256 34.228C293.065 37.5405 298.862 42.3253 303.646 48.5822L368.329 132.598L466.511 165.624C477.185 169.304 485.374 175.582 491.079 184.455C496.784 193.329 499.636 202.939 499.636 213.285C499.636 217.949 498.894 222.788 497.411 227.805C495.924 232.822 493.721 237.49 490.803 241.811L428.417 331.249L430.626 426.759C430.626 440.745 425.473 452.615 415.167 462.369C404.862 472.122 392.867 476.999 379.183 476.999C378.881 476.999 375.233 476.631 368.24 475.895L265.001 447.186L161.883 475.851C159.593 476.248 157.435 476.631 155.407 476.999C153.379 477.367 151.52 477.551 149.831 477.551C135.701 477.551 123.667 472.547 113.73 462.54C103.792 452.536 99.1916 440.425 99.9277 426.207L102.136 331.111L39.1986 241.259C35.9118 236.905 33.617 232.203 32.3141 227.154C31.0149 222.1 30.3652 217.233 30.3652 212.551C30.3652 201.877 33.2029 192.196 38.8784 183.506C44.5538 174.82 52.9418 168.859 64.0423 165.624L161.673 132.598Z" fill="var(--color-lemon)"/>
                </g>
                <path d="M302.131 448.233V246.913H226.495V448.233H302.131ZM264.314 225.942C274.545 225.942 283.313 222.709 290.621 216.243C297.929 209.777 301.583 202 301.583 192.913C301.583 183.825 297.929 176.049 290.621 169.582C283.313 163.117 274.545 159.884 264.314 159.884C253.992 159.884 245.223 163.117 238.007 169.582C230.697 176.049 227.043 183.825 227.043 192.913C227.043 202 230.697 209.777 238.007 216.243C245.223 222.709 253.992 225.942 264.314 225.942Z" fill="var(--color-pink)"/>
                <path d="M267.053 188.718C267.053 188.718 271.707 185.685 275.494 185.841C278.881 185.98 282.728 188.718 282.728 188.718C284.202 188.216 285.14 186.56 285.14 186.56" stroke="#6D1F2A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M254.996 206.02C254.996 206.02 259.65 209.053 263.436 208.897C266.825 208.758 270.671 206.02 270.671 206.02" stroke="#6D1F2A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M258.01 188.718C258.01 188.718 253.355 185.685 249.569 185.841C246.181 185.98 242.335 188.718 242.335 188.718C240.861 188.216 239.923 186.56 239.923 186.56" stroke="#6D1F2A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M264.416 274.935L300.74 247.138C301.135 246.836 301.719 247.105 301.719 247.588V447.657C301.719 447.974 302.052 457 301.719 457L264.039 448.233L226.359 457.5C226.359 457.5 226.359 447.974 226.359 447.657V247.588C226.359 247.105 226.944 246.836 227.339 247.138L263.662 274.935C263.882 275.102 264.196 275.102 264.416 274.935Z" fill="var(--color-pink)" stroke="var(--color-pink)"/>
                <path d="M301.001 247L264.54 273.69" stroke="#6D1F2A" strokeLinecap="round"/>
                <path d="M227.001 247L264.253 273.967" stroke="#6D1F2A" strokeLinecap="round"/>
                <path d="M301.72 188.718C286.647 187.277 262.531 159.883 262.531 159.883C262.531 159.883 238.416 184.393 226.358 188.718C214.304 193.044 226.358 157 226.358 157H301.72C301.72 157 316.793 190.16 301.72 188.718Z" fill="var(--color-lemon)" stroke="var(--color-lemon)"/>
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Nav Overlay ── */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setNavOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1001,
              background: "rgba(10,4,9,0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            {([
              { label: "About Me", alt: "my story",  id: "about"   },
              { label: "Work",     alt: "the proof", id: "work"    },
              { label: "Contact",  alt: "say hello", id: "contact" },
            ] as const).map(({ label, alt, id }, i) => (
              <motion.button
                key={label}
                className="overlay-swap"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  setNavOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(3.5rem, 9vw, 7rem)",
                  color: "var(--color-sky)",
                  cursor: "pointer",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  padding: 0,
                }}
              >
                <span className="os-default">{label}</span>
                <span className="os-alt">{alt}</span>
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              href="/Vishvara_Gandharv_Resume.pdf"
              download="Vishvara_Gandharv_Resume.pdf"
              onClick={() => setNavOpen(false)}
              style={{
                marginTop: "36px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#111",
                background: "var(--color-lemon)",
                borderRadius: "9999px",
                padding: "14px 40px",
                textDecoration: "none",
              }}
            >
              Download Resume
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {!siteReady && <LoadingScreen onStart={() => setSiteReady(true)} />}

      {showFullCaseStudy && (
        <CaseStudyPage
          project={caseStudiesData[activeTab]}
          onClose={(scrollTo?: string) => {
            setShowFullCaseStudy(false);
            if (scrollTo) setTimeout(() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 80);
          }}
        />
      )}

      {showMurmurCaseStudy && (
        <MurmurCaseStudyPage
          onClose={(scrollTo?: string) => {
            setShowMurmurCaseStudy(false);
            if (scrollTo) setTimeout(() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 80);
          }}
        />
      )}
    </>
  );
}

