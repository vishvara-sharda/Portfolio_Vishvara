import React, { useEffect, useRef, useState, Fragment } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from 'motion/react';
import CaseStudyPage from "./CaseStudyPage";
import DesignerMind from "./DesignerMind";
import LoadingScreen from "./LoadingScreen";
import girlImg from "../imports/ChatGPT_Image_May_26__2026__08_22_25_PM.png";
import profileImg from "./components/Pictures/Group 17.jpg";

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

interface NodeDef { id: number; cx: string; cy: string; r: number; color: string; ring: boolean; }
interface EdgeDef { id: number; a: number; b: number; }

const ABOUT_NODES: NodeDef[] = [
  { id: 0, cx: "95.74%", cy: "53.84%", r: 3.0, color: "#F2A7C4", ring: false },
  { id: 1, cx: "48.17%", cy: "81.67%", r: 2.3, color: "#FAFFC7", ring: false },
  { id: 2, cx: "79.52%", cy: "64.58%", r: 4.4, color: "#FAFFC7", ring: false },
  { id: 3, cx: "41.80%", cy: "21.41%", r: 4.2, color: "#FAFFC7", ring: false },
  { id: 4, cx: "34.53%", cy: "32.24%", r: 2.5, color: "#FAFFC7", ring: false },
  { id: 5, cx: "71.78%", cy: "29.72%", r: 2.7, color: "#F2A7C4", ring: false },
  { id: 6, cx: "5.98%", cy: "66.91%", r: 3.7, color: "#FAFFC7", ring: false },
  { id: 7, cx: "36.82%", cy: "43.22%", r: 4.2, color: "#F2A7C4", ring: false },
  { id: 8, cx: "90.01%", cy: "20.28%", r: 4.0, color: "#FAFFC7", ring: false },
  { id: 9, cx: "70.06%", cy: "64.64%", r: 2.4, color: "#FAFFC7", ring: false },
  { id: 10, cx: "28.66%", cy: "37.75%", r: 4.1, color: "#F2A7C4", ring: false },
  { id: 11, cx: "24.52%", cy: "90.41%", r: 3.9, color: "#FAFFC7", ring: true },
  { id: 12, cx: "88.79%", cy: "81.82%", r: 3.1, color: "#F2A7C4", ring: false },
  { id: 13, cx: "60.86%", cy: "28.10%", r: 4.4, color: "#F2A7C4", ring: false },
  { id: 14, cx: "86.01%", cy: "5.46%", r: 2.6, color: "#F2A7C4", ring: false },
  { id: 15, cx: "16.89%", cy: "78.11%", r: 4.4, color: "#FAFFC7", ring: false },
  { id: 16, cx: "57.79%", cy: "39.71%", r: 2.4, color: "#F2A7C4", ring: false },
  { id: 17, cx: "25.25%", cy: "79.80%", r: 4.4, color: "#FAFFC7", ring: true },
  { id: 18, cx: "3.24%", cy: "38.40%", r: 3.5, color: "#FAFFC7", ring: false },
  { id: 19, cx: "47.59%", cy: "34.69%", r: 4.3, color: "#F2A7C4", ring: false },
  { id: 20, cx: "66.21%", cy: "88.55%", r: 4.2, color: "#FAFFC7", ring: false },
  { id: 21, cx: "9.23%", cy: "91.88%", r: 2.2, color: "#F2A7C4", ring: false },
  { id: 22, cx: "16.77%", cy: "15.41%", r: 2.9, color: "#FAFFC7", ring: false },
  { id: 23, cx: "93.09%", cy: "90.14%", r: 3.5, color: "#FAFFC7", ring: false },
  { id: 24, cx: "50.29%", cy: "94.03%", r: 3.4, color: "#FAFFC7", ring: false },
  { id: 25, cx: "89.25%", cy: "73.26%", r: 4.0, color: "#FAFFC7", ring: false },
  { id: 26, cx: "47.52%", cy: "51.87%", r: 3.1, color: "#FAFFC7", ring: false },
  { id: 27, cx: "44.82%", cy: "68.12%", r: 3.6, color: "#FAFFC7", ring: false },
  { id: 28, cx: "58.17%", cy: "69.11%", r: 2.2, color: "#F2A7C4", ring: false },
  { id: 29, cx: "79.10%", cy: "7.84%", r: 2.6, color: "#FAFFC7", ring: false },
  { id: 30, cx: "15.65%", cy: "22.14%", r: 4.3, color: "#F2A7C4", ring: true },
  { id: 31, cx: "71.52%", cy: "17.44%", r: 4.3, color: "#FAFFC7", ring: false },
  { id: 32, cx: "74.88%", cy: "88.93%", r: 4.4, color: "#F2A7C4", ring: false },
  { id: 33, cx: "11.57%", cy: "36.21%", r: 3.1, color: "#FAFFC7", ring: true },
  { id: 34, cx: "16.48%", cy: "8.47%", r: 3.0, color: "#F2A7C4", ring: false },
  { id: 35, cx: "43.38%", cy: "47.52%", r: 3.6, color: "#FAFFC7", ring: false },
  { id: 36, cx: "54.13%", cy: "18.38%", r: 3.1, color: "#F2A7C4", ring: false },
  { id: 37, cx: "15.50%", cy: "71.39%", r: 3.5, color: "#F2A7C4", ring: false },
  { id: 38, cx: "42.27%", cy: "61.79%", r: 2.1, color: "#F2A7C4", ring: false },
  { id: 39, cx: "69.16%", cy: "35.20%", r: 2.6, color: "#FAFFC7", ring: false },
  { id: 40, cx: "9.67%", cy: "15.95%", r: 3.8, color: "#FAFFC7", ring: false },
  { id: 41, cx: "59.32%", cy: "89.83%", r: 3.1, color: "#F2A7C4", ring: false },
  { id: 42, cx: "21.45%", cy: "35.74%", r: 2.2, color: "#FAFFC7", ring: false },
  { id: 43, cx: "20.15%", cy: "48.42%", r: 3.9, color: "#FAFFC7", ring: false },
  { id: 44, cx: "28.46%", cy: "21.00%", r: 2.4, color: "#FAFFC7", ring: false },
  { id: 45, cx: "50.74%", cy: "9.41%", r: 4.1, color: "#FAFFC7", ring: true },
  { id: 46, cx: "34.55%", cy: "9.71%", r: 3.6, color: "#FAFFC7", ring: false },
  { id: 47, cx: "27.76%", cy: "46.11%", r: 3.4, color: "#FAFFC7", ring: false },
  { id: 48, cx: "97.81%", cy: "27.54%", r: 4.0, color: "#FAFFC7", ring: true },
  { id: 49, cx: "3.65%", cy: "57.61%", r: 2.1, color: "#F2A7C4", ring: true },
  { id: 50, cx: "24.95%", cy: "66.83%", r: 2.5, color: "#FAFFC7", ring: false },
  { id: 51, cx: "52.25%", cy: "74.27%", r: 3.7, color: "#FAFFC7", ring: false },
  { id: 52, cx: "44.75%", cy: "11.11%", r: 4.0, color: "#FAFFC7", ring: false },
  { id: 53, cx: "68.64%", cy: "49.65%", r: 4.2, color: "#F2A7C4", ring: false },
  { id: 54, cx: "24.78%", cy: "58.66%", r: 3.4, color: "#F2A7C4", ring: false },
  { id: 55, cx: "85.02%", cy: "56.96%", r: 4.3, color: "#FAFFC7", ring: false },
  { id: 56, cx: "79.34%", cy: "37.22%", r: 2.0, color: "#F2A7C4", ring: false },
  { id: 57, cx: "22.86%", cy: "10.00%", r: 2.4, color: "#FAFFC7", ring: false },
  { id: 58, cx: "67.23%", cy: "11.68%", r: 3.8, color: "#FAFFC7", ring: false },
  { id: 59, cx: "38.27%", cy: "84.75%", r: 3.2, color: "#F2A7C4", ring: false },
  { id: 60, cx: "59.82%", cy: "50.59%", r: 3.2, color: "#F2A7C4", ring: false },
  { id: 61, cx: "90.76%", cy: "29.98%", r: 3.2, color: "#F2A7C4", ring: true },
  { id: 62, cx: "64.01%", cy: "40.18%", r: 3.2, color: "#FAFFC7", ring: false },
  { id: 63, cx: "72.43%", cy: "74.77%", r: 3.0, color: "#F2A7C4", ring: false },
  { id: 64, cx: "92.56%", cy: "67.35%", r: 2.6, color: "#FAFFC7", ring: false },
  { id: 65, cx: "50.15%", cy: "23.16%", r: 2.6, color: "#FAFFC7", ring: true },
  { id: 66, cx: "45.18%", cy: "89.41%", r: 2.3, color: "#F2A7C4", ring: false },
  { id: 67, cx: "4.27%", cy: "10.07%", r: 4.1, color: "#F2A7C4", ring: true },
  { id: 68, cx: "32.47%", cy: "55.74%", r: 4.5, color: "#F2A7C4", ring: false },
  { id: 69, cx: "35.16%", cy: "23.28%", r: 3.3, color: "#F2A7C4", ring: false },
];

const ABOUT_EDGES: EdgeDef[] = [
  { id: 0, a: 26, b: 35 },
  { id: 1, a: 5, b: 39 },
  { id: 2, a: 36, b: 65 },
  { id: 3, a: 45, b: 52 },
  { id: 4, a: 16, b: 62 },
  { id: 5, a: 34, b: 57 },
  { id: 6, a: 25, b: 64 },
  { id: 7, a: 22, b: 30 },
  { id: 8, a: 27, b: 38 },
  { id: 9, a: 15, b: 37 },
  { id: 10, a: 24, b: 66 },
  { id: 11, a: 3, b: 69 },
  { id: 12, a: 22, b: 34 },
  { id: 13, a: 20, b: 41 },
  { id: 14, a: 44, b: 69 },
  { id: 15, a: 22, b: 40 },
  { id: 16, a: 39, b: 62 },
  { id: 17, a: 31, b: 58 },
  { id: 18, a: 14, b: 29 },
  { id: 19, a: 48, b: 61 },
  { id: 20, a: 10, b: 42 },
  { id: 21, a: 7, b: 35 },
  { id: 22, a: 28, b: 51 },
  { id: 23, a: 43, b: 47 },
  { id: 24, a: 40, b: 67 },
  { id: 25, a: 4, b: 10 },
  { id: 26, a: 50, b: 54 },
  { id: 27, a: 54, b: 68 },
  { id: 28, a: 1, b: 66 },
  { id: 29, a: 59, b: 66 },
  { id: 30, a: 10, b: 47 },
  { id: 31, a: 1, b: 51 },
  { id: 32, a: 15, b: 17 },
  { id: 33, a: 3, b: 65 },
  { id: 34, a: 12, b: 25 },
  { id: 35, a: 18, b: 33 },
  { id: 36, a: 20, b: 32 },
  { id: 37, a: 53, b: 60 },
  { id: 38, a: 4, b: 69 },
  { id: 39, a: 12, b: 23 },
  { id: 40, a: 2, b: 55 },
  { id: 41, a: 2, b: 9 },
  { id: 42, a: 7, b: 47 },
  { id: 43, a: 36, b: 45 },
  { id: 44, a: 6, b: 49 },
  { id: 45, a: 27, b: 51 },
  { id: 46, a: 8, b: 61 },
  { id: 47, a: 33, b: 42 },
  { id: 48, a: 24, b: 41 },
  { id: 49, a: 46, b: 52 },
  { id: 50, a: 39, b: 56 },
  { id: 51, a: 9, b: 63 },
  { id: 52, a: 37, b: 50 },
  { id: 53, a: 6, b: 37 },
  { id: 54, a: 53, b: 62 },
  { id: 55, a: 11, b: 17 },
  { id: 56, a: 47, b: 68 },
  { id: 57, a: 13, b: 39 },
  { id: 58, a: 22, b: 57 },
  { id: 59, a: 8, b: 48 },
  { id: 60, a: 0, b: 55 },
  { id: 61, a: 38, b: 68 },
  { id: 62, a: 19, b: 16 },
  { id: 63, a: 21, b: 11 },
];

const margImages = [
  { type: 'cover', bg: '#FF6A00', label: 'margdarshakCover' },
  { type: 'screen', bg: '#F7F3EF', label: 'margdarshakSelect' },
  { type: 'screen', bg: '#F7F3EF', label: 'margdarshakHome' },
  { type: 'screen', bg: '#F7F3EF', label: 'margdarshakSchemes' },
  { type: 'screen', bg: '#F7F3EF', label: 'margdarshakGuides' },
  { type: 'logo', bg: '#F7F3EF', label: 'margdarshakLogo' }
];

const caseTabs = [
  { title: "Margdarshak", sub: "Civic UX" },
  { title: "Partner", sub: "Healthcare" },
  { title: "Openlee", sub: "Healthcare" },
];

const HERO_NODES = [
  // Constellation 1 (Left) - 6 stars
  {id:0,x:50,y:150}, {id:1,x:90,y:110}, {id:2,x:140,y:130}, {id:3,x:180,y:100}, {id:4,x:120,y:180}, {id:5,x:80,y:200},
  
  // Constellation 2 (Center-Top) - 5 stars
  {id:6,x:280,y:90}, {id:7,x:330,y:130}, {id:8,x:390,y:100}, {id:9,x:430,y:140}, {id:10,x:350,y:160},

  // Constellation 3 (Center-Right) - 7 stars
  {id:11,x:500,y:200}, {id:12,x:520,y:140}, {id:13,x:570,y:110}, {id:14,x:610,y:150}, {id:15,x:640,y:120}, {id:16,x:630,y:190}, {id:17,x:580,y:210},

  // Constellation 4 (Far Right) - 6 stars
  {id:18,x:690,y:170}, {id:19,x:710,y:110}, {id:20,x:750,y:90}, {id:21,x:780,y:140}, {id:22,x:760,y:190}, {id:23,x:730,y:210}
];

const HERO_EDGES = [
  // C1 edges (0-1-2-3, 2-4-5, 1-4)
  {id:0,a:0,b:1}, {id:1,a:1,b:2}, {id:2,a:2,b:3}, {id:3,a:2,b:4}, {id:4,a:4,b:5}, {id:5,a:1,b:4},
  
  // C2 edges (6-7-8-9, 7-10)
  {id:6,a:6,b:7}, {id:7,a:7,b:8}, {id:8,a:8,b:9}, {id:9,a:7,b:10}, {id:10,a:8,b:10},

  // C3 edges (11-12-13-14-15, 14-16-17-11, 13-17)
  {id:11,a:11,b:12}, {id:12,a:12,b:13}, {id:13,a:13,b:14}, {id:14,a:14,b:15}, {id:15,a:14,b:16}, {id:16,a:16,b:17}, {id:17,a:17,b:11}, {id:18,a:13,b:17},

  // C4 edges (18-19-20-21, 21-22-23-18, 19-23)
  {id:19,a:18,b:19}, {id:20,a:19,b:20}, {id:21,a:20,b:21}, {id:22,a:21,b:22}, {id:23,a:22,b:23}, {id:24,a:23,b:18}, {id:25,a:19,b:23}
];

const BACKGROUND_STARS = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 800,
  y: (i * 93.1) % 500,
  r: (i * 0.1) % 1.2 + 0.3,
  dur: (i * 0.3) % 3 + 2,
  delay: (i * 0.2) % 2,
}));


const caseStudiesData = [
  {
    id: "margdarshak",
    tag: "Self-Initiated Project",
    title: "Margdarshak — Empowering the Common Man",
    subtitle: "Bridging the last-mile gap between welfare schemes and the low-income families they're meant to serve",
    meta: [
      { label: "Role", value: "UX Strategist and Researcher" },
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
    actionTitle: "Execution Process",
    actions: [
      "Surfaced 3 core patterns: Awareness Gap, Fear, Digital Confidence",
      "Ran 20 primary interviews across 5 cities",
      "Applied SCAMPER to arrive at unified direction",
      "Designed AI eligibility matching reducing 740+ to 3–5",
      "Built a one-time document vault and plain-language translation layer"
    ],
    result: "A tested high fidelity prototype where a 19-year-old semi-urban participant navigated the app end-to-end with no prior guidance.\n\nThe flow successfully collapsed a 15+ step unguided government process into just 3 core decisions, significantly reducing cognitive load and drop-off rates.",
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
    id: "partner",
    tag: "B2B SaaS",
    title: "Partner — Healthcare Portal",
    subtitle: "A comprehensive dashboard for healthcare providers to manage patient data effectively.",
    meta: [
      { label: "Role", value: "Lead Product Designer" },
      { label: "Timeline", value: "6 months" },
      { label: "Team", value: "Partner Dev Team" }
    ],
    images: [
      { type: 'cover', label: 'Hero Concept' },
      { type: 'screen', label: 'Dashboard' },
      { type: 'screen', label: 'Analytics' },
      { type: 'screen', label: 'Patients' }
    ],
    situation: "Healthcare providers were struggling with outdated, fragmented systems that slowed down patient intake and increased data entry errors.",
    task: "Design a unified, secure portal that streamlines patient data management and provides clear, actionable analytics for clinic administrators.",
    actionTitle: "Design Process",
    actions: [
      "Conducted extensive stakeholder workshops",
      "Created wireframes for the patient onboarding flow",
      "Iterated on high-fidelity dashboard data visualizations",
      "Established a new clinical accessibility-focused design system",
      "Handed off production-ready assets to engineering"
    ],
    result: "Successfully launched the v1 portal to 50+ clinics, reducing patient onboarding time drastically and improving data accuracy across the board.",
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
];

const ORBIT_ITEMS = [
  { label: "RESEARCH PHILOSOPHY", content: "Design starts before the screen. Empathy as a method." },
  { label: "PSYCHOLOGY", content: "Understanding human behavior over interface patterns." },
  { label: "JAPANESE", content: "Learning how a new language structures thought." },
  { label: "POTTERY", content: "Making physical things when screens feel like too much." },
  { label: "ILLUSTRATIONS", content: "Where I think without the pressure of it being good." },
  { label: "FAILED PROJECTS", content: "Not everything needs to ship. Fails are part of the process." }
];

const TESTIMONIALS = [
  {
    id: 0,
    metric: "THINKING & DEDICATION",
    project: "Margdarshak",
    teaser: "She has an exceptional dedication and thinking process.",
    quote: "Sometimes I have to ask her to shut up, god she talks a lot!",
    author: "Bhushan",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    color: "#F2A7C4"
  },
  {
    id: 1,
    metric: "HABIT-BUILDING GAMEPLAY",
    project: "Creditt",
    teaser: "Turned standard budget tracking into an engaging, reward-driven behavioral habit loop.",
    quote: "Conceptualized a budget tracking experience that treats financial discipline as a rewarding game, turning chores into positive habits.",
    author: "Lead Designer, Creditt",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    color: "#FAFFC7"
  },
  {
    id: 2,
    metric: "HYPER-LOCAL COLLABORATION",
    project: "Local Discovery App",
    teaser: "Mapped neighbor interaction models to foster community cohesion and trust.",
    quote: "Mapped out user journeys for hyper-local discovery, designing a seamless interaction model for neighborhood community building.",
    author: "Co-Founder, LocalDiscovery",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    color: "#B8C4E8"
  }
];

const GlobalStyles = React.memo(() => (
  <style>{`
    body {
      background-color: #111;
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
      color: #FAFFC7;
      text-shadow: 0 0 30px rgba(250, 255, 199, 0.6);
    }

    /* Premium Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #0A0409; 
      border-left: 1px solid rgba(255, 255, 255, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: #333; 
      border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #F2A7C4; 
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
      box-shadow: 0 0 80px rgba(242, 167, 196, 0.15) !important;
    }
    .featured-btn-primary:hover {
      box-shadow: 0 0 24px rgba(242, 167, 196, 0.6) !important;
      transform: translateY(-2px);
    }
    .featured-btn-secondary:hover {
      border-color: rgba(250, 255, 199, 0.8) !important;
      box-shadow: 0 0 15px rgba(250, 255, 199, 0.15) inset, 0 0 15px rgba(250, 255, 199, 0.15) !important;
    }
    .btn-shine {
      background: linear-gradient(90deg, #F2A7C4 0%, #FAFFC7 50%, #F2A7C4 100%);
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
      color: rgba(242, 167, 196, 0.15);
      letter-spacing: 0.05em;
      padding-right: 2rem;
      white-space: nowrap;
    }
    @media (max-width: 640px) {
      .featured-buttons-container {
        flex-direction: column !important;
      }
    }
    .liquid-target {
      filter: url(#liquid-warp);
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
        #F2A7C4 30%,
        #fff8e7 48%,
        #fffde0 52%,
        #F2A7C4 70%,
        #FAFFC7 100%
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
      transform: rotate(3.5deg);
      transform-origin: center center;
      transition: transform 0.5s ease-out;
      cursor: pointer;
    }
    .photo-card-outer:hover {
      transform: rotate(0deg);
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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
      border-color: #F2A7C4;
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
      background: rgba(20, 20, 20, 0.4);
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
      color: #FAFFC7;
      font-family: 'Cormorant Garamond', serif;
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
      opacity: 0.22;
      filter: none;
      transition: stroke-width 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out;
    }
    .c-node {
      opacity: 0.7;
      filter: none;
      stroke: var(--node-color, white);
      stroke-width: 0;
      transition: stroke-width 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out;
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

    /* Testimonials section responsive */
    @media (max-width: 768px) {
      .testimonials-grid {
        grid-template-columns: 1fr !important;
      }
      .testimonial-card {
        padding-bottom: 68px !important;
      }
      .testimonial-sticky {
        transform: translateY(0%) !important;
        transition: none !important;
        opacity: 1 !important;
      }
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

    /* Navbar */
    .nav-desktop { display: flex; }
    .nav-hamburger { display: none; }
    @media (max-width: 639px) {
      .nav-desktop { display: none !important; }
      .nav-hamburger { display: flex !important; }
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

    /* Case studies bento grid */
    @media (max-width: 768px) {
      .bento-main-grid {
        grid-template-columns: 1fr !important;
      }
      .case-study-header {
        padding: 20px !important;
      }
      .case-study-body {
        padding: 20px !important;
      }
    }

    /* Case study tabs */
    @media (max-width: 600px) {
      .case-tab-title {
        font-size: 17px !important;
      }
      .case-tab-sub {
        font-size: 9px !important;
        letter-spacing: 0.5px !important;
        margin-top: 4px !important;
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
  `}</style>
));

export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const aboutSvgRef = useRef<SVGSVGElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const [margImage, setMargImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [showFullCaseStudy, setShowFullCaseStudy] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const [activeStarNode, setActiveStarNode] = useState(0);
  const [heroHoveredNode, setHeroHoveredNode] = useState<number | null>(null);
  const [passionTab, setPassionTab] = useState(0);
  const [orbitHover, setOrbitHover] = useState<{ label: string, content: string } | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactFocused, setContactFocused] = useState(false);
  const [emailError, setEmailError] = useState("");

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
  const orbitTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nameEl = nameRef.current;
    if (!nameEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nameEl.style.opacity = "1";
      nameEl.style.top = "42vh";
      return;
    }

    let lastMouseX = 0;
    let lastMouseY = 0;
    let liquidScale = 0;

    const onGlobalMouse = (e: MouseEvent) => {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      liquidScale = Math.min(25, liquidScale + speed * 0.12);
    };
    window.addEventListener('mousemove', onGlobalMouse, { passive: true });

    const waterMap = document.getElementById("liquid-map");
    const vh = window.innerHeight || 800;

    const tick = () => {
      const nameEl = nameRef.current;

      if (nameEl) {
        const scrollY = window.scrollY;
        const opacity = 1 - Math.max(0, Math.min(1, (scrollY - vh * 0.1) / (vh * 0.5)));
        nameEl.style.opacity = opacity.toString();
      }

      liquidScale = lerp(liquidScale, 0, 0.08);
      if (waterMap) {
        waterMap.setAttribute("scale", String(liquidScale));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onGlobalMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const svg = aboutSvgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let nodeElems: any[] = [];
    let edgeElems: any[] = [];
    let rafPending = false;
    let lastE: MouseEvent | null = null;

    const onMouseMove = (e: MouseEvent) => {
      lastE = e;
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const e = lastE!;
        processMove(e);
      });
    };

    const processMove = (e: MouseEvent) => {
      if (nodeElems.length === 0) {
        nodeElems = Array.from(svg.querySelectorAll('.c-node')).map(el => ({
          el: el as SVGCircleElement,
          cxP: parseFloat(el.getAttribute('cx') || '0'),
          cyP: parseFloat(el.getAttribute('cy') || '0'),
          color: el.getAttribute('fill') || 'white'
        }));
      }
      if (edgeElems.length === 0) {
        edgeElems = Array.from(svg.querySelectorAll('.c-line')).map(el => ({
          el: el as SVGLineElement,
          x1P: parseFloat(el.getAttribute('x1') || '0'),
          y1P: parseFloat(el.getAttribute('y1') || '0'),
          x2P: parseFloat(el.getAttribute('x2') || '0'),
          y2P: parseFloat(el.getAttribute('y2') || '0'),
          color: el.getAttribute('stroke') || 'white'
        }));
      }

      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      const GLOW_DIST = 120;
      const GLOW_DIST_SQ = GLOW_DIST * GLOW_DIST;

      for (const n of nodeElems) {
        const nx = (n.cxP / 100) * w;
        const ny = (n.cyP / 100) * h;
        const distSq = (mouseX - nx)**2 + (mouseY - ny)**2;
        if (distSq < GLOW_DIST_SQ) {
          const intensity = 1 - Math.sqrt(distSq) / GLOW_DIST;
          n.el.style.strokeWidth = `${7 * intensity}px`;
          n.el.style.opacity = '1';
          n.el.style.filter = `drop-shadow(0 0 ${8 * Math.pow(intensity, 0.5)}px ${n.color}) drop-shadow(0 0 ${16 * intensity}px ${n.color})`;
        } else {
          n.el.style.strokeWidth = '';
          n.el.style.opacity = '';
          n.el.style.filter = '';
        }
      }

      for (const edge of edgeElems) {
        const x1 = (edge.x1P / 100) * w;
        const y1 = (edge.y1P / 100) * h;
        const x2 = (edge.x2P / 100) * w;
        const y2 = (edge.y2P / 100) * h;
        
        const l2 = (x1 - x2)**2 + (y1 - y2)**2;
        let distSq;
        if (l2 === 0) {
          distSq = (mouseX - x1)**2 + (mouseY - y1)**2;
        } else {
          let t = ((mouseX - x1) * (x2 - x1) + (mouseY - y1) * (y2 - y1)) / l2;
          t = Math.max(0, Math.min(1, t));
          const px = x1 + t * (x2 - x1);
          const py = y1 + t * (y2 - y1);
          distSq = (mouseX - px)**2 + (mouseY - py)**2;
        }

        if (distSq < GLOW_DIST_SQ) {
          const intensity = 1 - Math.sqrt(distSq) / GLOW_DIST;
          edge.el.style.strokeWidth = String(0.6 + 1.8 * intensity);
          edge.el.style.opacity = String(0.22 + 0.78 * intensity);
          edge.el.style.filter = `drop-shadow(0 0 ${6 * Math.pow(intensity, 0.5)}px ${edge.color})`;
        } else {
          edge.el.style.strokeWidth = '';
          edge.el.style.opacity = '';
          edge.el.style.filter = '';
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);



  return (
    <>
      {/* Liquid Warp Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="liquid-warp">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
          <feDisplacementMap id="liquid-map" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      <div id="skew-container" style={{ transformOrigin: "center center", willChange: "transform" }}>

      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: "60px",
        padding: "0 clamp(24px, 5vw, 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10, 4, 9, 0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}>
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none",
            border: "none",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "22px",
            color: "#F2A7C4",
            letterSpacing: "-0.01em",
            padding: 0,
          }}
        >
          VG
        </button>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ gap: "28px", alignItems: "center" }}>
          {(["About", "Work", "Contact"] as const).map((label) => (
            <button
              key={label}
              onClick={() => document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.48)",
                padding: 0,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F2A7C4")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.48)")}
            >
              {label}
            </button>
          ))}
          <a
            href="/Vishvara_Gandharv_Resume.pdf"
            download="Vishvara_Gandharv_Resume.pdf"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#111",
              background: "#FAFFC7",
              borderRadius: "9999px",
              padding: "8px 20px",
              textDecoration: "none",
            }}
          >
            Resume
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setNavOpen(prev => !prev)}
          aria-label={navOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            padding: "4px",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "rgba(255,255,255,0.7)", transition: "transform 0.3s ease, opacity 0.3s ease", transform: navOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "rgba(255,255,255,0.7)", transition: "opacity 0.3s ease", opacity: navOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "rgba(255,255,255,0.7)", transition: "transform 0.3s ease", transform: navOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: "60px",
              left: 0,
              right: 0,
              zIndex: 999,
              background: "rgba(10, 4, 9, 0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "16px clamp(24px, 5vw, 80px) 28px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {(["About", "Work", "Contact"] as const).map((label) => (
              <button
                key={label}
                onClick={() => {
                  document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
                  setNavOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: "28px",
                  color: "rgba(255,255,255,0.7)",
                  padding: "18px 0",
                  textAlign: "left",
                  letterSpacing: "-0.01em",
                }}
              >
                {label}
              </button>
            ))}
            <a
              href="/Vishvara_Gandharv_Resume.pdf"
              download="Vishvara_Gandharv_Resume.pdf"
              onClick={() => setNavOpen(false)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#111",
                background: "#FAFFC7",
                borderRadius: "9999px",
                padding: "14px 28px",
                textDecoration: "none",
                textAlign: "center",
                marginTop: "20px",
                display: "block",
              }}
            >
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Live Animated Grain Overlay */}
      <div className="live-grain" aria-hidden="true" />

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
          const fill = i % 3 === 0 ? "#FAFFC7" : i % 5 === 0 ? "#FFF" : "#F2A7C4";
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

      {/* ── Hero section ── */}
      <div ref={sectionRef} style={{ height: "100vh", position: "relative", zIndex: 10 }}>
        <div style={{ width: "100%", height: "100%" }}>

          {/* Background — fixed, no drift */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }} aria-hidden="true">

          {/* Layer 1: Background SVG */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="55%" stopColor="#000000" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <radialGradient id="moonGlow">
                  <stop offset="0%" stopColor="#EDE5D8" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#EDE5D8" stopOpacity="0" />
                </radialGradient>
                <mask id="crescentMask">
                  <rect x="0" y="0" width="800" height="500" fill="white" />
                  <circle cx="692" cy="154" r="24" fill="black" />
                </mask>
                <filter id="blur80">
                  <feGaussianBlur stdDeviation="80" />
                </filter>
              </defs>
              <rect width="800" height="500" fill="url(#skyGrad)" />
              <circle cx="150" cy="180" r="160" fill="#F2A7C4" opacity="0.02" filter="url(#blur80)" />
              <circle cx="650" cy="160" r="180" fill="#6D1F2A" opacity="0.034" filter="url(#blur80)" />
              
              {/* BACKGROUND STARS (Small, unconnected, blinking) */}
              <g fill="#ffffff">
                {BACKGROUND_STARS.map(star => (
                  <circle key={`bg-star-${star.id}`} cx={star.x} cy={star.y} r={star.r} opacity={0.3}>
                    <animate attributeName="opacity" values="0.1;0.7;0.1" dur={`${star.dur}s`} begin={`${star.delay}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>

              {/* HERO EDGES */}
              <g stroke="#ffffff" strokeWidth="0.5" opacity="0.3">
                {HERO_EDGES.map((edge) => {
                  const nodeA = HERO_NODES.find((n) => n.id === edge.a);
                  const nodeB = HERO_NODES.find((n) => n.id === edge.b);
                  if (!nodeA || !nodeB) return null;
                  
                  const isHovered = heroHoveredNode === nodeA.id || heroHoveredNode === nodeB.id;
                  
                  return (
                    <line
                      key={`hero-edge-${edge.id}`}
                      x1={nodeA.x}
                      y1={nodeA.y}
                      x2={nodeB.x}
                      y2={nodeB.y}
                      stroke={isHovered ? "#FAFFC7" : "#ffffff"}
                      strokeWidth={isHovered ? 1.5 : 0.5}
                      opacity={isHovered ? 0.8 : 0.3}
                      style={{ transition: "all 300ms ease" }}
                    />
                  );
                })}
              </g>

              {/* HERO NODES */}
              <g fill="#fff">
                {HERO_NODES.map((node) => {
                  const isHovered = heroHoveredNode === node.id;
                  const isConnected = HERO_EDGES.some(
                    (e) => (e.a === node.id && e.b === heroHoveredNode) || (e.b === node.id && e.a === heroHoveredNode)
                  );
                  const isHighlighted = isHovered || isConnected;
                  
                  return (
                    <g 
                      key={`hero-node-${node.id}`}
                      onMouseEnter={() => setHeroHoveredNode(node.id)}
                      onMouseLeave={() => setHeroHoveredNode(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx={node.x} cy={node.y} r={50} fill="transparent" />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHighlighted ? 4 : 2}
                        fill={isHovered ? "#F2A7C4" : isConnected ? "#FAFFC7" : "#ffffff"}
                        opacity={isHighlighted ? 1 : 0.9}
                        style={{ transition: "all 300ms ease", filter: isHighlighted ? "drop-shadow(0 0 4px rgba(250, 255, 199, 0.8))" : "drop-shadow(0 0 2px rgba(255,255,255,0.5))" }}
                      >
                        {!isHighlighted && <animate attributeName="opacity" values="1;0.3;1" dur={`${2 + (node.id % 3)}s`} begin={`${node.id * 0.1}s`} repeatCount="indefinite" />}
                      </circle>
                    </g>
                  );
                })}
              </g>

              <circle cx="700" cy="160" r="64" fill="url(#moonGlow)" />
              <circle cx="700" cy="160" r="24" fill="#EDE5D8" mask="url(#crescentMask)" />
              <path fill="#151515" d="M0 300 C80 270 140 285 220 295 C320 308 430 260 530 280 C620 300 710 275 800 290 L800 500 L0 500 Z" />
              <path fill="#0F0F0F" d="M0 340 C90 295 190 325 280 350 C390 375 500 300 610 325 C700 345 760 320 800 335 L800 500 L0 500 Z" />
              <path fill="#050505" d="M0 395 C70 365 150 390 250 410 C360 430 470 380 590 400 C700 420 760 390 800 405 L800 500 L0 500 Z" />
            </svg>
          </div>

          {/* Layer 2: Hut (right-aligned, same ground level as girl) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "30%",
              right: "10%",
              width: "48px",
              height: "48px",
              zIndex: 1,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <g fill="#D8D6D2" opacity="0.55">
              <circle cx="52" cy="18" r="2"/>
              <circle cx="55" cy="14" r="2.8"/>
              <circle cx="53" cy="9" r="3.5"/>
            </g>
            <rect x="48" y="24" width="5" height="9" fill="#463328"/>
            <path d="M20 36 L40 20 L60 36 Z" fill="#3A261A"/>
            <path d="M25 34 L40 24 L55 34 Z" fill="#4B3223" opacity="0.7"/>
            <rect x="24" y="34" width="32" height="24" rx="1" fill="#5E4632"/>
            <rect x="35" y="45" width="10" height="13" rx="1" fill="#2A1C14"/>
            <rect x="28" y="42" width="5" height="5" fill="#EACD8A" opacity="0.85"/>
            <rect x="47" y="42" width="5" height="5" fill="#EACD8A" opacity="0.85"/>
          </svg>

          {/* Layer 2: Girl */}
          <img
            src={girlImg}
            alt=""
            aria-hidden="true"
            className="hero-girl"
            fetchPriority="high"
            decoding="async"
            width={180}
            height={180}
            style={{
              position: "absolute",
              bottom: "18%",
              left: "50%",
              transform: "translateX(-30%)",
              width: "180px",
              height: "180px",
              objectFit: "contain",
              mixBlendMode: "screen",
              zIndex: 2,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />

          </div>{/* end background */}

          {/* Name only — scrolls down while background stays fixed */}
          <div
            ref={nameRef}
            aria-hidden="true"
            className="liquid-target"
            style={{
              position: "absolute",
              left: "50%",
              top: "42vh",
              transform: "translateX(-50%)",
              opacity: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: "7vw",
              color: "#F2A7C4",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              zIndex: 3,
              pointerEvents: "none",
              userSelect: "none",
              willChange: "opacity, top",
            }}
          >
            V<span style={{ position: "relative", display: "inline-block" }}>I<svg viewBox="0 0 24 24" style={{ position: "absolute", top: "-0.3em", left: "50%", transform: "translateX(-30%)", width: "0.28em", height: "0.28em", overflow: "visible" }} xmlns="http://www.w3.org/2000/svg"><polygon points="12,4 13.9,9.4 19.6,9.5 15,13 16.7,18.5 12,15.2 7.3,18.5 9,13 4.4,9.5 10.1,9.4" fill="#F2A7C4" stroke="#F2A7C4" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /></svg></span>SHVARA GANDHARV
          </div>

        </div>
      </div>



      {/* ── About Me section ── */}
      <div
        id="about"
        className="about-section"
        style={{
          background: "transparent",
          minHeight: "100vh",
          padding: "96px clamp(28px, 7vw, 100px) 100px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gridTemplateAreas: '"role photo" "name photo" "tagline photo" "stats photo" "ctas photo"',
          columnGap: "clamp(40px, 6vw, 80px)",
          rowGap: 0,
          alignItems: "start",
          position: "relative",
        }}
      >


        {/* Vignette overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: "none",
            zIndex: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Constellation SVG */}
        <svg
          ref={aboutSvgRef}
          aria-hidden="true"
          className="constellation-svg"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            zIndex: 0,
          }}
        >
          {/* Visible edges */}
          {ABOUT_EDGES.map(e => (
            <line
              key={e.id}
              data-edge={String(e.id)}
              x1={ABOUT_NODES[e.a].cx} y1={ABOUT_NODES[e.a].cy}
              x2={ABOUT_NODES[e.b].cx} y2={ABOUT_NODES[e.b].cy}
              stroke={ABOUT_NODES[e.a].color}
              className="c-line"
            />
          ))}

          {/* Nodes */}
          {ABOUT_NODES.map(n => (
            <g key={n.id} data-node={String(n.id)}>
              {n.ring && (
                <circle
                  cx={n.cx} cy={n.cy} r={n.r + 5}
                  fill="none" stroke={n.color}
                  strokeWidth={0.7} opacity={0.15}
                />
              )}
              <circle
                cx={n.cx} cy={n.cy} r={n.r}
                fill={n.color}
                data-base-r={String(n.r)}
                data-nc={String(n.id)}
                className="c-node"
                pointerEvents="none"
              />
            </g>
          ))}
        </svg>

        {/* Role overline — shining designation */}
        <div className="about-role-badge" style={{
          display: "inline-flex",
          alignItems: "center",
          margin: "0 0 36px 0",
          padding: "6px 18px",
          borderRadius: "9999px",
          border: "1px solid rgba(242, 167, 196, 0.55)",
          background: "rgba(26, 18, 21, 0.6)",
          boxShadow: "0 0 14px rgba(242, 167, 196, 0.18)",
          position: "relative" as const,
          top: "-12px",
          pointerEvents: "auto",
          width: "fit-content",
        }}>
          <span className="role-shine" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase" as const,
            letterSpacing: "0.22em",
          }}>
            UX Researcher &amp; Strategist
          </span>
        </div>

        {/* Name — dominant anchor */}
        <div className="about-name-block" style={{ margin: "0 0 36px -36px", display: "flex", flexDirection: "column", gap: "16px", pointerEvents: "auto" }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "clamp(3.4rem, 8.5vw, 10rem)",
            color: "#F2A7C4",
            lineHeight: 0.88,
            letterSpacing: "-0.03em",
            margin: 0,
            background: "rgba(0, 0, 0, 0.08)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.02)",
            borderRadius: "24px",
            padding: "12px 36px",
            width: "fit-content",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          }}>
            V<span style={{ position: "relative", display: "inline-block" }}>I<svg viewBox="0 0 24 24" style={{ position: "absolute", top: "-0.25em", left: "50%", transform: "translateX(-30%)", width: "0.28em", height: "0.28em", overflow: "visible" }} xmlns="http://www.w3.org/2000/svg"><polygon points="12,4 13.9,9.4 19.6,9.5 15,13 16.7,18.5 12,15.2 7.3,18.5 9,13 4.4,9.5 10.1,9.4" fill="#F2A7C4" stroke="#F2A7C4" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /></svg></span>SHVARA
          </h1>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "clamp(3.4rem, 8.5vw, 10rem)",
            color: "#F2A7C4",
            lineHeight: 0.88,
            letterSpacing: "-0.03em",
            margin: 0,
            background: "rgba(0, 0, 0, 0.08)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.02)",
            borderRadius: "24px",
            padding: "12px 36px",
            width: "fit-content",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          }}>
            GANDHARV
          </h1>
        </div>

        {/* Tagline — larger, italic, acts as voice */}
        <p className="about-tagline" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(1.05rem, 1.9vw, 1.55rem)",
          color: "#FAFFC7",
          lineHeight: 1.5,
          maxWidth: "400px",
          margin: "0 0 52px 0",
          opacity: 0.88,
          pointerEvents: "auto",
        }}>
          Turning messy human behavior into<br />clear, purposeful design.
        </p>

        {/* Stats (Individual Glassmorphism Cards) */}
        <div className="about-stats" style={{
          display: "flex",
          gap: "clamp(12px, 2vw, 20px)",
          margin: "0 0 36px 0",
          pointerEvents: "auto",
          flexWrap: "wrap",
        }}>
          {[["3", "Projects", "2 ongoing"], ["2", "Domains", null], ["6+", "Months", null]].map(([val, label, sub]) => (
            <div key={label} style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
              padding: "18px 24px",
              minWidth: "110px",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                color: "#F2A7C4",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1,
              }}>{val}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.32)",
                marginTop: "7px",
                letterSpacing: "0.14em",
              }}>{label}</div>
              {sub && (
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  color: "rgba(242,167,196,0.45)",
                  marginTop: "3px",
                  letterSpacing: "0.06em",
                }}>{sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="about-ctas" style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const, pointerEvents: "auto" }}>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-shine"
            style={{
            border: "none",
            color: "#1a0010",
            padding: "12px 28px",
            borderRadius: "8px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.02em",
            cursor: "pointer",
          }}>
            Contact Me
          </button>
          <a
            href="/Vishvara_Gandharv_Resume.pdf"
            download="Vishvara_Gandharv_Resume.pdf"
            style={{
              display: "inline-block",
              background: "transparent",
              border: "1px solid rgba(250,255,199,0.25)",
              color: "#FAFFC7",
              padding: "12px 28px",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.02em",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Download Resume
          </a>

        </div>

        {/* Right: tilted photo card */}
        <div className="photo-card-outer" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            border: "5px solid #FAFFC7",
            borderRadius: "20px",
            overflow: "hidden",
            width: "clamp(200px, 22vw, 300px)",
            aspectRatio: "3/4",
            boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(242,167,196,0.08)",
            background: "#111",
          }}>
            <img
              src={profileImg}
              alt="Vishvara Gandharv"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                filter: "contrast(1.1) saturate(1.1) brightness(0.9)",
              }}
            />
          </div>
          {/* Signature */}
          <div style={{
            textAlign: "center",
            marginTop: "10px",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
            color: "#F2A7C4",
            opacity: 0.85,
            pointerEvents: "none",
            userSelect: "none",
          }}>
            Vishvara Gandharv
          </div>
        </div>

      </div>

      {/* FEATURED VIDEO SECTION */}
      <section style={{
        position: "relative",
        background: "transparent",
        padding: "100px clamp(24px, 5vw, 80px)",
        overflow: "hidden"
      }}>
        {/* Liquid background container for vignette */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          {/* Vignette Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }} aria-hidden="true" />
        </div>

        {/* Background Marquee Ribbon */}
        <div aria-hidden="true" style={{
          position: "absolute",
          top: "48%",
          left: "-10%",
          width: "120%",
          transform: "rotate(-3deg) translateY(-50%)",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden"
        }}>
          <div className="marquee-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="marquee-text">
                • PRODUCT DESIGN • UX RESEARCH • CREATIVE DIRECTION&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Content Wrapper */}
        <div style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "860px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          {/* Label */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#F2A7C4",
            opacity: 0.72,
            margin: "0 0 16px 0"
          }}>
            Featured
          </p>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            color: "#FFFFFF",
            lineHeight: 1.1,
            margin: "0 0 16px 0"
          }}>
            I research the space between people and products
          </h2>

          {/* Video Wrapper (Glassmorphism) */}
          <div className="video-card-hover" style={{
            background: "rgba(20, 20, 20, 0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "2px solid #FAFFC7",
            borderRadius: "20px",
            padding: "10px",
            position: "relative",
            boxShadow: "0 0 60px rgba(250, 255, 199, 0.08)",
            transition: "all 0.4s ease"
          }}>
            {/* 4 Corners (offset by -6px from edge) */}
            <div aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 6, height: 6, borderRadius: "50%", background: "#FAFFC7", opacity: 0.8, zIndex: 2 }} />
            <div aria-hidden="true" style={{ position: "absolute", top: -6, right: -6, width: 6, height: 6, borderRadius: "50%", background: "#FAFFC7", opacity: 0.8, zIndex: 2 }} />
            <div aria-hidden="true" style={{ position: "absolute", bottom: -6, left: -6, width: 6, height: 6, borderRadius: "50%", background: "#FAFFC7", opacity: 0.8, zIndex: 2 }} />
            <div aria-hidden="true" style={{ position: "absolute", bottom: -6, right: -6, width: 6, height: 6, borderRadius: "50%", background: "#FAFFC7", opacity: 0.8, zIndex: 2 }} />

            {/* iframe */}
            <YouTubeFacade videoId="CGPjBUCOn2M" title="Introduction video" borderRadius="14px" />
          </div>

          {/* Content Below */}
          <div style={{
            maxWidth: "560px",
            margin: "28px auto 0",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              lineHeight: 1.8,
              color: "rgba(255, 255, 255, 0.45)",
              margin: 0
            }}>
              Transforming messy human behavior into clear, purposeful design. Open to product design roles globally.
            </p>

            <div className="featured-buttons-container" style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "24px"
            }}>
              <a
                href="https://www.linkedin.com/in/vishvara-gandharv"
                target="_blank"
                rel="noreferrer"
                className="featured-btn-secondary"
                style={{
                  display: "inline-block",
                  background: "transparent",
                  border: "1px solid rgba(250, 255, 199, 0.4)",
                  color: "#FAFFC7",
                  padding: "10px 24px",
                  borderRadius: "11px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textDecoration: "none"
                }}>
                Connect on LinkedIn
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* CASE STUDIES SECTION */}
      <section id="work" className="case-studies-section" style={{
        position: "relative",
        padding: "100px clamp(24px, 5vw, 80px)",
        background: "transparent",
        zIndex: 10,
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden"
      }}>


        {/* Vignette overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: "none",
            zIndex: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <div style={{ maxWidth: "1024px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          
          {/* Selected Work label */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.28em",
            textTransform: "uppercase" as const,
            color: "#F2A7C4",
            opacity: 0.72,
            margin: "0 0 16px 0",
            textAlign: "center" as const,
          }}>
            SELECTED WORK
          </p>

          {/* TABS UI (Glowing HUD Style) */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
            paddingBottom: "16px",
            position: "relative"
          }}>
            {/* Background track for the line */}
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "2px", background: "rgba(255, 255, 255, 0.1)" }} />
            
            {/* Animated Glowing Active Line */}
            <div style={{
              position: "absolute",
              bottom: -1,
              left: `${(activeTab / caseTabs.length) * 100}%`,
              width: `${100 / caseTabs.length}%`,
              height: "4px",
              background: "#F2A7C4",
              boxShadow: "0 0 10px #F2A7C4, 0 0 20px #F2A7C4",
              transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "4px",
              zIndex: 2
            }} />

            {caseTabs.map((tab, i) => {
              const isActive = activeTab === i;
              return (
                <div 
                  key={i}
                  onClick={() => { setActiveTab(i); setMargImage(0); }}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    flex: 1,
                    opacity: isActive ? 1 : 0.4,
                    transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isActive ? "translateY(-6px)" : "translateY(0)"
                  }}
                >
                  <div className="case-tab-title" style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "26px",
                    color: isActive ? "#F2A7C4" : "#FFFFFF",
                    fontWeight: isActive ? 700 : 400,
                    textShadow: isActive ? "0 4px 15px rgba(242, 167, 196, 0.8)" : "none",
                    transition: "all 400ms ease"
                  }}>
                    {tab.title}
                  </div>
                  <div className="case-tab-sub" style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: isActive ? "#FAFFC7" : "#A0A0A0",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginTop: "6px"
                  }}>
                    {tab.sub}
                  </div>
                </div>
              );
            })}
          </div>

          
          {/* GENERIC BENTO BOX RENDERER FOR ALL TABS */}
          {(() => {
            const currentCase = caseStudiesData[activeTab] || caseStudiesData[0];
            const currentImage = margImage < currentCase.images.length ? margImage : 0;
            
            if (activeTab !== 0) return (
              <div style={{
                background: "rgba(20, 20, 20, 0.4)",
                border: "1px solid rgba(242, 167, 196, 0.4)",
                borderRadius: "16px",
                boxShadow: "0 0 30px rgba(242,167,196,0.1), 0 25px 50px -12px rgba(0,0,0,0.8)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                padding: "64px 32px",
                textAlign: "center" as const,
              }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#F2A7C4", opacity: 0.5, margin: "0 0 10px" }}>Healthcare</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: "white", margin: 0, opacity: 0.4 }}>Coming Soon</p>
              </div>
            );

            return (
          <div style={{
            background: "rgba(20, 20, 20, 0.4)",
            border: "1px solid rgba(242, 167, 196, 0.4)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 0 30px rgba(242,167,196,0.1), 0 25px 50px -12px rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)"
          }}>

            {/* Header */}
            <div className="case-study-header" style={{ padding: "32px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{
                display: "inline-block",
                background: "rgba(242, 167, 196, 0.1)",
                color: "#F2A7C4",
                border: "1px solid rgba(242, 167, 196, 0.3)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                borderRadius: "9999px",
                padding: "4px 12px",
                marginBottom: "12px"
              }}>
                {currentCase.tag}
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "30px",
                color: "#FFFFFF",
                margin: "0 0 4px 0",
                fontWeight: 700
              }}>
                {currentCase.title}
              </h3>
              <p style={{
                fontSize: "14px",
                color: "#A0A0A0",
                maxWidth: "672px",
                margin: "0 0 16px 0"
              }}>
                {currentCase.subtitle}
              </p>
              <div style={{ display: "flex", gap: "8px", fontSize: "14px", color: "#888", flexWrap: "wrap", alignItems: "center" }}>
                <span>{currentCase.meta[0].label}: <strong style={{color:"#FAFFC7"}}>{currentCase.meta[0].value}</strong></span>
                <span style={{color:"#F2A7C4"}}>•</span>
                <span>{currentCase.meta[1].label}: <strong style={{color:"#FAFFC7"}}>{currentCase.meta[1].value}</strong></span>
                <span style={{color:"#F2A7C4"}}>•</span>
                <span>{currentCase.meta[2].label}: <strong style={{color:"#FAFFC7"}}>{currentCase.meta[2].value}</strong></span>
              </div>
            </div>

            {/* BENTO GRID BODY - TRAILER LAYOUT */}
            <div className="case-study-body" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>

            
              {/* Main Bento Split: Video (Top) & STAR Summary (Bottom) */}
              <div className="bento-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>

                 {/* Promo Video Cover Box */}
                 <div style={{ background: "rgba(20,20,20,0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", padding: "8px", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
                    <YouTubeFacade videoId="oaA4V-_D63A" title="Margdarshak Promo Video" borderRadius="12px" />
                 </div>

                 {/* STAR Framework Summary Box */}
                 <div style={{ display: "flex", flexDirection: "column", background: "rgba(20,20,20,0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", padding: "32px", position: "relative", overflow: "hidden", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "linear-gradient(to bottom, #F2A7C4, #FAFFC7)" }} />
                    <div style={{ position: "absolute", right: "-10%", top: "-10%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(242,167,196,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                    
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: "#FFFFFF", margin: "0 0 24px 0", position: "relative", zIndex: 1 }}>Project Summary</h4>
                    
                    <ul style={{ color: "#CCCCCC", fontSize: "14px", lineHeight: 1.6, margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", position: "relative", zIndex: 1 }}>
                      
                      {/* Situation */}
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", overflow: "visible" }}><polygon points="12,4 13.9,9.4 19.6,9.5 15,13 16.7,18.5 12,15.2 7.3,18.5 9,13 4.4,9.5 10.1,9.4" fill="#F2A7C4" stroke="#F2A7C4" strokeWidth="2" strokeLinejoin="round" /></svg>
                        <div>
                          <strong style={{ color: "#F2A7C4", display: "block", marginBottom: "4px", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>Situation</strong>
                          <span>{currentCase.situation.split('.')[0]}.</span>
                        </div>
                      </li>

                      {/* Task */}
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", overflow: "visible" }}><polygon points="12,4 13.9,9.4 19.6,9.5 15,13 16.7,18.5 12,15.2 7.3,18.5 9,13 4.4,9.5 10.1,9.4" fill="#FAFFC7" stroke="#FAFFC7" strokeWidth="2" strokeLinejoin="round" /></svg>
                        <div>
                          <strong style={{ color: "#FAFFC7", display: "block", marginBottom: "4px", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>Task</strong>
                          <span>{currentCase.task.split('.')[0]}.</span>
                        </div>
                      </li>

                      {/* Action */}
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", overflow: "visible" }}><polygon points="12,4 13.9,9.4 19.6,9.5 15,13 16.7,18.5 12,15.2 7.3,18.5 9,13 4.4,9.5 10.1,9.4" fill="#F2A7C4" stroke="#F2A7C4" strokeWidth="2" strokeLinejoin="round" /></svg>
                        <div>
                          <strong style={{ color: "#F2A7C4", display: "block", marginBottom: "4px", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>Action</strong>
                          <span>{currentCase.actionTitle.split('.')[0] || "Designed a comprehensive end-to-end solution."}</span>
                        </div>
                      </li>

                      {/* Result */}
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", gridColumn: "1 / -1" }}>
                        <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", overflow: "visible" }}><polygon points="12,4 13.9,9.4 19.6,9.5 15,13 16.7,18.5 12,15.2 7.3,18.5 9,13 4.4,9.5 10.1,9.4" fill="#FAFFC7" stroke="#FAFFC7" strokeWidth="2" strokeLinejoin="round" /></svg>
                        <div style={{ width: "100%" }}>
                          <strong style={{ color: "#FAFFC7", display: "block", marginBottom: "8px", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>Result</strong>
                          <div style={{ display: "flex", gap: "12px" }}>
                            {currentCase.metrics.slice(0,2).map((metric, idx) => (
                              <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#FFFFFF", marginBottom: "2px" }}>{metric.value}</div>
                                <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#A0A0A0" }}>{metric.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>

                    </ul>
                 </div>
              </div>

              {/* FOOTER CTA */}
              <div style={{
                marginTop: "8px",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                background: "transparent"
              }}>
                <button style={{
                  flex: "1 1 200px", background: "#F2A7C4", color: "#000", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 400, padding: "20px 32px", borderRadius: "12px", border: "1px solid #F2A7C4", cursor: "pointer", transition: "all 300ms ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px"
                }} onMouseOver={e => {e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#F2A7C4"; e.currentTarget.style.boxShadow = "0 0 20px rgba(242,167,196,0.4)"}} onMouseOut={e => {e.currentTarget.style.background = "#F2A7C4"; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = "none"}}
                onClick={() => setShowFullCaseStudy(true)}>
                  View Full Case Study ↗
                </button>
                <a
                  href="https://www.figma.com/proto/oKryn0vKJGZ8oZw63x1drX/Margdarshak?node-id=2285-32311&p=f&t=08OH4pGyXfe9PhPq-1&scaling=scale-down&content-scaling=fixed&page-id=1972%3A1741&starting-point-node-id=2285%3A32298&show-proto-sidebar=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: "0 1 auto", background: "transparent", color: "#FAFFC7", fontSize: "14px", fontWeight: 600, padding: "20px 32px", borderRadius: "12px", border: "1px solid rgba(250,255,199,0.3)", cursor: "pointer", transition: "all 300ms ease", textDecoration: "none", display: "inline-block"
                  }}
                  onMouseOver={e => {(e.currentTarget as HTMLAnchorElement).style.background = "rgba(250,255,199,0.1)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 15px rgba(250,255,199,0.2)"}}
                  onMouseOut={e => {(e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"}}
                >
                  View Prototype ↗
                </a>
              </div>

            </div>

          </div>
            );
          })()}

        </div>
      </section>

      {/* DIVIDER RIBBON */}
      <section 
        style={{
          background: "transparent",
          padding: "0",
          marginTop: "40px",
          marginBottom: "40px",
          overflow: "hidden",
          position: "relative",
          cursor: "default",
          zIndex: 20,
          pointerEvents: "none"
        }}
      >
        <div 
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            width: "fit-content",
            animation: "editorial-marquee 100s linear infinite",
          }}
        >
          {Array.from({ length: 2 }).map((_, trackIdx) => (
            <div key={trackIdx} style={{ display: "flex", gap: "60px", paddingRight: "60px" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span 
                  key={i}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                    letterSpacing: "0.1em",
                  }}
                >
                  <span className="ribbon-word">BEHAVIOURAL DESIGN</span> <span style={{ color: "#F2A7C4", margin: "0 20px", opacity: 0.5 }}>★</span> <span className="ribbon-word">INTERACTION DESIGN</span> <span style={{ color: "#FAFFC7", margin: "0 20px", opacity: 0.5 }}>★</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* THE DESIGNER'S MIND (Star Map) */}
      <DesignerMind />

      {/* TESTIMONIALS SECTION */}
      <section
        style={{
          position: "relative",
          background: "transparent",
          padding: "100px clamp(24px, 5vw, 80px)",
          overflow: "hidden",
        }}
      >
<div style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto" }}>

          {/* Section label */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.28em",
            textTransform: "uppercase" as const,
            color: "#F2A7C4",
            opacity: 0.72,
            textAlign: "center" as const,
            margin: "0 0 16px 0",
          }}>
            Field Notes
          </p>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            color: "white",
            textAlign: "center" as const,
            lineHeight: 1.1,
            margin: "0 0 16px 0",
          }}>
            Logged by people I've worked with
          </h2>

          {/* Subtext */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "18px",
            color: "rgba(255,255,255,0.28)",
            textAlign: "center" as const,
            margin: "0 0 48px 0",
          }}>
            Honest ones. Mostly.
          </p>

          {/* Cards grid */}
          {(() => {
            const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const cards = [
              {
                obs: "OBS — 001",
                source: "PRAKRITI DESIGN",
                quote: "I particularly wish to acknowledge Vishvara for her exceptional dedication and contributions.",
                name: "Bhushan Sharma",
                role: "CEO & Designer · Prakriti Design",
                sticky: "She talks a lot, god shut up Vish!",
              },
              {
                obs: "OBS — 002",
                source: "DFC HACKATHON",
                quote: "I had the opportunity to work with Vishvara during the DFC Hackathon, and her dedication, hard work, and passion for learning UI/UX truly stood out.",
                name: "Hitesh Kumawat",
                role: "Product Designer · Gracker AI",
                sticky: "She asks a lot of questions — why this, why that. Good thing I have patience.",
              },
              {
                obs: "OBS — 003",
                source: "COLLABORATOR",
                quote: "Vishvara has a rare quality — she doesn't just research users, she genuinely cares about them. Every insight she brings is grounded in real empathy, not just method. Working with her made our whole team think differently about who we were designing for.",
                name: "Komal Loat",
                role: "Senior UX/UI Designer",
                sticky: "It's her birthday so I wrote it, otherwise she would have cried.",
              },
            ];
            return (
              <div className="testimonials-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "28px",
                alignItems: "stretch",
              }}>
                {cards.map((card, idx) => {
                  const isHovered = hoveredCard === idx;
                  const stickyStyle = prefersReduced
                    ? { opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease", transform: "translateY(0%)" }
                    : { transform: isHovered ? "translateY(0%)" : "translateY(100%)", transition: "transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)" };
                  return (
                    <div
                      key={idx}
                      className="testimonial-card"
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        background: "#1A1215",
                        borderLeft: `2px solid ${isHovered ? "#F2A7C4" : "rgba(250,255,199,0.25)"}`,
                        borderRadius: "14px",
                        padding: "32px",
                        position: "relative" as const,
                        overflow: "hidden" as const,
                        display: "flex",
                        flexDirection: "column" as const,
                        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                        boxShadow: isHovered ? "0 12px 40px rgba(250,255,199,0.08)" : "none",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                      }}
                    >
                      {/* Faint ruled-line texture */}
                      <div aria-hidden="true" style={{
                        position: "absolute" as const,
                        inset: 0,
                        background: "repeating-linear-gradient(transparent, transparent 27px, rgba(242,167,196,0.04) 27px, rgba(242,167,196,0.04) 28px)",
                        pointerEvents: "none",
                        zIndex: 0,
                      }} />

                      {/* Card content */}
                      <div style={{ position: "relative" as const, zIndex: 1, display: "flex", flexDirection: "column" as const, flex: 1 }}>

                        {/* Header: obs number + source tag */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                          <span style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: "#F2A7C4",
                            letterSpacing: "0.2em",
                            fontWeight: 400,
                          }}>
                            {card.obs}
                          </span>
                          <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "10px",
                            color: "#FAFFC7",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase" as const,
                            border: "1px solid rgba(250,255,199,0.2)",
                            borderRadius: "999px",
                            padding: "3px 10px",
                          }}>
                            {card.source}
                          </span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "rgba(250,255,199,0.12)", marginBottom: "20px" }} />

                        {/* Quote */}
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontStyle: "italic",
                          fontSize: "18px",
                          color: "rgba(255,255,255,0.82)",
                          lineHeight: 1.75,
                          margin: "0 0 24px 0",
                          flex: 1,
                        }}>
                          <span style={{ color: "#F2A7C4", fontSize: "12px", marginRight: "8px", verticalAlign: "middle" }}>✦</span>
                          {card.quote}
                        </p>

                        {/* Attribution */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#2A1E22",
                            border: "1px solid rgba(242,167,196,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            <span style={{ color: "#F2A7C4", fontSize: "10px" }}>✦</span>
                          </div>
                          <div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "white", fontWeight: 400 }}>
                              {card.name}
                            </div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                              {card.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sticky note — slides up from card bottom on hover */}
                      <div
                        className="testimonial-sticky"
                        style={{
                          position: "absolute" as const,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "#FAFFC7",
                          padding: "12px 20px",
                          borderRadius: "0 0 14px 14px",
                          zIndex: 2,
                          ...stickyStyle,
                        }}
                      >
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "#6D1F2A",
                          fontWeight: 400,
                          letterSpacing: "0.02em",
                          margin: 0,
                        }}>
                          📎 "{card.sticky}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* COMING SOON SECTION */}
      <section
        style={{
          position: "relative",
          background: "transparent",
          padding: "100px clamp(24px, 5vw, 80px)",
          overflow: "hidden",
        }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.28em",
          textTransform: "uppercase" as const,
          color: "#F2A7C4",
          opacity: 0.72,
          textAlign: "center" as const,
          margin: "0 0 16px 0",
        }}>
          Coming Soon
        </p>

        <div className="coming-soon-card" style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#1A1215",
          border: "1px solid rgba(250,255,199,0.1)",
          borderRadius: "16px",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Scan-line overlay */}
          <div aria-hidden="true" style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
            pointerEvents: "none",
            zIndex: 0,
          }} />

          {/* Card content */}
          <div style={{ position: "relative", zIndex: 1 }}>

            {/* Top row: classification tag + blinking signal */}
            <div className="coming-soon-top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.28em",
                textTransform: "uppercase" as const,
                color: "#F2A7C4",
                opacity: 0.6,
              }}>
                ⬛ TRANSMISSION PENDING
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="signal-dot" style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#F2A7C4",
                  animation: "signal-blink 2s ease-in-out infinite",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase" as const,
                }}>
                  SIGNAL LOCATING
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(250,255,199,0.1)", marginBottom: "32px" }} />

            {/* Redacted lines */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px", marginBottom: "32px" }}>
              {[85, 65, 45].map((w, i) => (
                <div key={i} style={{
                  width: `${w}%`,
                  height: "10px",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.06)",
                }} />
              ))}
            </div>

            {/* Main copy */}
            <div style={{ textAlign: "center" as const }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "white",
                lineHeight: 1.1,
                margin: "0 0 16px 0",
              }}>
                Words &amp; frequencies
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.8,
                margin: "0 0 8px 0",
              }}>
                Something is being written. Something is being recorded.
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.08em",
                margin: "0 0 36px 0",
              }}>
                Blogs. Videos. Transmissions from the field.
              </p>
            </div>

            {/* Frequency / waveform bars */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "4px" }}>
              {Array.from({ length: 28 }, (_, i) => {
                const height = 6 + ((i * 17 + 3) % 23);
                const shouldAnimate = i % 2 === 1;
                const dur = (1.2 + ((i * 11) % 80) / 100).toFixed(1);
                const del = ((i * 7) % 100 / 100).toFixed(2);
                return (
                  <div
                    key={i}
                    className={shouldAnimate ? "freq-bar" : undefined}
                    style={{
                      width: "3px",
                      height: `${height}px`,
                      borderRadius: "2px",
                      background: "linear-gradient(to top, #FAFFC7, #F2A7C4)",
                      opacity: 0.25,
                      flexShrink: 0,
                      transformOrigin: "center bottom",
                      animation: shouldAnimate ? `freq-pulse ${dur}s ease-in-out ${del}s infinite` : "none",
                    }}
                  />
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section
        id="contact"
        style={{
          position: "relative",
          background: "transparent",
          padding: "100px clamp(24px, 5vw, 80px)",
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
                  <stop offset="0%" stopColor="#EDE5D8" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#EDE5D8" stopOpacity="0" />
                </radialGradient>
                <mask id="cs-crescentMask">
                  <rect x="0" y="0" width="800" height="500" fill="white" />
                  <circle cx="692" cy="154" r="24" fill="black" />
                </mask>
                <filter id="cs-blur80">
                  <feGaussianBlur stdDeviation="80" />
                </filter>
              </defs>
              <rect width="800" height="500" fill="url(#cs-skyGrad)" />
              <circle cx="150" cy="180" r="160" fill="#F2A7C4" opacity="0.02" filter="url(#cs-blur80)" />
              <circle cx="650" cy="160" r="180" fill="#6D1F2A" opacity="0.034" filter="url(#cs-blur80)" />
              {/* Static background stars — no animate tags */}
              <g fill="#ffffff">
                {BACKGROUND_STARS.map(star => (
                  <circle key={`cs-star-${star.id}`} cx={star.x} cy={star.y} r={star.r} opacity={0.3} />
                ))}
              </g>
              <circle cx="700" cy="160" r="64" fill="url(#cs-moonGlow)" />
              <circle cx="700" cy="160" r="24" fill="#EDE5D8" mask="url(#cs-crescentMask)" />
              <path fill="#151515" d="M0 300 C80 270 140 285 220 295 C320 308 430 260 530 280 C620 300 710 275 800 290 L800 500 L0 500 Z" />
              <path fill="#0F0F0F" d="M0 340 C90 295 190 325 280 350 C390 375 500 300 610 325 C700 345 760 320 800 335 L800 500 L0 500 Z" />
              <path fill="#050505" d="M0 395 C70 365 150 390 250 410 C360 430 470 380 590 400 C700 420 760 390 800 405 L800 500 L0 500 Z" />
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
              <g filter="drop-shadow(0 0 6px #F2A7C4)">
                <line x1="18%" y1="22%" x2="23%" y2="28%" stroke="#F2A7C4" strokeWidth="0.8" opacity="0.45" />
                <line x1="23%" y1="28%" x2="20%" y2="32%" stroke="#F2A7C4" strokeWidth="0.8" opacity="0.45" />
                <line x1="20%" y1="32%" x2="26%" y2="30%" stroke="#F2A7C4" strokeWidth="0.8" opacity="0.45" />
                <circle cx="18%" cy="22%" r="2.5" fill="#F2A7C4" opacity="0.9" />
                <circle cx="23%" cy="28%" r="2.5" fill="#F2A7C4" opacity="0.9" />
                <circle cx="20%" cy="32%" r="2.5" fill="#F2A7C4" opacity="0.9" />
                <circle cx="26%" cy="30%" r="2.5" fill="#F2A7C4" opacity="0.9" />
              </g>
              {/* Cluster 2 — center ~48%, 20% */}
              <g filter="drop-shadow(0 0 5px #FAFFC7)">
                <line x1="45%" y1="18%" x2="50%" y2="22%" stroke="#FAFFC7" strokeWidth="0.7" opacity="0.4" />
                <line x1="50%" y1="22%" x2="47%" y2="26%" stroke="#FAFFC7" strokeWidth="0.7" opacity="0.4" />
                <line x1="50%" y1="22%" x2="53%" y2="19%" stroke="#FAFFC7" strokeWidth="0.7" opacity="0.4" />
                <line x1="47%" y1="26%" x2="52%" y2="27%" stroke="#FAFFC7" strokeWidth="0.7" opacity="0.4" />
                <circle cx="45%" cy="18%" r="2" fill="#FAFFC7" opacity="0.85" />
                <circle cx="50%" cy="22%" r="2" fill="#FAFFC7" opacity="0.85" />
                <circle cx="47%" cy="26%" r="2" fill="#FAFFC7" opacity="0.85" />
                <circle cx="53%" cy="19%" r="2" fill="#FAFFC7" opacity="0.85" />
                <circle cx="52%" cy="27%" r="2" fill="#FAFFC7" opacity="0.85" />
              </g>
              {/* Cluster 3 — mid-right ~80%, 38% */}
              <g filter="drop-shadow(0 0 4px #F2A7C4)">
                <line x1="78%" y1="35%" x2="83%" y2="39%" stroke="#F2A7C4" strokeWidth="0.8" opacity="0.45" />
                <line x1="83%" y1="39%" x2="80%" y2="43%" stroke="#F2A7C4" strokeWidth="0.8" opacity="0.45" />
                <circle cx="78%" cy="35%" r="2" fill="#F2A7C4" opacity="0.8" />
                <circle cx="83%" cy="39%" r="2" fill="#F2A7C4" opacity="0.8" />
                <circle cx="80%" cy="43%" r="2" fill="#F2A7C4" opacity="0.8" />
              </g>
            </svg>

            {/* Girl PNG */}
            <img
              src={girlImg}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "28%",
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
                borderRight: "1px dashed rgba(242,167,196,0.15)",
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
              color: "#F2A7C4",
              opacity: 0.72,
              margin: "0 0 16px 0",
            }}>
              Send a message
            </p>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              color: "white",
              lineHeight: 1.1,
              margin: "0 0 16px 0",
            }}>
              You've made it this far.
            </h2>

            {/* Subheadline */}
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
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
                  color: "#F2A7C4",
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
                  color: "#F2A7C4",
                  opacity: 0.7,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.textDecoration = "underline"; }}
                onMouseOut={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.textDecoration = "none"; }}
              >
                vishvara.ux@gmail.com
              </a>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px" }}>·</span>
              <a
                href="https://www.linkedin.com/in/vishvara-gandharv"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#F2A7C4",
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
    </>
  );
}
