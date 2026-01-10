import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Terminal as TerminalIcon,
  Activity,
  Shield,
  AlertTriangle,
  Play,
  Square,
  Send,
  Settings,
  Server,
  Cpu,
  Wifi,
  Globe,
  Lock,
  Search,
  ChevronDown,
  MoreHorizontal,
  Command,
  Zap,
  Database,
  Hash,
  Eye,
  X,
  Minimize2,
  Maximize2,
  Crosshair,
  Radio,
  MapPin,
  Layers,
  Code,
  HardDrive,
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  Siren,
  BarChart3,
  Quote,
  Star,
  Check,
  LayoutGrid,
  Users,
  Bell,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  Smartphone,
  Mail,
  FileText,
  Filter,
  GitBranch,
  Box,
  ShieldCheck,
  CloudLightning,
  Loader2,
  Bot,
  MessageSquare,
  Sparkles,
  Copy,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

// --- CONFIGURATION & CONSTANTS ---
const CONFIG = {
  refreshRate: 800,
  maxLogs: 200,
};

const COLORS = {
  bg: '#050505',
  panel: '#0a0a0a',
  border: '#333333',
  primary: '#00f0ff', // Cyan
  secondary: '#7000ff', // Purple
  alert: '#ff003c', // Red
  success: '#00ff9f', // Green
  warn: '#ffcc00', // Amber
  text: '#e0e0e0',
  textDim: '#666666'
};

// --- LOG DATA TEMPLATES ---
const BOOT_SEQUENCE = [
  "✅ Self-Healing System Ready!",
  "✅ Model Loaded Successfully!",
  "🕸️ Honeynet initializing...",
  "🍯 SSH Honeypot listening on port 2222",
  "🍯 HTTP Honeypot listening on port 8080",
  "🍯 FTP Honeypot listening on port 2121",
  "✅ Honeynet is ACTIVE (SSH, HTTP, FTP)",
  "🤖 A_ura_bot is now active!",
  "🔍 Monitoring Network Traffic in Real Time..."
];

const TRAFFIC_LOGS = [
  "📡 Captured Packet: Ether / IP / TCP 172.16.2.184:http > 192.168.143.99:5390 SA",
  "📡 Captured Packet: Ether / IP / TCP 172.16.2.184:http > 192.168.143.99:18897 SA",
  "📡 Captured Packet: Ether / IP / UDP / mDNS Ans b'I1BRUU38n14AAA._FC9F5ED42C8A._tcp.local.'",
  "📡 Captured Packet: Ether / IP / TCP 172.16.2.184:http > 192.168.143.99:35075 SA",
  "🔒 SSL/TLS Handshake: Client Hello from 192.168.1.105",
  "💾 SQL Query: SELECT * FROM users WHERE admin = 1 -- (Blocked)",
  "🚫 Firewall: Dropped packet from 10.0.0.5 on port 445 (SMB)",
  "🟢 Service Status: Auth Service heartbeat received (12ms)",
  "⚠️ Anomaly: High outbound traffic detected on port 53 (DNS Tunneling?)",
  "📤 Data Exfiltration Blocked: Pattern match 'credit_card' in payload"
];

const THREAT_SEQUENCE = [
  "⚠️ Isolating Threat from 172.16.2.184...",
  "Ok.",
  "❌ Blocked IP: 172.16.2.184",
  "Deleted 1 rule(s).",
  "Ok.",
  "✅ Auto-Healed: 172.16.2.184 is unblocked!"
];

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&family=Rajdhani:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    :root { 
      --primary: ${COLORS.primary}; 
      --alert: ${COLORS.alert}; 
      --bg: ${COLORS.bg};
    }
     
     
    body { 
      background-color: ${COLORS.bg}; 
      color: ${COLORS.text}; 
      font-family: 'Inter', sans-serif; 
      overflow: hidden; 
    }
     
     
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .font-tech { font-family: 'Rajdhani', sans-serif; }
     
     
    /* SCROLLBAR */
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${COLORS.primary}; }

    /* EFFECTS */
    .crt-overlay {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
     
     
    .glass-panel {
      background: rgba(10, 10, 10, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }

    /* SHOOTING STAR ANIMATION */
    @keyframes shooting {
      0% { transform: translateX(0) translateY(0) rotate(215deg); opacity: 1; }
      100% { transform: translateX(-500px) translateY(500px) rotate(215deg); opacity: 0; }
    }
     
     
    .shooting-star {
      position: absolute;
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,1);
      animation: shooting 3s linear infinite;
    }
    .shooting-star::before {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 200px;
      height: 1px;
      background: linear-gradient(90deg, rgba(255,255,255,1), transparent);
    }

    /* MARQUEE ANIMATION */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 30s linear infinite;
    }

    .animate-blob {
        animation: blob 7s infinite;
    }

    @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
    }

    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `}</style>
);

const FlowchartTab = () => {
  const nodes = [
    {
      id: "internet",
      label: "INTERNET",
      subtitle: "Inbound Traffic",
      type: "external",
      x: 40,
      y: 60,
      packets: "112",
      latency: "4ms",
    },
    {
      id: "edge-fw",
      label: "EDGE-FW",
      subtitle: "Edge Firewall",
      type: "security",
      x: 280,
      y: 60,
      packets: "337",
      latency: "5ms",
    },
    {
      id: "ids",
      label: "IDS",
      subtitle: "Sentinel IDS Core",
      type: "core",
      x: 520,
      y: 60,
      packets: "193",
      latency: "2ms",
    },
    {
      id: "siem",
      label: "SIEM",
      subtitle: "SIEM / SOC",
      type: "monitor",
      x: 760,
      y: 60,
      packets: "185",
      latency: "9ms",
    },
    {
      id: "dmz",
      label: "DMZ",
      subtitle: "DMZ Services",
      type: "service",
      x: 280,
      y: 280,
      packets: "497",
      latency: "8ms",
    },
    {
      id: "db",
      label: "DB",
      subtitle: "Database Cluster",
      type: "service",
      x: 520,
      y: 280,
      packets: "663",
      latency: "2ms",
    },
  ];

  const edges = [
    {
      from: "internet",
      to: "edge-fw",
      label: "Inbound Traffic",
      style: "solid",
    },
    { from: "edge-fw", to: "ids", label: "Mirrored Packets", style: "solid" },
    { from: "ids", to: "siem", label: "Alerts / Logs", style: "solid" },
    { from: "edge-fw", to: "dmz", label: "Allow / Block", style: "dashed" },
    { from: "ids", to: "dmz", label: "", style: "dashed" },
    { from: "ids", to: "db", label: "Micro Rules", style: "dashed" },
  ];

  const getNodeColors = (type) => {
    const colors = {
      core: {
        border: "#00f0ff",
        bg: "rgba(0,240,255,0.12)",
        shadow: "rgba(0,240,255,0.25)",
      },
      security: {
        border: "#ff003c",
        bg: "rgba(255,0,60,0.12)",
        shadow: "rgba(255,0,60,0.25)",
      },
      service: {
        border: "#7000ff",
        bg: "rgba(112,0,255,0.12)",
        shadow: "rgba(112,0,255,0.25)",
      },
      monitor: {
        border: "#00ff9f",
        bg: "rgba(0,255,159,0.12)",
        shadow: "rgba(0,255,159,0.25)",
      },
      external: {
        border: "#505050",
        bg: "rgba(80,80,80,0.08)",
        shadow: "rgba(255,255,255,0.08)",
      },
    };
    return colors[type] || colors.external;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col gap-8 max-w-7xl mx-auto p-6"
    >
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl flex items-center justify-between border border-white/5 shadow-2xl">
        <h2 className="text-2xl font-bold font-tech text-white flex items-center gap-4">
          <GitBranch className="text-[#00f0ff] drop-shadow-lg" size={26} />
          ARCHITECTURE FLOW
        </h2>
        <div className="flex gap-5 text-sm font-mono text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.8)] animate-pulse" />
            Core
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff003c] shadow-[0_0_12px_rgba(255,0,60,0.8)] animate-pulse" />
            Security
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#7000ff] shadow-[0_0_12px_rgba(112,0,255,0.8)] animate-pulse" />
            Services
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00ff9f] shadow-[0_0_12px_rgba(0,255,159,0.8)] animate-pulse" />
            Monitoring
          </span>
        </div>
      </div>

      {/* Main Flowchart Canvas */}
      <div
        className="glass-panel rounded-xl p-10 relative overflow-hidden border border-white/5 shadow-2xl"
        style={{ minHeight: "520px" }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.2) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            {edges.map((_, i) => (
              <marker
                key={`arrow-${i}`}
                id={`arrow-${i}`}
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M0,0 L0,10 L10,5 z"
                  fill="#00f0ff"
                  opacity="0.85"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                />
              </marker>
            ))}
          </defs>
          {edges.map((edge, i) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;

            const x1 = from.x + 120;
            const y1 = from.y + 55;
            const x2 = to.x + 10;
            const y2 = to.y + 55;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={i}>
                <path
                  d={`M${x1},${y1} C ${midX},${y1 + 10} ${midX},${
                    y2 - 10
                  } ${x2},${y2}`}
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={edge.style === "dashed" ? "8 8" : "0"}
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${i})`}
                  opacity="0.75"
                  filter="url(#glow)"
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY - 15}
                    className="font-mono text-[12px]"
                    fill="#00f0ff"
                    textAnchor="middle"
                    fontWeight="600"
                    filter="url(#glow-text)"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Glow Filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2"
              floodColor="#00f0ff"
              floodOpacity="0.4"
            />
          </filter>
          <filter id="glow-text" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1"
              floodColor="#00f0ff"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const c = getNodeColors(node.type);
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
              whileHover={{ scale: 1.08, y: -6 }}
              whileTap={{ scale: 0.98 }}
              className="absolute w-[220px] h-[110px] rounded-2xl flex flex-col justify-between p-5 border backdrop-blur-md z-20 cursor-pointer transition-all duration-300 shadow-2xl"
              style={{
                left: node.x,
                top: node.y,
                border: `2px solid ${c.border}`,
                backgroundColor: c.bg,
                boxShadow: `0 12px 32px ${c.shadow}, 0 0 32px ${c.border}50, inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
            >
              {/* Node Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-400 uppercase tracking-widest font-bold">
                  {node.id.toUpperCase()}
                </span>
                <div
                  className="w-3 h-3 rounded-full shadow-lg animate-pulse"
                  style={{
                    backgroundColor: c.border,
                    boxShadow: `0 0 12px ${c.border}80`,
                  }}
                />
              </div>

              {/* Node Title */}
              <div className="text-lg font-tech font-bold text-white leading-tight tracking-tight">
                {node.subtitle}
              </div>

              {/* Node Stats */}
              <div className="flex justify-between items-end text-sm font-mono">
                <span className="text-gray-400">
                  Packets{" "}
                  <span className="text-white font-bold text-base">
                    {node.packets}
                  </span>
                  /s
                </span>
                <span className="text-gray-400">
                  Latency{" "}
                  <span className="text-white font-bold">{node.latency}</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            step: "Ingress",
            desc: "Traffic arrives from the Internet and is mirrored at the edge firewall for initial inspection.",
            color: "#00f0ff",
          },
          {
            step: "Analysis",
            desc: "Sentinel IDS core inspects packets, scores risk levels, and tags suspicious flows.",
            color: "#00ff9f",
          },
          {
            step: "Enforcement",
            desc: "Rules are pushed to services, databases, and SIEM for real-time enforcement.",
            color: "#7000ff",
          },
        ].map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-panel rounded-xl p-6 border-l-[4px] hover:shadow-2xl transition-all duration-500 border border-white/5 hover:border-white/20 backdrop-blur-md"
            style={{ borderLeftColor: s.color }}
          >
            <div className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-3 font-bold">
              STEP 0{i + 1}
            </div>
            <div className="text-lg font-tech font-bold text-white mb-3 tracking-tight">
              {s.step}
            </div>
            <div className="text-sm text-gray-400 leading-relaxed font-medium">
              {s.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("landing");

  useEffect(() => {
    // Fake boot sequence duration
    const timer = setTimeout(() => setLoading(false), 3800);
    return () => clearTimeout(timer);
  }, []);
   
  return (
    <>
      <GlobalStyles />
      <div className="relative min-h-screen w-full bg-[#050505] text-gray-200 overflow-hidden selection:bg-[#00f0ff] selection:text-black">
        <div className="fixed inset-0 crt-overlay z-[9999] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loader" />
          ) : view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 overflow-hidden"
            >
              <LandingPage onEnter={() => setView('dashboard')} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="absolute inset-0 bg-[#050505]"
            >
              <Dashboard onLogout={() => setView('landing')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// --- LOADING SCREEN COMPONENT ---
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [bootText, setBootText] = useState("INITIALIZING_KERNEL...");
   
  useEffect(() => {
    const texts = [
      "LOADING_NEURAL_MODULES...",
      "CONNECTING_TO_SATELLITE_UPLINK...",
      "VERIFYING_INTEGRITY_HASHES...",
      "ESTABLISHING_SECURE_TUNNEL...",
      "DECRYPTING_ASSETS...",
      "SYSTEM_READY."
    ];
    
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    // Cycle text
    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex < texts.length) {
        setBootText(texts[textIndex]);
        textIndex++;
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <motion.div 
      className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] relative z-50 font-mono"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#00f0ff] blur-[40px] opacity-20 animate-pulse" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        >
          <ShieldCheck size={80} className="text-[#00f0ff]" strokeWidth={1} />
        </motion.div>
      </div>

      <h1 className="text-3xl font-bold font-tech text-white mb-2 tracking-[0.2em]">
        Crypt<span className="text-[#00f0ff]">On</span>
      </h1>

      <div className="w-64 h-1 bg-[#1a1a1a] rounded-full overflow-hidden mb-2 relative">
        <motion.div 
          className="h-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" 
          style={{ width: `${progress}%` }}
        />
      </div>
       
      <div className="h-6 flex items-center justify-between w-64 text-[10px] text-gray-500 font-mono">
        <span>{bootText}</span>
        <span className="text-[#00f0ff]">{progress}%</span>
      </div>
    </motion.div>
  );
};

// --- SHADCN-LIKE COMPONENTS ---
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-tech uppercase tracking-wider";
   
  const variants = {
    primary: "bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)]",
    secondary: "bg-[#1a1a1a] text-white hover:bg-[#333] border border-[#333]",
    ghost: "hover:bg-[#ffffff10] text-gray-300 hover:text-white",
    outline: "border border-[#00f0ff] text-[#00f0ff] bg-transparent hover:bg-[#00f0ff]/10",
    destructive: "bg-[#ff003c] text-white hover:bg-[#ff003c]/90"
  };
   
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-9 w-9"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm text-gray-200 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const styles = variant === 'outline' 
    ? 'border border-[#333] text-gray-400' 
    : 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20';
     
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles}`}>
      {children}
    </span>
  );
};

// --- LANDING PAGE ---
const LandingPage = ({ onEnter }) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
   
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={scrollRef} className="h-screen w-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth relative perspective-1000">
      
      {/* Dynamic Background */}
      <motion.div 
        style={{ y: bgY }}
        className="fixed inset-0 z-0 bg-black pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7000ff]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 overflow-hidden">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="shooting-star" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
           ))}
        </div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 90%)' }} />
      </motion.div>
      
      <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-[#050505]/80 backdrop-blur supports-[backdrop-filter]:bg-[#050505]/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <Shield className="h-6 w-6 text-[#00f0ff]" />
            <span className="text-lg font-bold font-tech tracking-wide text-white">
              Crypt<span className="text-[#00f0ff]">On</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#00f0ff] transition-colors">Features</button>
            <button onClick={() => scrollToSection('architecture')} className="hover:text-[#00f0ff] transition-colors">Architecture</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#00f0ff] transition-colors">Pricing</button>
          </nav>
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={onEnter}>Launch Console</Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* --- HERO SECTION --- */}
        <section id="hero" className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
          <motion.div style={{ opacity: opacityHero }} className="flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge variant="outline"> <span className="w-2 h-2 bg-[#00ff9f] rounded-full mr-2 inline-block animate-pulse"></span> Systems Operational</Badge>
            </motion.div>
            
            <motion.h1 
              className="mt-6 text-6xl md:text-9xl font-black tracking-tighter text-white font-tech uppercase leading-[0.9]" 
              initial={{ opacity: 0, y: 30, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Defend
              </motion.div>
              <motion.div 
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-white to-[#7000ff] bg-300% animate-pulse"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                The Network
              </motion.div>
            </motion.h1>
            
            <motion.p 
              className="mt-8 text-xl md:text-2xl text-gray-400 max-w-3xl font-light" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              Military-grade intrusion detection powered by advanced neural networks. Real-time threat analysis, automated mitigation, and global node visualization.
            </motion.p>
            
            <motion.div 
              className="mt-12 flex flex-col md:flex-row gap-6" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" onClick={onEnter} className="gap-2 px-10 h-16 text-xl"> <TerminalIcon size={24} /> Initialize Console </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" className="gap-2 px-10 h-16 text-xl"> <Play size={24} /> Watch Demo </Button>
              </motion.div>
            </motion.div>

            {/* Floating orbs */}
            <div className="absolute -top-40 -left-20 w-64 h-64 bg-[#7000ff] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-0"></div>
            <div className="absolute -bottom-40 -right-20 w-64 h-64 bg-[#00f0ff] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
          </motion.div>

          <motion.div 
            className="absolute bottom-10 animate-bounce cursor-pointer"
            onClick={() => scrollToSection('ticker')}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="text-gray-500" size={32} />
            </motion.div>
          </motion.div>
        </section>

        {/* --- LIVE THREAT TICKER --- */}
        <section id="ticker" className="w-full bg-[#00f0ff]/5 border-y border-[#00f0ff]/20 py-4 overflow-hidden relative">
           <div className="flex animate-marquee whitespace-nowrap gap-12">
             {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]">
                   <AlertTriangle size={12} />
                   <span>THREAT_DETECTED_IP_192.168.0.{Math.floor(Math.random() * 255)}</span>
                   <span className="text-gray-500">::</span>
                   <span>PORT_{Math.floor(Math.random() * 9000) + 1000}</span>
                   <span className="text-gray-500">::</span>
                   <span className="text-[#ff003c]">BLOCK_SUCCESS</span>
                 </div>
             ))}
           </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="w-full max-w-7xl px-6 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-tech text-white mb-6">Core Capabilities</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to secure your infrastructure, from packet-level inspection to global threat visualization.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard delay={0.1} icon={<Zap className="text-yellow-400" />} title="Real-time Detection" desc="Microsecond latency analysis of inbound packet streams using WebAssembly modules." />
            <FeatureCard delay={0.2} icon={<Fingerprint className="text-[#00f0ff]" />} title="AI Threat Signatures" desc="Deep learning models trained on 50PB of attack data to identify zero-day exploits." />
            <FeatureCard delay={0.3} icon={<Globe className="text-[#7000ff]" />} title="Global Grid" desc="Visualize attack vectors across geographical nodes in a unified 3D interface." />
            <FeatureCard delay={0.4} icon={<Lock className="text-[#00ff9f]" />} title="Automated Mitigation" desc="Instant IP banning and firewall rule propagation across your entire mesh." />
            <FeatureCard delay={0.5} icon={<HardDrive className="text-pink-500" />} title="Forensic Logging" desc="Immutable ledger of all security events with payload inspection and hex dumps." />
            <FeatureCard delay={0.6} icon={<Siren className="text-red-500" />} title="Incident Response" desc="Integrated alerting system via Webhooks, Slack, and PagerDuty." />
          </div>
        </section>

        {/* --- SYSTEM ARCHITECTURE --- */}
        <section
          id="architecture"
          className="w-full bg-[#0a0a0a] py-32 border-y border-[#222]"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-tech text-white mb-6">
                Neural Mesh Architecture
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Our distributed sensor network feeds directly into a central AI
                core. Unlike traditional firewalls, Sentinel learns from traffic
                patterns in real-time, adapting its defense strategies
                milliseconds after a new threat vector is identified.
              </p>
              <ul className="space-y-4">
                {[
                  "Distributed Sensor Nodes",
                  "Centralized AI Processing",
                  "Real-time Rule Propagation",
                  "Encrypted Data Lake",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="text-[#00f0ff]" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 relative aspect-square max-w-md w-full bg-[#050505] rounded-full border border-[#333] flex items-center justify-center p-12"
            >
              {/* Animated Diagram */}
              <div
                className="absolute inset-0 rounded-full border border-[#00f0ff]/20 animate-ping opacity-20"
                style={{ animationDuration: "3s" }}
              />
              <div
                className="absolute inset-12 rounded-full border border-[#7000ff]/20 animate-ping opacity-20"
                style={{ animationDuration: "2s" }}
              />

              <div className="relative z-10 w-32 h-32 bg-[#1a1a1a] rounded-full border border-[#00f0ff] flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                <Cpu size={48} className="text-white" />
              </div>

              {/* Orbiting Icons */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 bg-[#050505] p-2 rounded-lg border border-[#333] text-gray-400">
                <CloudLightning size={20} />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 bg-[#050505] p-2 rounded-lg border border-[#333] text-gray-400">
                <Database size={20} />
              </div>
              <div className="absolute left-0 top-1/2 -translate-x-6 -translate-y-1/2 bg-[#050505] p-2 rounded-lg border border-[#333] text-gray-400">
                <Globe size={20} />
              </div>
              <div className="absolute right-0 top-1/2 translate-x-6 -translate-y-1/2 bg-[#050505] p-2 rounded-lg border border-[#333] text-gray-400">
                <ShieldCheck size={20} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- PRICING & FOOTER --- */}

        <footer className="w-full border-t border-[#222] bg-[#0a0a0a] py-12">
           <div className="container mx-auto px-6 text-center text-gray-500">
             <p>© 2025 SENTINEL CORE. DEFENDING THE FUTURE.</p>
           </div>
        </footer>

      </div>
    </div>
  );
};

const FeatureCard = React.memo(({ icon, title, desc, delay }) => (
  <div>
    <Card className="p-8 h-full hover:border-[#00f0ff]/50 transition-all duration-300 group bg-[#0a0a0a]/50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#00f0ff]/10 via-transparent to-[#7000ff]/10"></div>
      <div className="relative z-10 mb-6 p-4 rounded-xl bg-[#1a1a1a] w-fit border border-[#333] group-hover:border-[#00f0ff]/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
        <div>{icon}</div>
      </div>
      <h3 className="relative z-10 text-xl font-bold text-white mb-3 font-tech">
        {title}
      </h3>
      <p className="relative z-10 text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00f0ff] to-[#7000ff] w-0 group-hover:w-full transition-all duration-500" />
    </Card>
  </div>
));

const PricingCard = React.memo(({ title, price, features, recommended }) => (
  <div className="group">
    <Card
      className={`p-8 relative overflow-hidden ${
        recommended
          ? "border-[#00f0ff] bg-[#00f0ff]/5"
          : "bg-[#0a0a0a]/50 hover:border-[#333]"
      } transition-all duration-300 h-full`}
    >
      {recommended && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-[#00f0ff] text-black">Recommended</Badge>
        </div>
      )}
      <h3 className="text-2xl font-bold text-white font-tech mb-4 relative z-10">
        {title}
      </h3>
      <div className="text-4xl font-bold text-white mb-6 relative z-10">
        {price}
      </div>
      <div className="space-y-4 mb-8 text-left relative z-10">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2 text-gray-400 group/item">
            <div><Check size={16} className="text-[#00f0ff] flex-shrink-0 mt-1" /></div>
            <span className="group-hover/item:text-white transition-colors">{f}</span>
          </div>
        ))}
      </div>
      <div className="relative z-10">
        <Button
          variant={recommended ? "primary" : "outline"}
          className="w-full group/btn"
        >
          <span className="inline-flex items-center gap-2">
            Select Plan <span>→</span>
          </span>
        </Button>
      </div>
    </Card>
  </div>
));

// --- INTEL TAB (AI CHATBOT) ---
const IntelTab = ({ logs, stats }) => {
  const [messages, setMessages] = useState([
    { role: 'model', text: "I am Sentinel's AI Threat Analyst. I can analyze recent logs, explain attack vectors, or recommend mitigation strategies. How can I assist?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // API Key provided by environment. If running locally, you must provide a valid key.
      const apiKey = "AIzaSyALR2ZMEbnpOnPQORq7vqaFrKLywFJU0Ic";

      const systemContext = `
        System Status:
        - CPU: ${stats.cpu.toFixed(1)}%
        - RAM: ${stats.ram.toFixed(1)}%
        - Network: ${stats.net.toFixed(1)} MB/s
        - Active Threats: ${stats.threats}
        - Recent Logs: ${logs
          .slice(-5)
          .map((l) => (typeof l === "string" ? l : JSON.stringify(l)))
          .join("\n")}
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `System Context:\n${systemContext}\n\nUser Question:\n${userMsg}`,
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [
                {
                  text: "You are Sentinel AI, an advanced cybersecurity assistant. Analyze the provided system stats and logs to answer the user's questions. Keep responses technical, concise, and futuristic. If the user asks to block an IP or take action, confirm the action in a simulated manner.",
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!botText) {
        throw new Error("No response content");
      }

      setMessages((prev) => [...prev, { role: "model", text: botText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ UPLINK FAILED: ${error.message}. \n(Check console for details. If running locally, ensure API Key is set.)`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full flex flex-col gap-4 max-w-5xl mx-auto"
    >
       <div className="flex justify-between items-center glass-panel p-4 rounded-xl">
         <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
             <Sparkles className="text-[#00f0ff]" /> INTELLIGENCE_CORE_V4
         </h2>
         <div className="flex gap-2 items-center">
             <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#00ff9f]/10 text-[#00ff9f] text-xs">
                <div className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse"></div>
                ONLINE
             </div>
         </div>
       </div>

       <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col relative">
          <div className="absolute inset-0 bg-center bg-no-repeat opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)' }}></div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
             {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-xl border ${msg.role === 'user' ? 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-white rounded-br-none' : 'bg-[#1a1a1a] border-[#333] text-gray-300 rounded-bl-none'}`}>
                      <div className="flex items-center gap-2 mb-2 opacity-50 text-xs font-mono uppercase">
                         {msg.role === 'user' ? <Users size={12} /> : <Bot size={12} />}
                         {msg.role === 'user' ? 'OPERATOR' : 'SENTINEL_AI'}
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                   </div>
                </div>
             ))}
             {isLoading && (
                <div className="flex justify-start">
                   <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#333] rounded-bl-none flex items-center gap-2 text-gray-500 text-sm">
                      <Loader2 className="animate-spin" size={16} /> Analyzing threat vectors...
                   </div>
                </div>
             )}
             <div ref={scrollRef} />
          </div>

          <div className="p-4 border-t border-[#333] bg-[#0a0a0a]">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Sentinel AI about threats, logs, or mitigation strategies..."
                  className="flex-1 bg-[#050505] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none placeholder-gray-600 font-mono"
                />
                <Button onClick={handleSend} disabled={isLoading} className="w-12 h-full flex items-center justify-center">
                   <Send size={18} />
                </Button>
             </div>
          </div>
       </div>
    </motion.div>
  );
};

// --- NEW DASHBOARD COMPONENTS ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: "overview", icon: LayoutGrid, label: "Overview" },
    { id: "trends", icon: BarChart3, label: "Analytics" },
    { id: "logs", icon: FileText, label: "System Logs" },
    { id: "nodes", icon: Server, label: "Network Map" },
    { id: "flow", icon: GitBranch, label: "Architecture" },
    { id: "api", icon: Code, label: "API Docs" },
    { id: "health", icon: ShieldCheck, label: "Health Check" },
    { id: "intelligence", icon: Bot, label: "Intel" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="w-16 md:w-20 border-r border-[#222] bg-[#0a0a0a]/90 backdrop-blur flex flex-col items-center py-6 gap-6 z-20 overflow-y-auto custom-scrollbar"
      className="w-16 md:w-20 border-r border-[#222] bg-[#0a0a0a]/90 backdrop-blur flex flex-col items-center py-6 gap-6 z-20 overflow-y-auto custom-scrollbar"
    >
      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mb-4 shrink-0">
      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mb-4 shrink-0">
        <Shield className="text-[#00f0ff]" size={24} />
      </div>
      
      {items.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-3 rounded-xl transition-all duration-300 group shrink-0 ${
            activeTab === item.id
              ? "bg-[#00f0ff]/10 text-[#00f0ff]"
              : "text-gray-500 hover:text-white hover:bg-[#ffffff05]"
          }`}
        >
          <item.icon size={20} />
          {activeTab === item.id && (
            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00f0ff] rounded-r-full" />
          )}
          
          <span className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1a1a1a] border border-[#333] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};

const DashboardHeader = ({ isRunning, toggleSystem, onLogout, notifications }) => (
  <motion.header 
    initial={{ y: -20, opacity: 0 }} 
    animate={{ y: 0, opacity: 1 }}
    className="h-16 border-b border-[#222] bg-[#0a0a0a]/50 backdrop-blur flex items-center justify-between px-6 z-10"
  >
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold font-tech text-white">COMMAND_CENTER <span className="text-[#00f0ff]">///</span></h2>
      <div className="h-6 w-[1px] bg-[#333]" />
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${isRunning ? 'border-[#00ff9f]/30 bg-[#00ff9f]/10 text-[#00ff9f]' : 'border-[#ff003c]/30 bg-[#ff003c]/10 text-[#ff003c]'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#00ff9f] animate-pulse' : 'bg-[#ff003c]'}`} />
        {isRunning ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
        <span className="flex items-center gap-2">
          <Globe size={14} /> IN-SOUTH-1
        </span>
        <span className="flex items-center gap-2">
          <Wifi size={14} /> 12ms
        </span>
      </div>
      
      <div className="h-6 w-[1px] bg-[#333]" />

      <button className="relative text-gray-400 hover:text-white transition-colors">
        <Bell size={20} />
        {notifications > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00f0ff] rounded-full" />}
      </button>
      
      <button 
        onClick={toggleSystem}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-300 ${isRunning ? 'border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c]/20' : 'border-[#00ff9f] text-[#00ff9f] hover:bg-[#00ff9f]/20'}`}
      >
        {isRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      
      <button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#7000ff] p-[1px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <Users size={14} className="text-white" />
          </div>
        </div>
      </button>
    </div>
  </motion.header>
);

const StatCard = ({ title, value, subtext, trend, color, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel rounded-xl p-5 relative overflow-hidden group"
  >
    <div 
      className="absolute top-0 right-0 p-4 opacity-20 transition-opacity group-hover:opacity-40"
      style={{ color: color }}
    >
      <Icon size={64} strokeWidth={1} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        <Icon size={16} color={color} />
        <span className="text-xs font-mono uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl font-bold font-tech text-white mb-1">{value}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className={trend > 0 ? "text-[#00ff9f]" : "text-[#ff003c]"}>{trend > 0 ? '+' : ''}{trend}%</span>
        <span className="text-gray-500">{subtext}</span>
      </div>
    </div>
  </motion.div>
);

// --- SETTINGS COMPONENT ---
const SettingsTab = () => {
  const [config, setConfig] = useState({
    autoBan: true,
    honeypot: true,
    dpi: false,
    notifications: true,
    level: 'High'
  });

  const toggleSetting = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-xl font-bold font-tech text-white mb-6 flex items-center gap-2">
          <Settings className="text-[#00f0ff]" /> System Configuration
        </h3>
        
        <div className="space-y-6">
          {/* Security Level */}
          <div className="flex items-center justify-between p-4 rounded bg-[#1a1a1a] border border-[#333]">
            <div>
              <div className="text-sm font-bold text-white">Security Level</div>
              <div className="text-xs text-gray-500">Adjust sensitivity of the IDS engine</div>
            </div>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High', 'Paranoid'].map(lvl => (
                <motion.button 
                  key={lvl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${config.level === lvl ? 'bg-[#00f0ff] text-black' : 'bg-[#333] text-white hover:bg-[#444]'}`}
                  onClick={() => setConfig(prev => ({ ...prev, level: lvl }))}
                >
                  {lvl}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Toggle Settings */}
          {[
            { key: 'autoBan', label: 'Auto IP Ban', desc: 'Automatically block suspicious IPs' },
            { key: 'honeypot', label: 'Honeypot Enabled', desc: 'Deploy decoy services for attackers' },
            { key: 'dpi', label: 'Deep Packet Inspection', desc: 'Analyze payload content' },
            { key: 'notifications', label: 'Real-time Alerts', desc: 'Receive instant notifications' },
          ].map((setting) => (
            <motion.div 
              key={setting.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded bg-[#1a1a1a] border border-[#333] hover:border-[#00f0ff]/30 transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-white">{setting.label}</div>
                <div className="text-xs text-gray-500">{setting.desc}</div>
              </div>
              <motion.button
                onClick={() => toggleSetting(setting.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${config[setting.key] ? 'bg-[#00f0ff]' : 'bg-[#333]'}`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  animate={{ x: config[setting.key] ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Alert Rules Section */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-xl font-bold font-tech text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="text-[#ff003c]" /> Custom Alert Rules
        </h3>
        
        <div className="space-y-3">
          {[
            { rule: 'Port Scanning Detected', action: 'Block & Alert', status: true },
            { rule: 'DDoS Pattern Match', action: 'Mitigate', status: true },
            { rule: 'Data Exfiltration', action: 'Block', status: true },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded bg-[#0a0a0a] border border-[#333] hover:border-[#00f0ff]/50 group"
            >
              <div className="flex-1">
                <div className="text-sm text-white font-mono">{item.rule}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{item.action}</span>
                <div className="w-2 h-2 rounded-full bg-[#00ff9f] group-hover:animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2 border border-dashed border-[#00f0ff]/30 rounded text-[#00f0ff] text-sm hover:bg-[#00f0ff]/5 transition-colors"
        >
          + Add New Rule
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- THREAT TRENDS COMPONENT ---
const ThreatTrendsTab = () => {
  const trendData = [
    { time: '00:00', malware: 4, ddos: 2, brute: 8 },
    { time: '04:00', malware: 6, ddos: 4, brute: 10 },
    { time: '08:00', malware: 8, ddos: 3, brute: 12 },
    { time: '12:00', malware: 10, ddos: 5, brute: 15 },
    { time: '16:00', malware: 7, ddos: 2, brute: 9 },
    { time: '20:00', malware: 12, ddos: 8, brute: 18 },
    { time: '23:59', malware: 15, ddos: 12, brute: 22 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-xl font-bold font-tech text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-[#00f0ff]" /> 24H Threat Activity
          <BarChart3 className="text-[#00f0ff]" /> 24H Threat Activity
        </h3>
        
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }} />
              <Bar dataKey="malware" fill="#ff003c" name="Malware" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ddos" fill="#ffcc00" name="DDoS" radius={[4, 4, 0, 0]} />
              <Bar dataKey="brute" fill="#00f0ff" name="Brute Force" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Malware Attacks', value: '127', trend: '+18%', color: '#ff003c' },
          { label: 'DDoS Attempts', value: '53', trend: '-5%', color: '#ffcc00' },
          { label: 'Brute Force', value: '342', trend: '+12%', color: '#00f0ff' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-current rounded-full opacity-10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className={`text-sm ${stat.trend.startsWith('+') ? 'text-[#ff003c]' : 'text-[#00ff9f]'}`}>{stat.trend} from yesterday</div>
            </div>
          </motion.div>
        ))}
      </div>

      <EnhancedChartsSection />

      <EnhancedChartsSection />
    </motion.div>
  );
};

// --- API DOCUMENTATION COMPONENT ---
const APIDocsTab = () => {
  const [expanded, setExpanded] = useState(null);

  const endpoints = [
    { 
      method: 'GET', 
      path: '/api/threats', 
      description: 'Retrieve all detected threats',
      params: ['limit', 'offset', 'severity'],
      example: 'curl -H "Auth: token" https://api.sentinel.core/api/threats'
    },
    { 
      method: 'POST', 
      path: '/api/block-ip', 
      description: 'Block an IP address immediately',
      params: ['ip', 'duration', 'reason'],
      example: 'curl -X POST -d "ip=192.168.1.1" https://api.sentinel.core/api/block-ip'
    },
    { 
      method: 'GET', 
      path: '/api/nodes', 
      description: 'Get status of all monitoring nodes',
      params: ['region'],
      example: 'curl https://api.sentinel.core/api/nodes?region=us-east'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-4xl"
    >
      <div className="glass-panel rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold font-tech text-white mb-2 flex items-center gap-2">
          <Code className="text-[#7000ff]" /> API Reference
        </h3>
        <p className="text-gray-400 text-sm">Integrate Sentinel Core into your security workflows</p>
      </div>

      {endpoints.map((endpoint, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-panel rounded-xl overflow-hidden"
        >
          <motion.button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full p-6 flex items-center justify-between hover:bg-[#00f0ff]/5 transition-colors"
          >
            <div className="flex items-center gap-4 text-left">
              <div className={`px-3 py-1 rounded-lg font-bold text-xs ${
                endpoint.method === 'GET' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'bg-[#7000ff]/20 text-[#7000ff]'
              }`}>
                {endpoint.method}
              </div>
              <div>
                <div className="font-mono text-white">{endpoint.path}</div>
                <div className="text-xs text-gray-500">{endpoint.description}</div>
              </div>
            </div>
            <motion.div animate={{ rotate: expanded === i ? 180 : 0 }}>
              <ChevronDown size={20} className="text-gray-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {expanded === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-[#333] p-6 bg-[#1a1a1a]"
              >
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-bold text-white mb-2">Parameters</div>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((p, j) => (
                        <span key={j} className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-gray-400 font-mono">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-2">Example Request</div>
                    <div className="bg-[#050505] p-3 rounded border border-[#333] overflow-x-auto">
                      <code className="text-xs text-[#00f0ff] font-mono">{endpoint.example}</code>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

// --- SYSTEM HEALTH CHECK COMPONENT ---
const HealthCheckTab = () => {
  const [checks, setChecks] = useState({
    coreEngine: { status: 'healthy', latency: '2ms', uptime: '99.98%' },
    database: { status: 'healthy', latency: '5ms', uptime: '99.95%' },
    networks: { status: 'healthy', latency: '12ms', uptime: '100%' },
    aiModel: { status: 'training', latency: '15ms', uptime: '99.99%' },
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return '#00ff9f';
      case 'warning': return '#ffcc00';
      case 'training': return '#00f0ff';
      default: return '#ff003c';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold font-tech text-white flex items-center gap-2">
            <ShieldCheck className="text-[#00ff9f]" /> System Health
          </h3>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }} className="text-gray-500">
            <RefreshCw size={20} />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(checks).map(([service, data], i) => (
            <motion.div
              key={service}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-[#0a0a0a] border border-[#333]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="font-mono text-white text-sm capitalize">{service.replace(/([A-Z])/g, ' $1')}</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse" 
                    style={{ backgroundColor: getStatusColor(data.status) }}
                  ></div>
                  <span className="text-xs font-bold capitalize text-gray-400">{data.status}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Latency</span>
                  <span className="text-white">{data.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="text-white">{data.uptime}</span>
                </div>
              </div>

              {/* Health bar */}
              <div className="mt-3 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00f0ff] to-[#7000ff]"
                  initial={{ width: '70%' }}
                  animate={{ width: data.uptime === '100%' ? '100%' : data.uptime === '99.99%' ? '99.99%' : '95%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Issues */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-lg font-bold font-tech text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-[#ffcc00]" /> Recent Issues (Last 24h)
        </h3>
        
        <div className="space-y-2">
          {[
            { time: '3 hours ago', service: 'Honeypot-SSH', issue: 'Memory usage spike (82%)' },
            { time: '8 hours ago', service: 'Database', issue: 'Query latency increased' },
          ].map((issue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded bg-[#1a1a1a] border border-[#ffcc00]/20"
            >
              <div>
                <div className="text-sm text-white">{issue.service}</div>
                <div className="text-xs text-gray-500">{issue.issue}</div>
              </div>
              <div className="text-xs text-gray-500">{issue.time}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- OPTIMIZED TERMINAL LINE COMPONENT ---
const TerminalLine = React.memo(({ log, index }) => {
  const getLogColor = (log) => {
    if (typeof log !== 'string') return 'text-gray-500';
    if (log.startsWith('✅') || log.startsWith('🤖')) return 'text-[#00ff9f] font-semibold';
    if (log.includes('DoS') || log.includes('❌') || log.includes('⚠️')) return 'text-[#ff003c] font-semibold';
    if (log.includes('Scanning')) return 'text-[#00f0ff]';
    if (log.includes('Honeypot')) return 'text-[#ffcc00]';
    return 'text-gray-400';
  };

  return (
    <div className="whitespace-pre-wrap break-words leading-relaxed">
      <span className="text-gray-600">
        {String(index + 1).padStart(3, '0')} │ 
      </span>
      <span className={getLogColor(log)}>
        {typeof log === 'string' ? log : JSON.stringify(log)}
      </span>
    </div>
  );
});

// --- ENHANCED TERMINAL COMPONENT (OPTIMIZED) ---
const EnhancedTerminal = React.memo(({ logs }) => {
  const scrollRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalLines = useMemo(() => logs.slice(-50), [logs]);
  const terminalLines = useMemo(() => logs.slice(-50), [logs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines]);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  return (
    <div
      className={`${
        isMaximized ? "fixed inset-0 z-50 m-4 h-[calc(100%-2rem)]" : "h-full"
      } glass-panel rounded-2xl p-0 overflow-hidden flex flex-col border border-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,240,255,0.15)]`}
      style={{
        background: "rgba(5, 5, 5, 0.95)",
        backdropFilter: "blur(10px)",
        willChange: "transform",
      }}
    >
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] p-4 border-b border-[#00f0ff]/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div 
              className="w-3 h-3 rounded-full bg-[#ff003c] cursor-pointer hover:bg-[#ff6b6b] transition-colors"
              onClick={() => setIsMaximized(false)}
            />
            <div className="w-3 h-3 rounded-full bg-[#ffcc00]" />
            <div 
              className="w-3 h-3 rounded-full bg-[#00ff9f] cursor-pointer hover:brightness-150 transition-all"
              onClick={() => setIsMaximized(true)}
            />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <TerminalIcon size={16} className="text-[#00f0ff]" />
            <h3 className="font-bold font-mono text-sm text-white tracking-wider">
              SENTINEL.CORE ~ MAIN_TERMINAL
            </h3>
            <div className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-[#ffffff10] rounded-lg transition-colors">
            <Copy size={14} className="text-gray-500" />
          </button>
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 hover:bg-[#ffffff10] rounded-lg transition-colors"
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505] p-6 font-mono text-xs overflow-y-auto custom-scrollbar relative"
        style={{ willChange: 'scroll-position' }}
      >
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 space-y-1">
          {terminalLines.map((log, i) => (
            <TerminalLine key={i} log={log} index={i} />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-[#00f0ff]">$</span>
          <span className="text-[#00f0ff] animate-pulse">▌</span>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border-t border-[#00f0ff]/20 px-4 py-2 flex justify-between items-center text-[10px] text-gray-500">
        <span className="flex items-center gap-2">
          <Radio size={10} className="text-[#00ff9f]" />
          LIVE STREAM
          LIVE STREAM
        </span>
        <span>{terminalLines.length} events logged</span>
        <span>{terminalLines.length} events logged</span>
      </div>
    </div>
  );
});

// --- ENHANCED CHARTS SECTION ---
const ProtocolCard = React.memo(({ item, index }) => (
  <div
    className="p-4 rounded-lg border border-[#333] bg-black"
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
      <span className="text-sm font-mono text-gray-400">{item.name}</span>
    </div>
    <div className="text-2xl font-bold text-white mb-2">{item.value}%</div>
    <div className="w-full h-1 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500"
        style={{ background: item.color, width: `${item.value}%` }}
      />
    </div>
  </div>
));

const EnhancedChartsSection = React.memo(() => {
  const [protocolMixModal, setProtocolMixModal] = useState(false);

  const trafficBychannelData = useMemo(() => [
    { name: 'HTTPS', value: 42, color: '#00f0ff' },
    { name: 'HTTP', value: 28, color: '#7000ff' },
    { name: 'DNS', value: 18, color: '#00ff9f' },
    { name: 'FTP', value: 12, color: '#ffcc00' }
  ], []);

  const latencyData = useMemo(() => {
    let value = 50;
    return Array.from({ length: 10 }, (_, i) => {
      value += (Math.random() - 0.5) * 20;
      value = Math.max(10, Math.min(90, value));
      return {
        time: `${String(i).padStart(2, '0')}:00`,
        value: Math.round(value),
        baseline: 50
      };
    });
  }, []);

  const protocolData = useMemo(() => {
    let value = 50;
    return Array.from({ length: 8 }, (_, i) => {
      value += (Math.random() - 0.5) * 20;
      value = Math.max(10, Math.min(90, value));
      return {
        time: `${String(i).padStart(2, '0')}:00`,
        value: Math.round(value),
        baseline: 50
      };
    });
  }, []);

  const performanceData = useMemo(() => [
    { metric: 'Throughput', value: 78 },
    { metric: 'Latency', value: 85 },
    { metric: 'Availability', value: 99 },
    { metric: 'Security', value: 92 },
    { metric: 'Efficiency', value: 88 },
    { metric: 'Load', value: 72 }
  ], []);

  return (
    <>
      <div className="space-y-6 mt-6">
        <div
          className="glass-panel rounded-xl p-6"
          style={{ willChange: "transform" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-tech text-lg text-white flex items-center gap-2">
              <PieChartIcon size={20} className="text-[#00f0ff]" />{" "}
              PROTOCOL_DISTRIBUTION
            </h3>
            <Badge>Last 24 Hours</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {trafficBychannelData.map((item, i) => (
              <ProtocolCard key={i} item={item} index={i} />
            ))}
          </div>

        <div style={{ height: '224px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficBychannelData} isAnimationActive={false}>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px' }}
                labelStyle={{ color: '#00f0ff' }}
              />
              <Bar dataKey="value" fill="#00f0ff" radius={[8, 8, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latency Analysis */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-bold font-tech text-lg text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-[#ffcc00]" /> LATENCY_ANALYSIS
          </h3>
          <div style={{ height: '224px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData} isAnimationActive={false}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ffcc00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }}
                  formatter={(value) => [`${value}ms`, 'Latency']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ffcc00" 
                  strokeWidth={3}
                  dot={false}
                  fill="url(#colorLatency)"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Mix */}
        <div 
          className="glass-panel rounded-xl p-6 cursor-pointer hover:border-[#00f0ff]/50 transition-all duration-300"
          onClick={() => setProtocolMixModal(true)}
        >
          <h3 className="font-bold font-tech text-lg text-white mb-6 flex items-center gap-2">
            <Wifi size={20} className="text-[#7000ff]" /> PROTOCOL_MIX
          </h3>
          <div style={{ height: '224px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficBychannelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {trafficBychannelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bandwidth & Throughput Radar */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-bold font-tech text-lg text-white mb-6 flex items-center gap-2">
          <Radio size={20} className="text-[#00ff9f]" /> PERFORMANCE_METRICS
        </h3>
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={performanceData} isAnimationActive={false}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="metric" stroke="#666" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
              <Radar 
                name="Performance" 
                dataKey="value" 
                stroke="#00f0ff" 
                fill="#00f0ff" 
                fillOpacity={0.3}
                isAnimationActive={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #00f0ff' }}
                formatter={(value) => `${value}%`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Request Distribution Timeline */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-bold font-tech text-lg text-white mb-6 flex items-center gap-2">
          <Activity size={20} className="text-[#00ff9f]" /> REQUEST_TIMELINE
        </h3>
        <div style={{ height: '224px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={protocolData} isAnimationActive={false}>
              <defs>
                <linearGradient id="colorProto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7000ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7000ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }}
                formatter={(value) => `${value} Req/s`}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#7000ff" 
                fill="url(#colorProto)" 
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>

      {/* PROTOCOL_MIX Modal */}
      <AnimatePresence>
        {protocolMixModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setProtocolMixModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut", type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setProtocolMixModal(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#050505] rounded-2xl p-8 max-w-2xl w-full border border-[#00f0ff]/30 glass-panel relative max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProtocolMixModal(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-[#ffffff10] rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400 hover:text-white" />
                </motion.button>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold font-tech text-white mb-2 flex items-center gap-3">
                    <Wifi size={28} className="text-[#7000ff]" /> PROTOCOL_MIX_ANALYSIS
                  </h2>
                  <p className="text-gray-400">Detailed protocol distribution breakdown</p>
                </div>

                {/* Pie Chart */}
                <div style={{ height: '400px' }} className="mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficBychannelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {trafficBychannelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #00f0ff', borderRadius: '8px' }}
                        formatter={(value) => `${value}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {trafficBychannelData.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-lg bg-black border border-[#333] hover:border-[#00f0ff]/50 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 rounded-full" style={{ background: item.color }} />
                        <span className="font-mono font-bold text-white">{item.name}</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{item.value}%</div>
                      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ background: item.color, width: `${item.value}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Packets/sec: {Math.floor(item.value * 100)}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setProtocolMixModal(false)}
                  className="w-full py-3 bg-[#00f0ff] text-black rounded-lg font-bold font-tech hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  CLOSE
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

// --- DASHBOARD LOGIC ---
// --- DASHBOARD LOGIC ---
const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ cpu: 15, ram: 42, net: 120, threats: 0 });
  const [trafficData, setTrafficData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Simulation State Refs
  const bootIndexRef = useRef(0);
  const timeRef = useRef(0);

  // Dummy Data for Topology
  const topologyNodes = [
    {
      id: "hub",
      x: 50,
      y: 50,
      type: "hub",
      label: "CORE_HUB",
      status: "online",
      ip: "192.168.0.1",
    },
    {
      id: "fw1",
      x: 20,
      y: 30,
      type: "firewall",
      label: "FW_EXT_01",
      status: "online",
      ip: "10.0.0.1",
    },
    {
      id: "fw2",
      x: 80,
      y: 30,
      type: "firewall",
      label: "FW_EXT_02",
      status: "online",
      ip: "10.0.0.2",
    },
    {
      id: "db1",
      x: 20,
      y: 70,
      type: "database",
      label: "DB_MAIN_A",
      status: "online",
      ip: "10.0.1.50",
    },
    {
      id: "db2",
      x: 80,
      y: 70,
      type: "database",
      label: "DB_REPL_B",
      status: "maintenance",
      ip: "10.0.1.51",
    },
    {
      id: "web1",
      x: 35,
      y: 20,
      type: "server",
      label: "WEB_NODE_01",
      status: "online",
      ip: "172.16.0.10",
    },
    {
      id: "web2",
      x: 65,
      y: 20,
      type: "server",
      label: "WEB_NODE_02",
      status: "warning",
      ip: "172.16.0.11",
    },
    {
      id: "auth",
      x: 50,
      y: 80,
      type: "shield",
      label: "AUTH_GATE",
      status: "online",
      ip: "192.168.1.99",
    },
  ];

  const topologyLinks = [
    { from: "fw1", to: "hub" },
    { from: "fw2", to: "hub" },
    { from: "hub", to: "db1" },
    { from: "hub", to: "db2" },
    { from: "fw1", to: "web1" },
    { from: "fw2", to: "web2" },
    { from: "hub", to: "auth" },
  ];

  const getNodeIcon = (type) => {
    switch (type) {
      case "hub":
        return Cpu;
      case "firewall":
        return Shield;
      case "database":
        return Database;
      case "server":
        return Server;
      case "shield":
        return Lock;
      default:
        return Server;
    }
  };

  // Simulation Engine
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      // 1. BOOT SEQUENCE (First few seconds)
      if (bootIndexRef.current < BOOT_SEQUENCE.length) {
        setLogs((prev) =>
          [...prev, BOOT_SEQUENCE[bootIndexRef.current]].slice(-CONFIG.maxLogs)
        );
        bootIndexRef.current += 1;
        return; 
      }

      // 2. MAIN ATTACK LOOP
      const currentTime = new Date().toLocaleTimeString();
      timeRef.current += 1;

      const cycle = timeRef.current % 30; // 30 ticks cycle

      let newLog = null;
       
      // Phase 1: Port Scanning (Ticks 0-10)
      if (cycle < 10) {
        const port = 20 + cycle;
        newLog = `[Port Scan] Starting scan at ${currentTime}\n➡ Scanning Port ${port}...`;
        if (cycle === 9) newLog += `\nPort scan completed with detectable payload '###PORT_SCAN###'`;
      } 
      // Phase 2: DoS Attack (Ticks 10-15)
      else if (cycle >= 10 && cycle < 15) {
        newLog = `[DoS] Sending attack at ${currentTime}\n📦 Sent 100 crafted DoS packets with payload '###DOS_ATTACK###'`;
        // Generate Alert
        if (Math.random() > 0.5) {
              setAlerts(prev => [{
                id: Date.now(),
                type: 'DoS Attack',
                target: 'api-gateway',
                severity: 'CRITICAL',
                time: 'Just now'
             }, ...prev].slice(0, 5));
        }
      }
      // Phase 3: Traffic & Healing (Ticks 15-30)
      else {
        const trafficIndex = Math.floor(Math.random() * TRAFFIC_LOGS.length);
        if (Math.random() > 0.3) {
          newLog = TRAFFIC_LOGS[trafficIndex];
        } else {
          const threatIndex = timeRef.current % THREAT_SEQUENCE.length;
          newLog = THREAT_SEQUENCE[threatIndex];
        }
      }

      if (newLog) {
        setLogs((prev) => [...prev, newLog].slice(-CONFIG.maxLogs));
      }

      // Stats Update
      setStats(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.min(100, Math.max(20, prev.ram + (Math.random() - 0.5) * 5)),
        net: Math.max(0, prev.net + (Math.random() - 0.5) * 50),
        threats: Math.random() > 0.95 ? prev.threats + 1 : prev.threats
      }));

      // Traffic Graph
      setTrafficData(prev => [...prev.slice(-30), {
        time: currentTime,
        inbound: Math.floor(Math.random() * 500) + 100,
        outbound: Math.floor(Math.random() * 300) + 50,
        threats: cycle >= 10 && cycle < 15 ? 150 : Math.floor(Math.random() * 20)
      }]);

    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleSystem = async () => {
    setIsRunning((prev) => {
      const next = !prev;

      if (next) {
        axios
          .post("http://127.0.0.1:8000/ids/start")
          .then(() => {
            setLogs([">> SYSTEM INITIALIZED"]);
            bootIndexRef.current = 0;
          })
          .catch((err) => {
            console.error(err);
            setLogs((prev) => [...prev, ">> SYSTEM START FAILED"]);
          });
      } else {
        setLogs((prev) => [...prev, ">> SYSTEM HALTED"]);
      }

      return next;
    });
  };

  return (
    <div className="flex h-screen bg-[#050505] text-gray-200 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
       
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader isRunning={isRunning} toggleSystem={toggleSystem} onLogout={onLogout} notifications={alerts.length} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
           
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto"
              >
                {/* Stats Row */}
                <StatCard
                  title="Total Traffic"
                  value={`${Math.floor(stats.net)} MB/s`}
                  subtext="vs last hour"
                  trend={12}
                  color="#00f0ff"
                  icon={Activity}
                  delay={0.1}
                />
                <StatCard
                  title="Threats Blocked"
                  value={stats.threats}
                  subtext="Requires Attention"
                  trend={-2}
                  color="#ff003c"
                  icon={Shield}
                  delay={0.2}
                />
                <StatCard
                  title="Active Nodes"
                  value="14/14"
                  subtext="All Systems Go"
                  trend={0}
                  color="#00ff9f"
                  icon={Server}
                  delay={0.3}
                />
                <StatCard
                  title="CPU Load"
                  value={`${Math.floor(stats.cpu)}%`}
                  subtext="Optimal Range"
                  trend={5}
                  color="#7000ff"
                  icon={Cpu}
                  delay={0.4}
                />

                {/* Enhanced Terminal */}
                <div className="md:col-span-4 h-[500px]">
                  <EnhancedTerminal logs={logs} />
                </div>

                {/* Main Traffic Chart */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="md:col-span-3 glass-panel rounded-xl p-6 min-h-[400px] flex flex-col"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold font-tech text-lg text-white flex items-center gap-2">
                      <Activity size={20} className="text-[#00f0ff]" /> NETWORK_TRAFFIC_ANALYSIS
                    </h3>
                    <div className="flex gap-2">
                        {['1H', '24H', '7D'].map(t => <button key={t} className="px-3 py-1 text-xs border border-[#333] rounded hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors">{t}</button>)}
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData}>
                        <defs>
                          <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }} />
                        <Area type="monotone" dataKey="inbound" stroke="#00f0ff" fill="url(#colorInbound)" strokeWidth={2} />
                        <Area type="monotone" dataKey="threats" stroke="#ff003c" fill="url(#colorThreat)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Recent Alerts */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="md:col-span-1 glass-panel rounded-xl p-6 flex flex-col"
                >
                  <h3 className="font-bold font-tech text-lg text-white mb-4 flex items-center gap-2">
                    <Siren size={20} className="text-[#ff003c]" /> RECENT_ALERTS
                  </h3>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                    {alerts.length === 0 ? (
                        <div className="text-gray-500 text-sm text-center py-10">No active alerts.</div>
                    ) : (
                       alerts.map(alert => (
                          <div key={alert.id} className="p-3 rounded bg-[#1a1a1a] border border-[#333] border-l-4 border-l-[#ff003c]">
                            <div className="flex justify-between items-start mb-1">
                               <span className="text-[#ff003c] font-bold text-xs">{alert.type}</span>
                               <span className="text-gray-500 text-[10px]">{alert.time}</span>
                            </div>
                            <div className="text-gray-300 text-sm mb-1">{alert.target}</div>
                            <div className="inline-block px-1.5 py-0.5 bg-[#ff003c]/20 text-[#ff003c] text-[10px] rounded">{alert.severity}</div>
                          </div>
                       ))
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'logs' && (
              <motion.div 
                  key="logs"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full flex flex-col gap-4 max-w-7xl mx-auto"
              >
                  <div className="flex justify-between items-center glass-panel p-4 rounded-xl">
                    <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
                        <FileText className="text-[#00f0ff]" /> SYSTEM_LOGS_ARCHIVE
                    </h2>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Filter size={14} className="mr-2" /> Filter</Button>
                        <Button size="sm" variant="outline"><RefreshCw size={14} className="mr-2" /> Refresh</Button>
                        <Button size="sm">Export CSV</Button>
                    </div>
                  </div>

                <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
                  <div className="bg-[#1a1a1a] p-3 border-b border-[#333] flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="w-24">Timestamp</div>
                    <div className="w-24">Level</div>
                    <div className="w-32">Source</div>
                    <div className="flex-1">Message</div>
                    <div className="w-24 text-right">Action</div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-2">
                    {[...logs].reverse().map((log, i) => (
                      <div
                        key={i}
                        className="flex items-start py-2 border-b border-[#1a1a1a] hover:bg-[#ffffff05] font-mono text-xs transition-colors"
                      >
                        <div className="w-24 text-gray-600">
                          {new Date().toLocaleTimeString()}
                        </div>
                        <div className="w-24">
                          {typeof log === "string" &&
                            (log.includes("CRITICAL") ||
                            log.includes("DoS") ||
                            log.includes("❌") ? (
                              <span className="text-[#ff003c]">CRITICAL</span>
                            ) : log.includes("WARN") || log.includes("⚠️") ? (
                              <span className="text-[#ffcc00]">WARN</span>
                            ) : (
                              <span className="text-[#00ff9f]">INFO</span>
                            ))}
                        </div>
                        <div className="w-32 text-gray-400">IDS_ENGINE</div>
                        <div className="flex-1 text-gray-300 whitespace-pre-wrap">
                          {typeof log === "string" ? log : JSON.stringify(log)}
                        </div>
                        <div className="w-24 text-right text-[#00f0ff] cursor-pointer hover:underline">
                          Details
                        </div>
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <div className="text-center py-20 text-gray-600 italic">
                        No logs generated. Start the system to begin capturing
                        events.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'intelligence' && (
               <IntelTab logs={logs} stats={stats} />
            )}

            {activeTab === 'trends' && (
               <ThreatTrendsTab />
            )}

            {activeTab === 'api' && (
               <APIDocsTab />
            )}

            {activeTab === 'health' && (
               <HealthCheckTab />
            )}

            {activeTab === "settings" && <SettingsTab />}

            {activeTab === "flow" && <FlowchartTab />}

            {activeTab === "nodes" && (
              <div className="h-full flex flex-col gap-6">
                {/* Graph Container */}
                <div className="flex-1 glass-panel rounded-xl relative overflow-hidden p-0">
                  <div
                    className="absolute inset-0 bg-[#050505]"
                    style={{
                      backgroundImage:
                        "radial-gradient(#1a1a1a 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  <div className="absolute top-4 left-4 z-20">
                    <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
                      <Globe className="text-[#00f0ff]" /> NETWORK_TOPOLOGY_MAP
                    </h2>
                    <p className="text-xs text-gray-500 font-mono">
                      Live visualization of node interconnects
                    </p>
                  </div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {topologyLinks.map((link, i) => {
                      const start = topologyNodes.find(
                        (n) => n.id === link.from
                      );
                      const end = topologyNodes.find((n) => n.id === link.to);
                      return (
                        <g key={i}>
                          <line
                            x1={`${start.x}%`}
                            y1={`${start.y}%`}
                            x2={`${end.x}%`}
                            y2={`${end.y}%`}
                            stroke="#333"
                            strokeWidth="2"
                          />
                          {isRunning && (
                            <circle r="3" fill="#00f0ff">
                              <animateMotion
                                dur={`${2 + (i % 3)}s`}
                                repeatCount="indefinite"
                                path={`M${start.x * 10},${start.y * 10} L${
                                  end.x * 10
                                },${end.y * 10}`}
                              />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Alternative Packet Animation Layer */}
                  {isRunning &&
                    topologyLinks.map((link, i) => {
                      const start = topologyNodes.find(
                        (n) => n.id === link.from
                      );
                      const end = topologyNodes.find((n) => n.id === link.to);
                      return (
                        <motion.div
                          key={`packet-${i}`}
                          className="absolute w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_10px_#00f0ff] z-0 pointer-events-none"
                          initial={{
                            left: `${start.x}%`,
                            top: `${start.y}%`,
                            opacity: 0,
                          }}
                          animate={{
                            left: [`${start.x}%`, `${end.x}%`],
                            top: [`${start.y}%`, `${end.y}%`],
                            opacity: [0, 1, 1, 0],
                          }}
                          transition={{
                            duration: 2 + (i % 2),
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5,
                          }}
                        />
                      );
                    })}

                  {/* Nodes Layer */}
                  {topologyNodes.map((node) => {
                    const Icon = getNodeIcon(node.type);
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <motion.div
                        key={node.id}
                        className={`absolute w-16 h-16 -ml-8 -mt-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all z-10
                                 ${
                                   isSelected
                                     ? "border-[#00f0ff] bg-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,240,255,0.5)]"
                                     : node.status === "warning"
                                     ? "border-[#ffcc00] bg-[#0a0a0a]"
                                     : node.status === "maintenance"
                                     ? "border-gray-600 bg-[#0a0a0a] opacity-70"
                                     : "border-[#333] bg-[#0a0a0a] hover:border-[#00f0ff]/50"
                                 }
                              `}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedNode(node)}
                      >
                        <Icon
                          size={24}
                          className={
                            node.status === "warning"
                              ? "text-[#ffcc00]"
                              : isSelected
                              ? "text-[#00f0ff]"
                              : "text-gray-400"
                          }
                        />

                        <div
                          className={`absolute top-0 right-0 w-3 h-3 rounded-full border border-black ${
                            node.status === "online"
                              ? "bg-[#00ff9f]"
                              : node.status === "warning"
                              ? "bg-[#ffcc00]"
                              : "bg-gray-500"
                          }`}
                        />

                        <div className="absolute top-full mt-2 text-xs font-mono whitespace-nowrap text-gray-400 bg-black/80 px-2 py-1 rounded border border-[#333]">
                          {node.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Details Panel */}
                <AnimatePresence>
                  {selectedNode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="glass-panel p-6 rounded-xl border border-[#00f0ff]/30 overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
                            {React.createElement(
                              getNodeIcon(selectedNode.type),
                              { size: 24 }
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold font-tech text-white">
                              {selectedNode.label}
                            </h3>
                            <div className="text-sm text-gray-400 font-mono">
                              {selectedNode.id.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedNode(null)}
                        >
                          <X size={18} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="p-3 bg-[#1a1a1a] rounded border border-[#333]">
                          <div className="text-xs text-gray-500 mb-1 font-mono">
                            IP ADDRESS
                          </div>
                          <div className="font-mono text-[#00f0ff]">
                            {selectedNode.ip}
                          </div>
                        </div>
                        <div className="p-3 bg-[#1a1a1a] rounded border border-[#333]">
                          <div className="text-xs text-gray-500 mb-1 font-mono">
                            STATUS
                          </div>
                          <div
                            className={`font-mono uppercase font-bold ${
                              selectedNode.status === "online"
                                ? "text-[#00ff9f]"
                                : selectedNode.status === "warning"
                                ? "text-[#ffcc00]"
                                : "text-gray-500"
                            }`}
                          >
                            {selectedNode.status}
                          </div>
                        </div>
                        <div className="p-3 bg-[#1a1a1a] rounded border border-[#333]">
                          <div className="text-xs text-gray-500 mb-1 font-mono">
                            UPTIME
                          </div>
                          <div className="font-mono text-white">
                            42d 12h 30m
                          </div>
                        </div>
                        <div className="p-3 bg-[#1a1a1a] rounded border border-[#333]">
                          <div className="text-xs text-gray-500 mb-1 font-mono">
                            LOAD
                          </div>
                          <div className="font-mono text-white">24%</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};