export const profile = {
  name: "Ifrahuddin Azmi",
  initials: "IA",
  role: "Automation Test Engineer",
  roles: [
    "Automation Test Engineer",
    "Embedded & Industrial OT Validation",
    "Python Framework Architect",
    "AI-Assisted Test Engineering",
  ],
  headline: "I break hardware on purpose — so it never breaks in the field.",
  summary:
    "Automation Test Engineer with 5+ years architecting and owning Python automation frameworks across embedded instruments, industrial (OT) networks, wireless medical devices and web/desktop applications. Currently building Robot Framework automation for SCPI-controlled precision pressure controllers and validating an AI-driven OT cybersecurity appliance on NVIDIA edge compute.",
  email: "ifrahazmi@live.com",
  phone: "+91 8709318232",
  location: "Bengaluru, India",
  company: "Utthunga Technologies Pvt. Ltd.",
  companyShort: "Utthunga Technologies",
  client: "Client: Belden",
  years: "5+",
  resume: "/Ifrah_Azmi_Resume_Updated.pdf",
  photo: "/profile.jpg",
  links: {
    linkedin: "https://www.linkedin.com/in/ifrahuddin-azmi-8869787a/",
    github: "https://github.com/ifrahazmi",
    x: "https://x.com/Ifrah_Azmi",
    site: "https://ifrahazmi.wixsite.com/techpark",
    facebook: "https://www.facebook.com/Ifrahaz/",
    instagram: "https://www.instagram.com/ifrah_azmi/",
  },
} as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const marqueeItems = [
  "Python",
  "Robot Framework",
  "PyTest",
  "Selenium",
  "Squish BDD",
  "SCPI",
  "Druck PACE6000",
  "BLE",
  "Wi-Fi 802.11",
  "MQTT",
  "Wireshark",
  "Scapy",
  "NVIDIA Edge",
  "Ubuntu",
  "Kali",
  "OpenWrt",
  "Docker",
  "Jenkins",
  "PostgreSQL",
  "Prisma",
  "Pandas",
  "Streamlit",
  "Gemini API",
  "Azure AI Foundry",
  "TestRail",
  "JIRA",
  "AWS",
  "GCP",
] as const;

export const stats = [
  { value: 5, suffix: "+", label: "Years of experience", hint: "Embedded · OT · Wireless", icon: "clock" },
  { value: 4, suffix: "", label: "Automation frameworks owned", hint: "Robot Framework · PyTest · Squish", icon: "code" },
  { value: 40, suffix: "%", label: "Less manual test design", hint: "AI test-case generation", icon: "sparkles" },
  { value: 4, suffix: "hrs", label: "Nightly regression cycle", hint: "Down from ~2 manual days", icon: "radio" },
] as const;

export const highlights = [
  {
    icon: "brain",
    title: "AI-accelerated test engineering",
    body: "Ship LLM workflows into the test bench: Azure AI Foundry test-case generation, Gemini-assisted parsing and local-model agents for anomaly detection and automated root cause analysis.",
    tags: ["Azure AI Foundry", "Gemini API", "Automated RCA"],
  },
  {
    icon: "cpu",
    title: "Python meets silicon",
    body: "SCPI instrument control over LAN, RS-232 and USB, firmware validation on Toradex Linux, sensor and DAQ verification — every measurement reported against its calibration tolerance.",
    tags: ["SCPI", "Druck PACE6000", "Toradex Linux"],
  },
  {
    icon: "shield",
    title: "Industrial OT & wireless security",
    body: "Generate benign and malicious industrial traffic to test AI detection pipelines, then prove segmentation, firewall policy and intrusion alerts hold — plus rogue AP, deauthentication, MITM and BLE spoofing on the wireless side.",
    tags: ["Wireshark", "Scapy", "OT / ICS"],
  },
  {
    icon: "network",
    title: "The failures manual testing misses",
    body: "Long-duration soak runs, throughput and stability testing, data-integrity checks over corrupt, duplicate and null packets, and Pandas/Matplotlib trend plots that make drift traceable across builds.",
    tags: ["Soak testing", "Pandas", "Data integrity"],
  },
] as const;

export type ExperienceRole = {
  role: string;
  company: string;
  client?: string;
  period: string;
  location?: string;
  summary: string;
  icon: string;
  current?: boolean;
  tags: string[];
  highlights?: string[];
  projects?: { label: string; points: string[] }[];
};

export const experiences: ExperienceRole[] = [
  {
    role: "Automation Test Engineer (Grade 2)",
    company: "Utthunga Technologies Pvt. Ltd.",
    client: "Client: Belden",
    period: "Jan 2026 — Present",
    location: "Bengaluru",
    current: true,
    icon: "briefcase",
    summary:
      "Own the Python automation stack across two client programmes: precision pressure-controller instruments for Baker Hughes and an AI-driven OT network security appliance for Belden that runs inference on NVIDIA edge compute.",
    tags: ["Robot Framework", "SCPI", "Jenkins", "OT security"],
    projects: [
      {
        label: "Baker Hughes · Druck PACE6000 Pressure Controller Automation",
        points: [
          "Designed and built the Robot Framework + Python automation framework for the Druck PACE6000 / PACE6000E modular pressure controller, replacing manual bench verification with repeatable one-command regression runs.",
          "Implemented the SCPI communication layer (LAN/Ethernet, RS-232, USB) with session handling, command/response parsing, timeout and error recovery, exposed as reusable Robot keywords for the wider test team.",
          "Automated setpoint accuracy, pressure ramp/slew, control-mode switching, range and unit configuration, leak test and self-test verification against calibration tolerances with automatic pass/fail evaluation.",
          "Added structured logging, CSV/HTML result capture and trend plots (Pandas, Matplotlib) so measurement drift and intermittent failures are traceable across builds.",
          "Integrated the suites into Jenkins for nightly execution and triaged failures with firmware and hardware teams, cutting a ~2-day manual regression cycle to under 4 hours.",
        ],
      },
      {
        label: "Belden · AI-Based OT Network Security Appliance",
        points: [
          "Validating an AI-driven industrial cybersecurity appliance that detects and blocks malicious activity targeting OT assets, built from a network module, managed switch, firewall and an NVIDIA edge compute unit running inference.",
          "Built test scenarios generating benign and malicious industrial traffic to exercise the AI anomaly-detection pipeline, verifying detection accuracy, alert latency and false-positive behaviour.",
          "Verified asset discovery, network segmentation and firewall policy enforcement, plus end-to-end alert delivery to the dashboard and notification path when intrusion attempts or anomalies are detected.",
          "Executed throughput, stability and long-duration soak testing across the switch → firewall → edge-compute chain, and automated repeatable checks in Python to shorten every validation cycle.",
        ],
      },
    ],
  },
  {
    role: "Embedded & Automation Test Engineer",
    company: "Gems Setra | Tektronix India Pvt. Ltd.",
    period: "Sep 2025 — Jan 2026",
    location: "Bengaluru",
    icon: "cpu",
    summary:
      "Built end-to-end automation across embedded devices, WebUI and QT desktop applications, and delivered an AI test-case generation pipeline alongside a secure IoT telemetry dashboard.",
    tags: ["Robot Framework", "Squish BDD", "MQTT", "Azure AI Foundry"],
    highlights: [
      "Designed end-to-end automation for embedded devices, WebUI and QT desktop applications using Robot Framework + Selenium and Squish BDD, lifting regression coverage while removing repetitive manual effort.",
      "Executed embedded firmware validation on Toradex Linux platforms and automated device configuration workflows.",
      "Built a real-time Streamlit + MQTT (TLS/PEM) telemetry dashboard for sensor devices, used for device simulation and secure publishing across multiple users.",
      "Delivered an AI-powered test-case generation solution on Azure AI Foundry, cutting manual test design effort by ~40% and reducing specification-to-test turnaround.",
    ],
  },
  {
    role: "Embedded & Automation Test Engineer",
    company: "LifeSignals India Pvt. Ltd.",
    period: "Mar 2022 — Oct 2025",
    location: "Bengaluru",
    icon: "radio",
    summary:
      "Developed and maintained Python + Robot Framework automation for biosensor firmware validation, owning BLE and Wi-Fi module testing from GATT services down to packet-level security analysis.",
    tags: ["Python", "BLE / Wi-Fi", "Scapy", "Wireshark"],
    highlights: [
      "Developed and maintained Python + Robot Framework automation for biosensor firmware validation, building reusable libraries that shortened every release validation cycle.",
      "Owned BLE and Wi-Fi module testing — GATT services, connection stability, throughput and protocol compliance across multi-device streaming scenarios.",
      "Automated data-integrity validation of streamed physiological data, handling corrupt, duplicate and null packets to prove uninterrupted device operation.",
      "Performed deep packet analysis with Wireshark and built Scapy-based wireless security tests (deauthentication, rogue access point, BLE spoofing) that hardened device firmware.",
      "Partnered with firmware and cloud teams on defect triage, root cause analysis and regression sign-off for production releases.",
    ],
  },
  {
    role: "QA Engineer — Manual Testing (Biomedical Devices)",
    company: "Transcaal Eng. India Pvt. Ltd.",
    period: "Mar 2021 — Feb 2022",
    location: "Bengaluru",
    icon: "shield",
    summary:
      "Tested ECG and patient monitoring devices against regulatory and quality standards, covering functional, usability and reliability verification before clinical release.",
    tags: ["Biomedical devices", "Regulatory QA", "Usability"],
    highlights: [
      "Tested and validated ECG and patient monitoring devices against regulatory and quality standards, covering functional, usability and reliability verification.",
      "Authored test cases and defect reports for biomedical device functionality, ensuring measurement accuracy and reliable release sign-off.",
    ],
  },
  {
    role: "B.E. Computer Science Engineering",
    company: "Visvesvaraya Technological University",
    period: "Jul 2016 — Jan 2021",
    location: "Belagavi",
    icon: "cap",
    summary:
      "Built a solid foundation in core computing principles with hands-on exposure to programming, systems design and emerging technologies — fuelling a lasting pull toward innovation and problem-solving.",
    tags: ["Core CS", "Systems design"],
  },
];

export type Project = {
  title: string;
  subtitle: string;
  kind: "Work" | "Independent";
  icon: string;
  blurb: string;
  points: string[];
  tags: string[];
};

export const projects: Project[] = [
  {
    title: "Biosensor BLE & Wi-Fi Automation Framework",
    subtitle: "LifeSignals · wearable biosensors",
    kind: "Work",
    icon: "radio",
    blurb:
      "The complete BLE and Wi-Fi automation suite for wearable biosensors, covering connectivity, streaming integrity and wireless security.",
    points: [
      "Built the BLE automation layer in Python (bleak, pygatt): device scanning, pairing and bonding, GATT service and characteristic discovery, notification subscription and continuous data-stream capture.",
      "Automated connection-stability scenarios — reconnect after link loss, concurrent multi-device streaming and long-duration soak runs — exposing intermittent firmware defects that manual testing missed.",
      "Developed the Wi-Fi streaming validation path with socket-based capture, packet sequencing and payload integrity checks, including graceful handling of corrupt, duplicate and null packets.",
      "Created wireless security simulations (BLE spoofing, deauthentication, rogue AP) using Scapy and analysed BLE/Wi-Fi traffic in Wireshark to confirm firmware fixes.",
      "Packaged everything as Robot Framework keywords with structured logs and HTML reports, making the suite runnable by the whole QA team and ready for CI execution.",
    ],
    tags: ["Python", "bleak / pygatt", "Scapy", "Robot Framework"],
  },
  {
    title: "CEMS Telemetry Dashboard",
    subtitle: "Gems Setra · Streamlit + MQTT",
    kind: "Work",
    icon: "chart",
    blurb:
      "Web-based IoT telemetry dashboard to configure, simulate, validate and securely publish device telemetry.",
    points: [
      "Built a Streamlit WebUI for configuring and simulating IoT telemetry with global and per-device parameters, add/remove device workflows and readiness checks.",
      "Implemented multi-user authentication with isolated sessions, persistent configuration storage, and export/import with safe reset to prevent misconfiguration and data loss.",
      "Integrated secure MQTT publishing over TLS/PEM with real-time connection and publish status monitoring.",
      "Containerised the application with Docker for consistent, cloud-ready deployment.",
    ],
    tags: ["Streamlit", "MQTT TLS/PEM", "Docker", "Multi-user auth"],
  },
  {
    title: "Sentinel — Autonomous AI SRE Agent",
    subtitle: "Independent · local LLMs on Linux",
    kind: "Independent",
    icon: "brain",
    blurb:
      "Autonomous AI agent for incident response, root cause analysis and auto-healing on Linux infrastructure — inference stays on-premise.",
    points: [
      "Architected an autonomous AI SRE agent using local LLMs (via OmniRoute) to automate incident response, conduct root cause analysis and execute auto-healing runbooks, significantly reducing MTTR.",
      "Engineered a ChatOps interface over Telegram plus a custom React web console for real-time, AI-assisted infrastructure management, log analysis and anomaly detection.",
      "Implemented a deterministic sudo command guard that blocks destructive actions while still allowing AI-driven remediation, enabling hands-off operation with zero manual intervention.",
      "Kept inference fully on-premise with locally hosted models, so system logs and infrastructure telemetry never leave the host — no per-token cost and no external data exposure.",
    ],
    tags: ["Local LLMs", "ChatOps", "React", "Anomaly detection"],
  },
  {
    title: "AI-Powered Expense Tracker",
    subtitle: "Independent · PostgreSQL, Vercel AI SDK, Gemini",
    kind: "Independent",
    icon: "database",
    blurb:
      "Zero-touch personal finance pipeline that turns bank alert emails into categorised, queryable transactions.",
    points: [
      "Engineered an automated data pipeline that monitors Gmail for bank alerts and categorises transactions automatically, eliminating manual data entry.",
      "Integrated the Gemini LLM through the Vercel AI SDK to parse unstructured email text, with strict Zod schema validation guaranteeing database-safe, consistently formatted output.",
      "Built a high-performance dashboard on Next.js 16 (App Router) and Tailwind CSS over PostgreSQL managed with Prisma, with category-wise and month-on-month spend views.",
      "Deployed on Vercel with idempotent ingestion, so re-processed emails never create duplicate transactions.",
    ],
    tags: ["Next.js 16", "Vercel AI SDK", "Prisma", "Zod"],
  },
];

export type SkillGroup = {
  title: string;
  icon: string;
  accent: string;
  body: string;
  stack: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages & Frameworks",
    icon: "fa-brands fa-python",
    accent: "from-sky-400/25 to-sky-500/5",
    body: "The foundation of every harness I own.",
    stack: ["Python", "Robot Framework", "PyTest", "Selenium", "Squish BDD", "Shell", "YAML"],
  },
  {
    title: "Instrument & Embedded Automation",
    icon: "lucide:cpu",
    accent: "from-cyan-400/25 to-cyan-500/5",
    body: "Driving real hardware over real wires, then reading it back.",
    stack: [
      "SCPI (LAN / RS-232 / USB)",
      "Druck PACE6000 / PACE6000E",
      "Firmware validation",
      "Sensor & DAQ verification",
      "Toradex Linux",
    ],
  },
  {
    title: "Wireless & Protocols",
    icon: "lucide:radio",
    accent: "from-indigo-400/25 to-indigo-500/5",
    body: "Protocol-level validation down to the packet.",
    stack: [
      "BLE (GATT, bleak, pygatt)",
      "Wi-Fi 802.11",
      "TCP/IP & sockets",
      "MQTT (TLS/PEM)",
      "Switching",
      "VLAN & firewall policy",
    ],
  },
  {
    title: "Web, Desktop & API",
    icon: "lucide:monitor",
    accent: "from-teal-400/25 to-teal-500/5",
    body: "When a device answers to a screen or an endpoint, that layer gets tested too.",
    stack: [
      "Selenium WebUI automation",
      "Squish BDD (QT desktop)",
      "REST & API validation",
      "Cross-layer end-to-end flows",
      "Multi-user session testing",
    ],
  },
  {
    title: "AI & GenAI",
    icon: "lucide:sparkles",
    accent: "from-fuchsia-400/25 to-fuchsia-500/5",
    body: "LLMs pointed at the parts of testing that don't scale by hand.",
    stack: [
      "Local LLM agents",
      "Gemini API",
      "Azure AI Foundry",
      "Vercel AI SDK",
      "AI test-case generation",
      "Anomaly detection",
      "Automated RCA",
    ],
  },
  {
    title: "Network & Security Testing",
    icon: "lucide:shield",
    accent: "from-rose-400/25 to-rose-500/5",
    body: "Probing the attack surface the spec forgot about.",
    stack: [
      "Wireshark",
      "Scapy",
      "Deauth & MITM simulation",
      "Rogue AP",
      "BLE spoofing",
      "OT / ICS threat validation",
    ],
  },
  {
    title: "Platforms & DevOps",
    icon: "fa-brands fa-docker",
    accent: "from-violet-400/25 to-violet-500/5",
    body: "Pipelines that keep the suites honest and nightly.",
    stack: [
      "Linux (Ubuntu, Kali)",
      "NVIDIA edge compute",
      "OpenWrt",
      "Docker",
      "Jenkins",
      "Git & Bitbucket",
      "AWS",
      "GCP",
    ],
  },
  {
    title: "Data & Applications",
    icon: "lucide:database",
    accent: "from-amber-400/25 to-amber-500/5",
    body: "Storage, analysis and dashboards around the test rigs.",
    stack: ["PostgreSQL", "MySQL", "Prisma", "Pandas", "Matplotlib", "Streamlit"],
  },
  {
    title: "Test Design & Delivery",
    icon: "lucide:clipboard",
    accent: "from-emerald-400/25 to-emerald-500/5",
    body: "Turning a risk list into suites the whole team can run and trust.",
    stack: [
      "Risk-based test design",
      "Test case authoring",
      "TestRail",
      "JIRA",
      "Defect triage & RCA",
      "Regression sign-off",
      "Traceability & reporting",
    ],
  },
];

export const beyondTheBench = [
  {
    title: "Languages",
    icon: "terminal",
    items: ["Hindi — read, write, speak", "English — read, write, speak", "Urdu — read, write, speak", "Arabic — read"],
  },
  {
    title: "Off the clock",
    icon: "sparkles",
    items: ["Cricket", "Badminton", "PC gaming", "Cooking"],
  },
] as const;
