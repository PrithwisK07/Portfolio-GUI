import { Project } from "./types";

export const projectsData: Project[] = [
  {
    id: "lumina",
    color: "#FF2D55",
    title: "Lumina",
    year: "2026",
    category: "E-Commerce",
    desc: "A revolutionary e-commerce experience blending spatial design with seamless purchasing flows.",
    challenge:
      "Physical retail provides tactile feedback that digital spaces inherently lack. The challenge was to bridge this gap, ensuring users feel the texture, scale, and volume of products without physical touch.",
    solution:
      "We engineered a custom WebGL pipeline to render 3D product models with real-time lighting constraints. Combined with fluid micro-interactions and a bespoke checkout flow, we reduced user friction significantly.",
    stats: [
      { label: "Conversion", prefix: "+", val: 42, suffix: "%", isFloat: false },
      { label: "Engagement", prefix: "", val: 2.4, suffix: "x", isFloat: true },
      { label: "Load Time", prefix: "<", val: 1.2, suffix: "s", isFloat: true },
    ],
    images: {
      gallery1: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop",
      gallery2: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
      gallery3: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    },
  },
  {
    id: "aura",
    color: "#007AFF",
    title: "Aura Platform",
    year: "2025",
    category: "Web App",
    desc: "Aura is a next-generation web application designed for creative professionals.",
    challenge:
      "Creative tools often suffer from UI clutter, breaking the flow state of professionals. We needed to design a robust platform that felt invisible when not actively interacted with.",
    solution:
      "Aura utilizes spatial UI principles. Tools only manifest contextually based on cursor velocity and selection intent, maintaining a distraction-free canvas emphasizing kinetic typography and deep focus.",
    stats: [
      { label: "Active Users", prefix: "", val: 120, suffix: "K+", isFloat: false },
      { label: "Retention", prefix: "", val: 88, suffix: "%", isFloat: false },
      { label: "Awards", prefix: "", val: 3, suffix: " FWA", isFloat: false },
    ],
    images: {
      gallery1: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop",
      gallery2: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
      gallery3: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop",
    },
  },
  {
    id: "nexus",
    color: "#9DFE51",
    title: "Nexus Void",
    year: "2024",
    category: "Immersive",
    desc: "An experimental digital art installation exploring the concept of digital nothingness.",
    challenge:
      "How do you visualize the absence of data? The objective was to create a meditative digital landscape that paradoxically felt full of life while representing emptiness.",
    solution:
      "Using complex shader mathematics and fluid dynamics simulations, we created an interactive particle system that responds to webcam depth data, allowing users to physically push through the 'void'.",
    stats: [
      { label: "Exhibitions", prefix: "0", val: 4, suffix: "", isFloat: false },
      { label: "Interactions", prefix: "", val: 2.1, suffix: "M+", isFloat: true },
      { label: "Render", prefix: "", val: 60, suffix: "FPS", isFloat: false },
    ],
    images: {
      gallery1: "https://images.unsplash.com/photo-1770462988092-f8c614308a81?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gallery2: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
      gallery3: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    },
  },
];