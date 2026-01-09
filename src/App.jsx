import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
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
  bg: "#050505",
  panel: "#0a0a0a",
  border: "#333333",
  primary: "#00f0ff", // Cyan
  secondary: "#7000ff", // Purple
  alert: "#ff003c", // Red
  success: "#00ff9f", // Green
  warn: "#ffcc00", // Amber
  text: "#e0e0e0",
  textDim: "#666666",
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
  "🔍 Monitoring Network Traffic in Real Time...",
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
  "📤 Data Exfiltration Blocked: Pattern match 'credit_card' in payload",
];

const THREAT_SEQUENCE = [
  "⚠️ Isolating Threat from 172.16.2.184...",
  "Ok.",
  "❌ Blocked IP: 172.16.2.184",
  "Deleted 1 rule(s).",
  "Ok.",
  "✅ Auto-Healed: 172.16.2.184 is unblocked!",
];
const toggleSystem = async () => {
  try {
    if (!isRunning) {
      // START IDS (backend)
      await axios.post("http://127.0.0.1:8000/ids/start");

      // UI + simulation
      setIsRunning(true);
      setLogs([">> SYSTEM INITIALIZED"]);
      bootIndexRef.current = 0;
    } else {
      // STOP IDS (backend)

      // UI
      setIsRunning(false);
      setLogs((prev) => [">> SYSTEM HALTED", ...prev]);
    }
  } catch (error) {
    console.error("IDS control failed:", error);

    setLogs((prev) => [
      "❌ ERROR: Failed to communicate with IDS backend",
      ...prev,
    ]);
  }
};

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

    /* ENHANCED ANIMATIONS - OPTIMIZED */
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1); }
      50% { box-shadow: 0 0 40px rgba(0, 240, 255, 0.6), inset 0 0 30px rgba(0, 240, 255, 0.2); }
    }

    @keyframes float-up {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    @keyframes rotate-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes scan-lines {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes blob-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @keyframes text-flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    .glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
    .float-up { animation: float-up 4s ease-in-out infinite; }
    .rotate-slow { animation: rotate-slow 20s linear infinite; }
    .scan-lines { animation: scan-lines 8s linear infinite; }
    .text-flicker { animation: text-flicker 4s ease-in-out infinite; }

    /* ADDITIONAL ANIMATIONS */
    @keyframes slide-in-right {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slide-in-left {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fade-in-up {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes fade-in-down {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes pulse-glow {
      0%, 100% { 
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 30px rgba(0, 240, 255, 0.8);
        transform: scale(1.05);
      }
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes neon-flicker {
      0%, 100% { 
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.6);
        opacity: 1;
      }
      50% { 
        text-shadow: 0 0 20px rgba(0, 240, 255, 1), 0 0 40px rgba(0, 240, 255, 0.8);
        opacity: 0.95;
      }
    }

    @keyframes border-glow {
      0%, 100% { border-color: rgba(0, 240, 255, 0.3); }
      50% { border-color: rgba(0, 240, 255, 0.8); }
    }

    .animation-delay-0 { animation-delay: 0s; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `}</style>
);

// --- MAIN APP ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("landing");
  const toggleSystem = async () => {
    try {
      if (!isRunning) {
        // START IDS (backend)
        await axios.post("http://127.0.0.1:8000/ids/start");

        // UI + simulation
        setIsRunning(true);
        setLogs([">> SYSTEM INITIALIZED"]);
        bootIndexRef.current = 0;
      } else {
        // STOP IDS (backend)

        // UI
        setIsRunning(false);
        setLogs((prev) => [">> SYSTEM HALTED", ...prev]);
      }
    } catch (error) {
      console.error("IDS control failed:", error);

      setLogs((prev) => [
        "❌ ERROR: Failed to communicate with IDS backend",
        ...prev,
      ]);
    }
  };

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
          ) : view === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 overflow-hidden"
            >
              <LandingPage onEnter={() => setView("dashboard")} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="absolute inset-0 bg-[#050505]"
            >
              <Dashboard onLogout={() => setView("landing")} />
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
      "SYSTEM_READY.",
    ];

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
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
        SENTINEL<span className="text-[#00f0ff]">CORE</span>
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

      <div className="absolute bottom-10 left-10 font-mono text-[10px] text-gray-600 space-y-1 hidden md:block">
        <div className="opacity-50">Cpu0 microcode updated...</div>
        <div className="opacity-70">Security Framework loaded (v4.0.2)</div>
        <div className="text-[#00ff9f]">OK: Mounted root filesystem</div>
      </div>
    </motion.div>
  );
};

// --- SHADCN-LIKE COMPONENTS ---
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-tech uppercase tracking-wider";

  const variants = {
    primary:
      "bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)]",
    secondary: "bg-[#1a1a1a] text-white hover:bg-[#333] border border-[#333]",
    ghost: "hover:bg-[#ffffff10] text-gray-300 hover:text-white",
    outline:
      "border border-[#00f0ff] text-[#00f0ff] bg-transparent hover:bg-[#00f0ff]/10",
    destructive: "bg-[#ff003c] text-white hover:bg-[#ff003c]/90",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-9 w-9",
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

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm text-gray-200 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const styles =
    variant === "outline"
      ? "border border-[#333] text-gray-400"
      : "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles}`}
    >
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

  const scrollToSection = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      ref={scrollRef}
      className="h-screen w-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth relative perspective-1000"
    >
      {/* Dynamic Background */}
      <motion.div
        style={{ y: bgY }}
        className="fixed inset-0 z-0 bg-black pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7000ff]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="shooting-star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at 50% 50%, black, transparent 90%)",
          }}
        />
      </motion.div>

      <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-[#050505]/80 backdrop-blur supports-[backdrop-filter]:bg-[#050505]/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <Shield className="h-6 w-6 text-[#00f0ff]" />
            <span className="text-lg font-bold font-tech tracking-wide text-white">
              SENTINEL<span className="text-[#00f0ff]">CORE</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-[#00f0ff] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("architecture")}
              className="hover:text-[#00f0ff] transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-[#00f0ff] transition-colors"
            >
              Pricing
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={onEnter}>
              Launch Console
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-center">
        {/* --- HERO SECTION --- */}
        <section
          id="hero"
          className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 relative"
        >
          <motion.div
            style={{ opacity: opacityHero }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge variant="outline">
                {" "}
                <span className="w-2 h-2 bg-[#00ff9f] rounded-full mr-2 inline-block animate-pulse"></span>{" "}
                Systems Operational
              </Badge>
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
              Military-grade intrusion detection powered by advanced neural
              networks. Real-time threat analysis, automated mitigation, and
              global node visualization.
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col md:flex-row gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 240, 255, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={onEnter}
                  className="gap-2 px-10 h-16 text-xl"
                >
                  {" "}
                  <TerminalIcon size={24} /> Initialize Console{" "}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 px-10 h-16 text-xl"
                >
                  {" "}
                  <Play size={24} /> Watch Demo{" "}
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating orbs */}
            <div className="absolute -top-40 -left-20 w-64 h-64 bg-[#7000ff] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-0"></div>
            <div className="absolute -bottom-40 -right-20 w-64 h-64 bg-[#00f0ff] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob animation-delay-4000"></div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 animate-bounce cursor-pointer"
            onClick={() => scrollToSection("ticker")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="text-gray-500" size={32} />
            </motion.div>
          </motion.div>
        </section>

        {/* --- LIVE THREAT TICKER --- */}
        <section
          id="ticker"
          className="w-full bg-[#00f0ff]/5 border-y border-[#00f0ff]/20 py-4 overflow-hidden relative"
        >
          <div className="flex animate-marquee whitespace-nowrap gap-12">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]"
              >
                <AlertTriangle size={12} />
                <span>
                  THREAT_DETECTED_IP_192.168.0.{Math.floor(Math.random() * 255)}
                </span>
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
            <h2 className="text-4xl md:text-5xl font-bold font-tech text-white mb-6">
              Core Capabilities
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to secure your infrastructure, from
              packet-level inspection to global threat visualization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              delay={0.1}
              icon={<Zap className="text-yellow-400" />}
              title="Real-time Detection"
              desc="Microsecond latency analysis of inbound packet streams using WebAssembly modules."
            />
            <FeatureCard
              delay={0.2}
              icon={<Fingerprint className="text-[#00f0ff]" />}
              title="AI Threat Signatures"
              desc="Deep learning models trained on 50PB of attack data to identify zero-day exploits."
            />
            <FeatureCard
              delay={0.3}
              icon={<Globe className="text-[#7000ff]" />}
              title="Global Grid"
              desc="Visualize attack vectors across geographical nodes in a unified 3D interface."
            />
            <FeatureCard
              delay={0.4}
              icon={<Lock className="text-[#00ff9f]" />}
              title="Automated Mitigation"
              desc="Instant IP banning and firewall rule propagation across your entire mesh."
            />
            <FeatureCard
              delay={0.5}
              icon={<HardDrive className="text-pink-500" />}
              title="Forensic Logging"
              desc="Immutable ledger of all security events with payload inspection and hex dumps."
            />
            <FeatureCard
              delay={0.6}
              icon={<Siren className="text-red-500" />}
              title="Incident Response"
              desc="Integrated alerting system via Webhooks, Slack, and PagerDuty."
            />
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

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <line
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="10%"
                  stroke="#00f0ff"
                  strokeDasharray="4 4"
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="90%"
                  stroke="#00f0ff"
                  strokeDasharray="4 4"
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="10%"
                  y2="50%"
                  stroke="#00f0ff"
                  strokeDasharray="4 4"
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="90%"
                  y2="50%"
                  stroke="#00f0ff"
                  strokeDasharray="4 4"
                />
              </svg>
            </motion.div>
          </div>
        </section>

        {/* --- PRICING & FOOTER --- */}
        {/* Simplified for brevity but present to ensure scrolling length */}
        <section
          id="pricing"
          className="w-full max-w-7xl px-6 py-32 text-center relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold font-tech text-white mb-6">
              Flexible Deployment Options
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your security needs. Scale up anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="$0"
              features={[
                "1 Node",
                "1GB Logs",
                "Community Support",
                "Basic Alerts",
              ]}
            />
            <PricingCard
              title="Pro"
              price="$299/mo"
              features={[
                "10 Nodes",
                "Unlimited Logs",
                "AI Analysis",
                "Priority Support",
                "Custom Rules",
              ]}
              recommended
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              features={[
                "Unlimited Nodes",
                "Custom AI Model",
                "Dedicated Support",
                "99.99% SLA",
                "White Label",
              ]}
            />
          </div>

          {/* Feature comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-20 glass-panel rounded-xl p-8 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold font-tech text-white mb-8 text-left">
              Detailed Comparison
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="text-left py-3 px-4 font-mono text-gray-400">
                      Feature
                    </th>
                    <th className="text-center py-3 px-4 font-mono text-white">
                      Starter
                    </th>
                    <th className="text-center py-3 px-4 font-mono text-[#00f0ff]">
                      Pro
                    </th>
                    <th className="text-center py-3 px-4 font-mono text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Monitoring Nodes",
                      starter: "1",
                      pro: "10",
                      enterprise: "Unlimited",
                    },
                    {
                      feature: "Log Storage",
                      starter: "1 GB",
                      pro: "Unlimited",
                      enterprise: "Unlimited",
                    },
                    {
                      feature: "Threat Detection",
                      starter: "Yes",
                      pro: "Advanced",
                      enterprise: "Custom ML",
                    },
                    {
                      feature: "API Access",
                      starter: "No",
                      pro: "Yes",
                      enterprise: "Yes",
                    },
                    {
                      feature: "Real-time Alerts",
                      starter: "Basic",
                      pro: "Full",
                      enterprise: "Full + Custom",
                    },
                  ].map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-[#222] hover:bg-[#ffffff05] transition-colors"
                    >
                      <td className="py-3 px-4 text-left text-gray-300 font-mono">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-400">
                        <Check size={18} className="mx-auto text-[#00ff9f]" />
                      </td>
                      <td className="py-3 px-4 text-center text-gray-400">
                        <Check size={18} className="mx-auto text-[#00f0ff]" />
                      </td>
                      <td className="py-3 px-4 text-center text-gray-400">
                        <Check size={18} className="mx-auto text-[#7000ff]" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

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
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#00f0ff]/10 via-transparent to-[#7000ff]/10"></div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#00f0ff] rounded-full mix-blend-screen blur-[40px]"></div>
      </div>

      <div className="relative z-10 mb-6 p-4 rounded-xl bg-[#1a1a1a] w-fit border border-[#333] group-hover:border-[#00f0ff]/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
        <div>{icon}</div>
      </div>
      <h3 className="relative z-10 text-xl font-bold text-white mb-3 font-tech">
        {title}
      </h3>
      <p className="relative z-10 text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>

      {/* Bottom highlight bar */}
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
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00f0ff] rounded-full mix-blend-screen blur-[60px] opacity-20"></div>
        </div>
      )}

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
            <div>
              <Check size={16} className="text-[#00f0ff] flex-shrink-0 mt-1" />
            </div>
            <span className="group-hover/item:text-white transition-colors">
              {f}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <Button
          variant={recommended ? "primary" : "outline"}
          className="w-full group/btn"
        >
          <span className="inline-flex items-center gap-2">
            Select Plan
            <span>→</span>
          </span>
        </Button>
      </div>
    </Card>
  </div>
));

// --- INTEL TAB (AI CHATBOT) ---
const IntelTab = ({ logs, stats }) => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "I am Sentinel's AI Threat Analyst. I can analyze recent logs, explain attack vectors, or recommend mitigation strategies. How can I assist?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    // Context from current dashboard state
    const systemContext = `
      Current System Status:
      - CPU Load: ${stats.cpu.toFixed(1)}%
      - RAM Usage: ${stats.ram.toFixed(1)}%
      - Threat Level: ${stats.threats > 5 ? "CRITICAL" : "NORMAL"} (${
      stats.threats
    } blocked threats)
      - Recent Log Snippet: ${logs
        .slice(0, 3)
        .map((l) => (typeof l === "string" ? l : JSON.stringify(l)))
        .join("; ")}
    `;

    const systemPrompt =
      "You are Sentinel Core's dedicated AI Security Analyst. You are embedded in a futuristic Intrusion Detection System. Your goal is to assist the security operator by analyzing threats, explaining technical security concepts (like SQL Injection, DDoS, XSS, etc.), and suggesting firewall rules or mitigation steps. Keep your responses concise, professional, and tactical. Do not answer questions unrelated to cybersecurity or system administration. If asked about current status, use the provided context.";

    try {
      const apiKey = "AIzaSyALR2ZMEbnpOnPQORq7vqaFrKLywFJU0Ic"; // API Key provided by environment
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Context: ${systemContext}\n\nUser Query: ${userMsg}`,
                  },
                ],
              },
            ],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          }),
        }
      );

      const data = await response.json();
      const botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Connection to neural core failed. Try again.";

      setMessages((prev) => [...prev, { role: "model", text: botResponse }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Error: Unable to establish uplink with AI Core.",
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
        <div
          className="absolute inset-0 bg-center bg-no-repeat opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
          }}
        ></div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl border ${
                  msg.role === "user"
                    ? "bg-[#00f0ff]/10 border-[#00f0ff]/30 text-white rounded-br-none"
                    : "bg-[#1a1a1a] border-[#333] text-gray-300 rounded-bl-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 opacity-50 text-xs font-mono uppercase">
                  {msg.role === "user" ? (
                    <Users size={12} />
                  ) : (
                    <Bot size={12} />
                  )}
                  {msg.role === "user" ? "OPERATOR" : "SENTINEL_AI"}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#333] rounded-bl-none flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="animate-spin" size={16} /> Analyzing threat
                vectors...
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
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Sentinel AI about threats, logs, or mitigation strategies..."
              className="flex-1 bg-[#050505] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none placeholder-gray-600 font-mono"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="w-12 h-full flex items-center justify-center"
            >
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
    { id: "logs", icon: FileText, label: "System Logs" },
    { id: "nodes", icon: Server, label: "Nodes" },
    { id: "trends", icon: BarChart3, label: "Threat Trends" },
    { id: "api", icon: Code, label: "API Docs" },
    { id: "health", icon: ShieldCheck, label: "Health Check" },
    { id: "intelligence", icon: Bot, label: "Intel" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-16 md:w-20 border-r border-[#222] bg-[#0a0a0a]/90 backdrop-blur flex flex-col items-center py-6 gap-6 z-20 overflow-y-auto"
    >
      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mb-4">
        <Shield className="text-[#00f0ff]" size={24} />
      </div>

      {items.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-3 rounded-xl transition-all duration-300 group ${
            activeTab === item.id
              ? "bg-[#00f0ff]/10 text-[#00f0ff]"
              : "text-gray-500 hover:text-white hover:bg-[#ffffff05]"
          }`}
        >
          <item.icon size={20} />
          {activeTab === item.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00f0ff] rounded-r-full"
            />
          )}

          <span className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1a1a1a] border border-[#333] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};

const DashboardHeader = ({
  isRunning,
  toggleSystem,
  onLogout,
  notifications,
}) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="h-16 border-b border-[#222] bg-[#0a0a0a]/50 backdrop-blur flex items-center justify-between px-6 z-10"
  >
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold font-tech text-white">
        COMMAND_CENTER <span className="text-[#00f0ff]">///</span>
      </h2>
      <div className="h-6 w-[1px] bg-[#333]" />
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
          isRunning
            ? "border-[#00ff9f]/30 bg-[#00ff9f]/10 text-[#00ff9f]"
            : "border-[#ff003c]/30 bg-[#ff003c]/10 text-[#ff003c]"
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isRunning ? "bg-[#00ff9f] animate-pulse" : "bg-[#ff003c]"
          }`}
        />
        {isRunning ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
        <span className="flex items-center gap-2">
          <Globe size={14} /> US-EAST-1
        </span>
        <span className="flex items-center gap-2">
          <Wifi size={14} /> 12ms
        </span>
      </div>

      <div className="h-6 w-[1px] bg-[#333]" />

      <button className="relative text-gray-400 hover:text-white transition-colors">
        <Bell size={20} />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00f0ff] rounded-full" />
        )}
      </button>

      <button
        onClick={toggleSystem}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-300 ${
          isRunning
            ? "border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c]/20"
            : "border-[#00ff9f] text-[#00ff9f] hover:bg-[#00ff9f]/20"
        }`}
      >
        {isRunning ? (
          <Square size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" />
        )}
      </button>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#7000ff] p-[1px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <Users size={14} className="text-white" />
          </div>
        </div>
      </button>
    </div>
  </motion.header>
);

const StatCard = ({
  title,
  value,
  subtext,
  trend,
  color,
  icon: Icon,
  delay,
}) => (
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
        <span className="text-xs font-mono uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="text-3xl font-bold font-tech text-white mb-1">
        {value}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={trend > 0 ? "text-[#00ff9f]" : "text-[#ff003c]"}>
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
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
    level: "High",
  });

  const toggleSetting = (key) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
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
              <div className="text-xs text-gray-500">
                Adjust sensitivity of the IDS engine
              </div>
            </div>
            <div className="flex gap-2">
              {["Low", "Medium", "High", "Paranoid"].map((lvl) => (
                <motion.button
                  key={lvl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    config.level === lvl
                      ? "bg-[#00f0ff] text-black"
                      : "bg-[#333] text-white hover:bg-[#444]"
                  }`}
                  onClick={() => setConfig((prev) => ({ ...prev, level: lvl }))}
                >
                  {lvl}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Toggle Settings */}
          {[
            {
              key: "autoBan",
              label: "Auto IP Ban",
              desc: "Automatically block suspicious IPs",
            },
            {
              key: "honeypot",
              label: "Honeypot Enabled",
              desc: "Deploy decoy services for attackers",
            },
            {
              key: "dpi",
              label: "Deep Packet Inspection",
              desc: "Analyze payload content",
            },
            {
              key: "notifications",
              label: "Real-time Alerts",
              desc: "Receive instant notifications",
            },
          ].map((setting) => (
            <motion.div
              key={setting.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded bg-[#1a1a1a] border border-[#333] hover:border-[#00f0ff]/30 transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-white">
                  {setting.label}
                </div>
                <div className="text-xs text-gray-500">{setting.desc}</div>
              </div>
              <motion.button
                onClick={() => toggleSetting(setting.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  config[setting.key] ? "bg-[#00f0ff]" : "bg-[#333]"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  animate={{ x: config[setting.key] ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
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
            {
              rule: "Port Scanning Detected",
              action: "Block & Alert",
              status: true,
            },
            { rule: "DDoS Pattern Match", action: "Mitigate", status: true },
            { rule: "Data Exfiltration", action: "Block", status: true },
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
    { time: "00:00", malware: 4, ddos: 2, brute: 8 },
    { time: "04:00", malware: 6, ddos: 4, brute: 10 },
    { time: "08:00", malware: 8, ddos: 3, brute: 12 },
    { time: "12:00", malware: 10, ddos: 5, brute: 15 },
    { time: "16:00", malware: 7, ddos: 2, brute: 9 },
    { time: "20:00", malware: 12, ddos: 8, brute: 18 },
    { time: "23:59", malware: 15, ddos: 12, brute: 22 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-xl font-bold font-tech text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-[#00f0ff]" /> 24H Threat Trends
        </h3>

        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #333",
                }}
              />
              <Bar
                dataKey="malware"
                fill="#ff003c"
                name="Malware"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ddos"
                fill="#ffcc00"
                name="DDoS"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="brute"
                fill="#00f0ff"
                name="Brute Force"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Malware Attacks",
            value: "127",
            trend: "+18%",
            color: "#ff003c",
          },
          {
            label: "DDoS Attempts",
            value: "53",
            trend: "-5%",
            color: "#ffcc00",
          },
          {
            label: "Brute Force",
            value: "342",
            trend: "+12%",
            color: "#00f0ff",
          },
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
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div
                className={`text-sm ${
                  stat.trend.startsWith("+")
                    ? "text-[#ff003c]"
                    : "text-[#00ff9f]"
                }`}
              >
                {stat.trend} from yesterday
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- API DOCUMENTATION COMPONENT ---
const APIDocsTab = () => {
  const [expanded, setExpanded] = useState(null);

  const endpoints = [
    {
      method: "GET",
      path: "/api/threats",
      description: "Retrieve all detected threats",
      params: ["limit", "offset", "severity"],
      example: 'curl -H "Auth: token" https://api.sentinel.core/api/threats',
    },
    {
      method: "POST",
      path: "/api/block-ip",
      description: "Block an IP address immediately",
      params: ["ip", "duration", "reason"],
      example:
        'curl -X POST -d "ip=192.168.1.1" https://api.sentinel.core/api/block-ip',
    },
    {
      method: "GET",
      path: "/api/nodes",
      description: "Get status of all monitoring nodes",
      params: ["region"],
      example: "curl https://api.sentinel.core/api/nodes?region=us-east",
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
        <p className="text-gray-400 text-sm">
          Integrate Sentinel Core into your security workflows
        </p>
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
              <div
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  endpoint.method === "GET"
                    ? "bg-[#00f0ff]/20 text-[#00f0ff]"
                    : "bg-[#7000ff]/20 text-[#7000ff]"
                }`}
              >
                {endpoint.method}
              </div>
              <div>
                <div className="font-mono text-white">{endpoint.path}</div>
                <div className="text-xs text-gray-500">
                  {endpoint.description}
                </div>
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
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-[#333] p-6 bg-[#1a1a1a]"
              >
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-bold text-white mb-2">
                      Parameters
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((p, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-gray-400 font-mono"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-2">
                      Example Request
                    </div>
                    <div className="bg-[#050505] p-3 rounded border border-[#333] overflow-x-auto">
                      <code className="text-xs text-[#00f0ff] font-mono">
                        {endpoint.example}
                      </code>
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
    coreEngine: { status: "healthy", latency: "2ms", uptime: "99.98%" },
    database: { status: "healthy", latency: "5ms", uptime: "99.95%" },
    networks: { status: "healthy", latency: "12ms", uptime: "100%" },
    aiModel: { status: "training", latency: "15ms", uptime: "99.99%" },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "#00ff9f";
      case "warning":
        return "#ffcc00";
      case "training":
        return "#00f0ff";
      default:
        return "#ff003c";
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-gray-500"
          >
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
                <div className="font-mono text-white text-sm capitalize">
                  {service.replace(/([A-Z])/g, " $1")}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: getStatusColor(data.status) }}
                  ></div>
                  <span className="text-xs font-bold capitalize text-gray-400">
                    {data.status}
                  </span>
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
                  initial={{ width: "70%" }}
                  animate={{
                    width:
                      data.uptime === "100%"
                        ? "100%"
                        : data.uptime === "99.99%"
                        ? "99.99%"
                        : "95%",
                  }}
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
          <AlertTriangle size={20} className="text-[#ffcc00]" /> Recent Issues
          (Last 24h)
        </h3>

        <div className="space-y-2">
          {[
            {
              time: "3 hours ago",
              service: "Honeypot-SSH",
              issue: "Memory usage spike (82%)",
            },
            {
              time: "8 hours ago",
              service: "Database",
              issue: "Query latency increased",
            },
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
    if (typeof log !== "string") return "text-gray-500";
    if (log.startsWith("✅") || log.startsWith("🤖"))
      return "text-[#00ff9f] font-semibold";
    if (log.includes("DoS") || log.includes("❌") || log.includes("⚠️"))
      return "text-[#ff003c] font-semibold";
    if (log.includes("Scanning")) return "text-[#00f0ff]";
    if (log.includes("Honeypot")) return "text-[#ffcc00]";
    return "text-gray-400";
  };

  return (
    <div className="whitespace-pre-wrap break-words leading-relaxed">
      <span className="text-gray-600">
        {String(index + 1).padStart(3, "0")} │
      </span>
      <span className={getLogColor(log)}>
        {typeof log === "string" ? log : JSON.stringify(log)}
      </span>
    </div>
  );
});

// --- ENHANCED TERMINAL COMPONENT (OPTIMIZED) ---
const EnhancedTerminal = React.memo(({ logs }) => {
  const scrollRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalLines = useMemo(() => logs.slice(0, 20), [logs]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" });
  }, [logs]);

  return (
    <div
      className={`${
        isMaximized ? "fixed inset-0 z-50 m-4" : "md:col-span-4"
      } glass-panel rounded-2xl p-0 overflow-hidden flex flex-col border border-[#00f0ff]/20`}
      style={{
        background: "rgba(5, 5, 5, 0.85)",
        backdropFilter: "blur(10px)",
        willChange: "transform",
      }}
    >
      {/* Terminal Header */}
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
              SENTINEL.CORE ~ TERMINAL
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

      {/* Terminal Content */}
      <div
        className="flex-1 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505] p-6 font-mono text-xs overflow-y-auto custom-scrollbar relative"
        style={{ willChange: "scroll-position" }}
      >
        {/* Minimal grid background */}
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
          <div ref={scrollRef} />
        </div>

        {/* Simple prompt indicator */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[#00f0ff]">$</span>
          <span className="text-[#00f0ff] animate-pulse">▌</span>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="bg-[#1a1a1a] border-t border-[#00f0ff]/20 px-4 py-2 flex justify-between items-center text-[10px] text-gray-500">
        <span className="flex items-center gap-2">
          <Radio size={10} className="text-[#00ff9f]" />
          LIVE
        </span>
        <span>{terminalLines.length} lines</span>
      </div>
    </div>
  );
});

// --- ENHANCED CHARTS SECTION ---
const ProtocolCard = React.memo(({ item, index }) => (
  <div className="p-4 rounded-lg border border-[#333] bg-black">
    <div className="flex items-center gap-2 mb-3">
      <div
        className="w-3 h-3 rounded-full"
        style={{ background: item.color }}
      />
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

  const trafficBychannelData = useMemo(
    () => [
      { name: "HTTPS", value: 42, color: "#00f0ff" },
      { name: "HTTP", value: 28, color: "#7000ff" },
      { name: "DNS", value: 18, color: "#00ff9f" },
      { name: "FTP", value: 12, color: "#ffcc00" },
    ],
    []
  );

  const latencyData = useMemo(() => {
    let value = 50;
    return Array.from({ length: 10 }, (_, i) => {
      value += (Math.random() - 0.5) * 20;
      value = Math.max(10, Math.min(90, value));
      return {
        time: `${String(i).padStart(2, "0")}:00`,
        value: Math.round(value),
        baseline: 50,
      };
    });
  }, []);

  const protocolData = useMemo(() => {
    let value = 50;
    return Array.from({ length: 8 }, (_, i) => {
      value += (Math.random() - 0.5) * 20;
      value = Math.max(10, Math.min(90, value));
      return {
        time: `${String(i).padStart(2, "0")}:00`,
        value: Math.round(value),
        baseline: 50,
      };
    });
  }, []);

  const performanceData = useMemo(
    () => [
      { metric: "Throughput", value: 78 },
      { metric: "Latency", value: 85 },
      { metric: "Availability", value: 99 },
      { metric: "Security", value: 92 },
      { metric: "Efficiency", value: 88 },
      { metric: "Load", value: 72 },
    ],
    []
  );

  return (
    <>
      <div className="space-y-6 mt-6">
        <div
          className="glass-panel rounded-xl p-6"
          style={{ willChange: "transform" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-tech text-lg text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-[#00f0ff]" />{" "}
              PROTOCOL_DISTRIBUTION
            </h3>
            <Badge>Last 24 Hours</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {trafficBychannelData.map((item, i) => (
              <ProtocolCard key={i} item={item} index={i} />
            ))}
          </div>

          <div style={{ height: "224px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficBychannelData} isAnimationActive={false}>
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#00f0ff" }}
                />
                <Bar
                  dataKey="value"
                  fill="#00f0ff"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                />
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
            <div style={{ height: "224px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData} isAnimationActive={false}>
                  <defs>
                    <linearGradient
                      id="colorLatency"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ffcc00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #333",
                    }}
                    formatter={(value) => [`${value}ms`, "Latency"]}
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
            <div style={{ height: "224px" }}>
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
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #333",
                    }}
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
          <div style={{ height: "280px" }}>
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
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #00f0ff",
                  }}
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
          <div style={{ height: "224px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={protocolData} isAnimationActive={false}>
                <defs>
                  <linearGradient id="colorProto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7000ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7000ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #333",
                  }}
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
              transition={{
                duration: 0.4,
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
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
                    <Wifi size={28} className="text-[#7000ff]" />{" "}
                    PROTOCOL_MIX_ANALYSIS
                  </h2>
                  <p className="text-gray-400">
                    Detailed protocol distribution breakdown
                  </p>
                </div>

                {/* Pie Chart */}
                <div style={{ height: "400px" }} className="mb-8">
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
                        contentStyle={{
                          backgroundColor: "#0a0a0a",
                          border: "1px solid #00f0ff",
                          borderRadius: "8px",
                        }}
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
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span className="font-mono font-bold text-white">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {item.value}%
                      </div>
                      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            background: item.color,
                            width: `${item.value}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Packets/sec: {Math.floor(item.value * 100)}
                      </div>
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

// --- DASHBOARD LOGIC UPDATE ---
const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    cpu: 15,
    ram: 42,
    net: 120,
    threats: 0,
  });
  const [trafficData, setTrafficData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Simulation State Refs
  const bootIndexRef = useRef(0);
  const timeRef = useRef(0);

  // Simulation Engine
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      // 1. BOOT SEQUENCE (First few seconds)
      if (bootIndexRef.current < BOOT_SEQUENCE.length) {
        setLogs((prev) => [BOOT_SEQUENCE[bootIndexRef.current], ...prev]);
        bootIndexRef.current += 1;
        return;
      }

      // 2. MAIN ATTACK LOOP
      const currentTime = new Date().toLocaleTimeString();
      timeRef.current += 1;

      // Determine Event Type based on a simple cycle
      // Cycle: Port Scan -> DoS -> Traffic/Healing
      const cycle = timeRef.current % 30; // 30 ticks cycle

      let newLog = null;

      // Phase 1: Port Scanning (Ticks 0-10)
      if (cycle < 10) {
        const port = 20 + cycle;
        newLog = `[Port Scan] Starting scan at ${currentTime}\n➡ Scanning Port ${port}...`;
        if (cycle === 9)
          newLog += `\nPort scan completed with detectable payload '###PORT_SCAN###'`;
      }
      // Phase 2: DoS Attack (Ticks 10-15)
      else if (cycle >= 10 && cycle < 15) {
        newLog = `[DoS] Sending attack at ${currentTime}\n📦 Sent 100 crafted DoS packets with payload '###DOS_ATTACK###'`;
        // Generate Alert
        if (Math.random() > 0.5) {
          setAlerts((prev) =>
            [
              {
                id: Date.now(),
                type: "DoS Attack",
                target: "api-gateway",
                severity: "CRITICAL",
                time: "Just now",
              },
              ...prev,
            ].slice(0, 5)
          );
        }
      }
      // Phase 3: Traffic & Healing (Ticks 15-30)
      else {
        // Mix of traffic logs and threat sequence
        const subCycle = cycle - 15;
        // Generate a random index to pick from TRAFFIC_LOGS for more variety
        const trafficIndex = Math.floor(Math.random() * TRAFFIC_LOGS.length);

        if (Math.random() > 0.3) {
          newLog = TRAFFIC_LOGS[trafficIndex];
        } else {
          // Occasionally show threat sequence steps
          const threatIndex = timeRef.current % THREAT_SEQUENCE.length;
          newLog = THREAT_SEQUENCE[threatIndex];
        }
      }

      if (newLog) {
        setLogs((prev) => [newLog, ...prev].slice(0, CONFIG.maxLogs));
      }

      // Stats Update
      setStats((prev) => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.min(100, Math.max(20, prev.ram + (Math.random() - 0.5) * 5)),
        net: Math.max(0, prev.net + (Math.random() - 0.5) * 50),
        threats: Math.random() > 0.95 ? prev.threats + 1 : prev.threats,
      }));

      // Traffic Graph
      setTrafficData((prev) => [
        ...prev.slice(-30),
        {
          time: currentTime,
          inbound: Math.floor(Math.random() * 500) + 100,
          outbound: Math.floor(Math.random() * 300) + 50,
          threats:
            cycle >= 10 && cycle < 15 ? 150 : Math.floor(Math.random() * 20),
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleSystem = async () => {
    try {
      if (!isRunning) {
        // START IDS (backend)
        await axios.post("http://127.0.0.1:8000/ids/start");

        // UI + simulation
        setIsRunning(true);
        setLogs([">> SYSTEM INITIALIZED"]);
        bootIndexRef.current = 0;
      } else {
        // STOP IDS (backend)

        // UI
        setIsRunning(false);
        setLogs((prev) => [">> SYSTEM HALTED", ...prev]);
      }
    } catch (error) {
      console.error("IDS control failed:", error);

      setLogs((prev) => [
        "❌ ERROR: Failed to communicate with IDS backend",
        ...prev,
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-gray-200 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          isRunning={isRunning}
          toggleSystem={toggleSystem}
          onLogout={onLogout}
          notifications={alerts.length}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, #1a1a1a 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
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

                {/* Main Traffic Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="md:col-span-3 glass-panel rounded-xl p-6 min-h-[400px] flex flex-col"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold font-tech text-lg text-white flex items-center gap-2">
                      <Activity size={20} className="text-[#00f0ff]" />{" "}
                      NETWORK_TRAFFIC_ANALYSIS
                    </h3>
                    <div className="flex gap-2">
                      {["1H", "24H", "7D"].map((t) => (
                        <button
                          key={t}
                          className="px-3 py-1 text-xs border border-[#333] rounded hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData}>
                        <defs>
                          <linearGradient
                            id="colorInbound"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#00f0ff"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#00f0ff"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorThreat"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#ff003c"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ff003c"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0a0a0a",
                            border: "1px solid #333",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="inbound"
                          stroke="#00f0ff"
                          fill="url(#colorInbound)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="threats"
                          stroke="#ff003c"
                          fill="url(#colorThreat)"
                          strokeWidth={2}
                        />
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
                      <div className="text-gray-500 text-sm text-center py-10">
                        No active alerts.
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-3 rounded bg-[#1a1a1a] border border-[#333] border-l-4 border-l-[#ff003c]"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[#ff003c] font-bold text-xs">
                              {alert.type}
                            </span>
                            <span className="text-gray-500 text-[10px]">
                              {alert.time}
                            </span>
                          </div>
                          <div className="text-gray-300 text-sm mb-1">
                            {alert.target}
                          </div>
                          <div className="inline-block px-1.5 py-0.5 bg-[#ff003c]/20 text-[#ff003c] text-[10px] rounded">
                            {alert.severity}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>

                {/* Enhanced Terminal */}
                <EnhancedTerminal logs={logs} />

                {/* Enhanced Charts Section */}
                <motion.div className="md:col-span-4">
                  <EnhancedChartsSection />
                </motion.div>
              </motion.div>
            )}

            {activeTab === "logs" && (
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
                    <Button size="sm" variant="outline">
                      <Filter size={14} className="mr-2" /> Filter
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw size={14} className="mr-2" /> Refresh
                    </Button>
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
                    {logs.map((log, i) => (
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

            {activeTab === "intelligence" && (
              <IntelTab logs={logs} stats={stats} />
            )}

            {activeTab === "trends" && <ThreatTrendsTab />}

            {activeTab === "api" && <APIDocsTab />}

            {activeTab === "health" && <HealthCheckTab />}

            {activeTab === "settings" && <SettingsTab />}

            {activeTab === "nodes" && (
              <motion.div
                key="nodes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="p-6 hover:border-[#00f0ff] transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Server
                        size={32}
                        className="text-gray-500 group-hover:text-[#00f0ff] transition-colors"
                      />
                      <div className="px-2 py-1 rounded bg-[#00ff9f]/10 text-[#00ff9f] text-xs font-bold">
                        ONLINE
                      </div>
                    </div>
                    <h3 className="font-bold text-white mb-2">
                      NODE-US-E-{i + 1}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>IP</span> <span>10.0.0.{12 + i}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Load</span>{" "}
                        <span>{Math.floor(Math.random() * 40 + 10)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime</span>{" "}
                        <span>{Math.floor(Math.random() * 90 + 10)}d</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
