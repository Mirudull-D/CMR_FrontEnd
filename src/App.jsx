import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  ChevronDown,
  Zap,
  Database,
  X,
  Minimize2,
  Maximize2,
  Radio,
  Code,
  HardDrive,
  CheckCircle2,
  Fingerprint,
  Siren,
  BarChart3,
  Check,
  LayoutGrid,
  Users,
  Bell,
  RefreshCw,
  FileText,
  Filter,
  ShieldCheck,
  CloudLightning,
  Loader2,
  Bot,
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
  apiKey: "AIzaSyALR2ZMEbnpOnPQORq7vqaFrKLywFJU0Ic",
  backendUrl: "http://127.0.0.1:8000",
};

const COLORS = {
  bg: "#050505",
  panel: "#0a0a0a",
  border: "#333333",
  primary: "#00f0ff",
  secondary: "#7000ff",
  alert: "#ff003c",
  success: "#00ff9f",
  warn: "#ffcc00",
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

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&family=Rajdhani:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; }
    
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
      margin: 0;
      padding: 0;
    }
    
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .font-tech { font-family: 'Rajdhani', sans-serif; }
    
    /* SCROLLBAR */
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${COLORS.primary}; }

    /* EFFECTS */
    .crt-overlay {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                  linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
    
    .glass-panel {
      background: rgba(10, 10, 10, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }

    /* ANIMATIONS */
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

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee { animation: marquee 30s linear infinite; }

    @keyframes blob-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    .animate-blob { animation: blob-pulse 7s ease-in-out infinite; }
    .animation-delay-0 { animation-delay: 0s; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `}</style>
);

// --- MAIN APP ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("landing");

  useEffect(() => {
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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

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

// --- REUSABLE COMPONENTS ---
const Button = React.memo(({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] disabled:pointer-events-none disabled:opacity-50 font-tech uppercase tracking-wider";

  const variants = {
    primary:
      "bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95",
    secondary: "bg-[#1a1a1a] text-white hover:bg-[#333] border border-[#333] hover:border-[#555]",
    ghost: "hover:bg-[#ffffff10] text-gray-300 hover:text-white",
    outline:
      "border border-[#00f0ff] text-[#00f0ff] bg-transparent hover:bg-[#00f0ff]/10",
    destructive: "bg-[#ff003c] text-white hover:bg-[#ff003c]/90",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

const Card = React.memo(({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm text-gray-200 ${className}`}
  >
    {children}
  </div>
));

const Badge = React.memo(({ children, variant = "default", className = "" }) => {
  const styles =
    variant === "outline"
      ? "border border-[#333] text-gray-400"
      : "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles} ${className}`}
    >
      {children}
    </span>
  );
});

// --- LANDING PAGE ---
const LandingPage = ({ onEnter }) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      ref={scrollRef}
      className="h-screen w-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth relative"
    >
      {/* Background */}
      <motion.div
        style={{ y: bgY }}
        className="fixed inset-0 z-0 bg-black pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7000ff]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`star-${i}`}
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
      </motion.div>

      <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-[#050505]/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Shield className="h-6 w-6 text-[#00f0ff]" />
            <span className="text-lg font-bold font-tech tracking-wide text-white">
              SENTINEL<span className="text-[#00f0ff]">CORE</span>
            </span>
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {["features", "architecture", "pricing"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="hover:text-[#00f0ff] transition-colors capitalize"
              >
                {section}
              </button>
            ))}
          </nav>
          <Button size="sm" onClick={onEnter}>
            Launch Console
          </Button>
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
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
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline">
                <span className="w-2 h-2 bg-[#00ff9f] rounded-full mr-2 inline-block animate-pulse" />
                Systems Operational
              </Badge>
            </motion.div>

            <motion.h1
              className="mt-6 text-6xl md:text-9xl font-black tracking-tighter text-white font-tech uppercase leading-[0.9]"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div>Defend</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-white to-[#7000ff]">
                The Network
              </div>
            </motion.h1>

            <motion.p
              className="mt-8 text-xl md:text-2xl text-gray-400 max-w-3xl font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Military-grade intrusion detection powered by advanced neural
              networks. Real-time threat analysis, automated mitigation, and
              global node visualization.
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col md:flex-row gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={onEnter}
                className="gap-2 px-10 h-16 text-xl"
              >
                <TerminalIcon size={24} /> Initialize Console
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-10 h-16 text-xl"
              >
                <Play size={24} /> Watch Demo
              </Button>
            </motion.div>

            {/* Floating orbs */}
            <div className="absolute -top-40 -left-20 w-64 h-64 bg-[#7000ff] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-0" />
            <div className="absolute -bottom-40 -right-20 w-64 h-64 bg-[#00f0ff] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000" />
          </motion.div>

          <motion.button
            onClick={() => scrollToSection("ticker")}
            className="absolute bottom-10 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <ChevronDown className="text-gray-500" size={32} />
          </motion.button>
        </section>

        {/* Ticker */}
        <section
          id="ticker"
          className="w-full bg-[#00f0ff]/5 border-y border-[#00f0ff]/20 py-4 overflow-hidden"
        >
          <div className="flex animate-marquee whitespace-nowrap gap-12">
            {[...Array(10)].map((_, i) => (
              <div
                key={`ticker-${i}`}
                className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]"
              >
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

        {/* Rest of landing page sections omitted for brevity */}
        <footer className="w-full border-t border-[#222] bg-[#0a0a0a] py-12 mt-32">
          <div className="container mx-auto px-6 text-center text-gray-500">
            <p>© 2026 SENTINEL CORE. DEFENDING THE FUTURE.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Dashboard Component with all fixes
const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ cpu: 15, ram: 42, net: 120, threats: 0 });
  const [trafficData, setTrafficData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const bootIndexRef = useRef(0);
  const timeRef = useRef(0);

  // Fixed toggleSystem (only ONE definition)
  const toggleSystem = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (!isRunning) {
        await axios.post(`${CONFIG.backendUrl}/ids/start`);
        setIsRunning(true);
        setLogs([">> SYSTEM INITIALIZED"]);
        bootIndexRef.current = 0;
      } else {
        await axios.post(`${CONFIG.backendUrl}/ids/stop`);
        setIsRunning(false);
        setLogs((prev) => [">> SYSTEM HALTED", ...prev]);
      }
    } catch (error) {
      console.error("IDS control failed:", error);
      setLogs((prev) => [
        "❌ ERROR: Failed to communicate with IDS backend",
        ...prev,
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isRunning, isLoading]);

  // Simulation engine with proper cleanup
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (bootIndexRef.current < BOOT_SEQUENCE.length) {
        setLogs((prev) => [BOOT_SEQUENCE[bootIndexRef.current], ...prev]);
        bootIndexRef.current += 1;
        return;
      }

      const currentTime = new Date().toLocaleTimeString();
      timeRef.current += 1;
      const cycle = timeRef.current % 30;

      let newLog = null;

      if (cycle < 10) {
        const port = 20 + cycle;
        newLog = `[Port Scan] Scanning Port ${port}... at ${currentTime}`;
      } else if (cycle >= 10 && cycle < 15) {
        newLog = `[DoS] Attack detected at ${currentTime}`;
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
      } else {
        newLog = TRAFFIC_LOGS[Math.floor(Math.random() * TRAFFIC_LOGS.length)];
      }

      if (newLog) {
        setLogs((prev) => [newLog, ...prev].slice(0, CONFIG.maxLogs));
      }

      setStats((prev) => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.min(100, Math.max(20, prev.ram + (Math.random() - 0.5) * 5)),
        net: Math.max(0, prev.net + (Math.random() - 0.5) * 50),
        threats: Math.random() > 0.95 ? prev.threats + 1 : prev.threats,
      }));

      setTrafficData((prev) =>
        [
          ...prev.slice(-30),
          {
            time: currentTime,
            inbound: Math.floor(Math.random() * 500) + 100,
            outbound: Math.floor(Math.random() * 300) + 50,
            threats: cycle >= 10 && cycle < 15 ? 150 : Math.floor(Math.random() * 20),
          },
        ]
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="flex h-screen bg-[#050505] text-gray-200 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          isRunning={isRunning}
          isLoading={isLoading}
          toggleSystem={toggleSystem}
          onLogout={onLogout}
          notifications={alerts.length}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab
                key="overview"
                stats={stats}
                logs={logs}
                trafficData={trafficData}
                alerts={alerts}
              />
            )}
            {activeTab === "logs" && <LogsTab key="logs" logs={logs} />}
            {activeTab === "intelligence" && (
              <IntelTab key="intel" logs={logs} stats={stats} />
            )}
            {activeTab === "settings" && <SettingsTab key="settings" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Sidebar with proper hover states
const Sidebar = React.memo(({ activeTab, setActiveTab }) => {
  const items = [
    { id: "overview", icon: LayoutGrid, label: "Overview" },
    { id: "logs", icon: FileText, label: "System Logs" },
    { id: "intelligence", icon: Bot, label: "Intel" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-20 border-r border-[#222] bg-[#0a0a0a]/90 backdrop-blur flex flex-col items-center py-6 gap-6"
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
});

// Dashboard Header
const DashboardHeader = React.memo(({
  isRunning,
  isLoading,
  toggleSystem,
  onLogout,
  notifications,
}) => (
  <header className="h-16 border-b border-[#222] bg-[#0a0a0a]/50 backdrop-blur flex items-center justify-between px-6">
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
      <button className="relative text-gray-400 hover:text-white transition-colors">
        <Bell size={20} />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00f0ff] rounded-full" />
        )}
      </button>

      <Button
        onClick={toggleSystem}
        disabled={isLoading}
        variant={isRunning ? "destructive" : "primary"}
        size="sm"
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isRunning ? (
          <><Square size={16} fill="currentColor" /> Stop</>
        ) : (
          <><Play size={16} fill="currentColor" /> Start</>
        )}
      </Button>

      <button
        onClick={onLogout}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#7000ff] p-[1px] hover:opacity-80 transition-opacity"
      >
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
          <Users size={14} className="text-white" />
        </div>
      </button>
    </div>
  </header>
));

// Overview Tab (simplified)
const OverviewTab = React.memo(({ stats, logs, trafficData, alerts }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-4 gap-6">
      <StatCard title="CPU Load" value={`${Math.floor(stats.cpu)}%`} color="#00f0ff" icon={Cpu} />
      <StatCard title="RAM Usage" value={`${Math.floor(stats.ram)}%`} color="#7000ff" icon={Database} />
      <StatCard title="Network" value={`${Math.floor(stats.net)} MB/s`} color="#00ff9f" icon={Wifi} />
      <StatCard title="Threats" value={stats.threats} color="#ff003c" icon={Shield} />
    </div>
    
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-bold font-tech text-white mb-4">Traffic Overview</h3>
      <div style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData}>
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #333" }} />
            <Area type="monotone" dataKey="inbound" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    <TerminalPanel logs={logs} />
  </motion.div>
));

// Logs Tab
const LogsTab = React.memo(({ logs }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="glass-panel rounded-xl p-6 h-full"
  >
    <h2 className="text-xl font-bold font-tech text-white mb-4">System Logs</h2>
    <div className="space-y-2">
      {logs.map((log, i) => (
        <div key={`log-${i}`} className="p-3 rounded bg-[#0a0a0a] border border-[#222] font-mono text-xs">
          {log}
        </div>
      ))}
    </div>
  </motion.div>
));

// Terminal Panel
const TerminalPanel = React.memo(({ logs }) => {
  const terminalLines = useMemo(() => logs.slice(0, 15), [logs]);

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="bg-[#1a1a1a] p-3 flex items-center gap-2 border-b border-[#333]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff003c]" />
          <div className="w-3 h-3 rounded-full bg-[#ffcc00]" />
          <div className="w-3 h-3 rounded-full bg-[#00ff9f]" />
        </div>
        <span className="font-mono text-xs text-white ml-2">TERMINAL</span>
      </div>
      <div className="bg-[#050505] p-4 font-mono text-xs h-64 overflow-y-auto custom-scrollbar">
        {terminalLines.map((log, i) => (
          <div key={`term-${i}`} className="text-gray-400 mb-1">
            <span className="text-gray-600">{String(i + 1).padStart(3, "0")} │ </span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
});

// Stat Card
const StatCard = React.memo(({ title, value, color, icon: Icon }) => (
  <div className="glass-panel rounded-xl p-5 hover:border-[#00f0ff]/50 transition-all">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} style={{ color }} />
      <span className="text-xs font-mono uppercase text-gray-400">{title}</span>
    </div>
    <div className="text-3xl font-bold font-tech text-white">{value}</div>
  </div>
));

// Intel Tab (AI Chat)
const IntelTab = ({ logs, stats }) => {
  const [messages, setMessages] = useState([
    { role: "model", text: "I am Sentinel's AI. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${CONFIG.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userMsg }] }],
          }),
        }
      );

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error";
      setMessages((prev) => [...prev, { role: "model", text: botResponse }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", text: "Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel rounded-xl p-6 h-full flex flex-col"
    >
      <h2 className="text-xl font-bold font-tech text-white mb-4">AI Intelligence</h2>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={`msg-${i}`}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-[#00f0ff]/10 border border-[#00f0ff]/30 ml-auto max-w-[80%]"
                : "bg-[#1a1a1a] border border-[#333] mr-auto max-w-[80%]"
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {msg.role === "user" ? "YOU" : "SENTINEL AI"}
            </div>
            <div className="text-sm">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={16} className="animate-spin" /> Analyzing...
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about threats..."
          disabled={isLoading}
          className="flex-1 bg-[#050505] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none disabled:opacity-50"
        />
        <Button onClick={handleSend} disabled={isLoading}>
          <Send size={18} />
        </Button>
      </div>
    </motion.div>
  );
};

// Settings Tab
const SettingsTab = () => {
  const [config, setConfig] = useState({ autoBan: true, notifications: true });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel rounded-xl p-6 max-w-2xl"
    >
      <h2 className="text-xl font-bold font-tech text-white mb-6">Settings</h2>
      <div className="space-y-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 rounded bg-[#0a0a0a] border border-[#333]">
            <span className="text-white capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <button
              onClick={() => setConfig((prev) => ({ ...prev, [key]: !prev[key] }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                value ? "bg-[#00f0ff]" : "bg-[#333]"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                animate={{ x: value ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500 }}
              />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
