export const profile = {
  name: "Ifrahuddin Azmi",
  initials: "IA",
  role: "Embedded & Automation Test Engineer",
  roles: [
    "Embedded & Automation Test Engineer",
    "Protocol Validation Specialist",
    "Python Automation Architect",
  ],
  headline: "I break hardware on purpose — so it never breaks in the field.",
  summary:
    "Embedded & automation test engineer specialising in Python automation frameworks, BLE/Wi-Fi protocol validation and cloud-integrated systems. I turn flaky, manual test cycles into instrumentation that runs itself.",
  email: "ifrahazmi@live.com",
  location: "India",
  company: "LifeSignals India Pvt. Ltd.",
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
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const marqueeItems = [
  "Python",
  "PyTest",
  "Robot Framework",
  "Selenium",
  "BLE",
  "Wi-Fi",
  "Wireshark",
  "Scapy",
  "Linux",
  "Docker",
  "Jenkins",
  "Kubernetes",
  "FastAPI",
  "Django",
  "Sockets",
  "TestRail",
] as const;

export const stats = [
  { value: 4, suffix: "+", label: "Years of experience", hint: "Test & validation", icon: "clock" },
  { value: 10, suffix: "+", label: "Python projects", hint: "Automation & tooling", icon: "code" },
  { value: 2, suffix: "+", label: "AI/ML experience", hint: "Applied workflows", icon: "sparkles" },
  { value: 3, suffix: "+", label: "Wireless protocols", hint: "BLE · Wi-Fi · Zigbee", icon: "radio" },
] as const;

export const highlights = [
  {
    icon: "brain",
    title: "AI-accelerated engineering",
    body: "Leveraged AI-driven tooling to automate repetitive tasks, compress test cycles and lift overall engineering throughput.",
    tags: ["LLM workflows", "Test triage", "Automation"],
  },
  {
    icon: "cpu",
    title: "Python meets silicon",
    body: "Built scalable automation frameworks in Python and ran protocol-level validation for embedded systems across Wi-Fi and BLE.",
    tags: ["PyTest", "BLE", "Firmware QA"],
  },
] as const;

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  icon: string;
  current?: boolean;
  tags: string[];
};

export const experiences: Experience[] = [
  {
    role: "Automation Test Engineer",
    company: "LifeSignals India Pvt. Ltd.",
    period: "2022 — Present",
    current: true,
    icon: "briefcase",
    summary:
      "Build and maintain Python automation for biosensor validation, Wi-Fi/BLE protocol testing and Linux file-system verification, with a focus on embedded systems and wireless security. Also contribute wireless packet analysis and test-cycle optimisation using Wireshark and Scapy-driven scripting.",
    tags: ["Python", "BLE / Wi-Fi", "Scapy", "Linux"],
  },
  {
    role: "QA / Calibration Engineer",
    company: "Transcaal Engineer India Pvt. Ltd.",
    period: "2021 — 2022",
    icon: "graduation",
    summary:
      "Performed testing and calibration of medical devices aligned with NABL and NABH accreditation standards, ensuring accuracy, compliance and reliability in clinical environments.",
    tags: ["Medical devices", "NABL / NABH", "Calibration"],
  },
  {
    role: "Cloud & System Engineering Intern",
    company: "Quanterian LLC",
    period: "Part-time · Remote",
    icon: "server",
    summary:
      "Focused on cloud system and instance management, real-time monitoring and deploying scalable solutions using Kubernetes for efficient infrastructure orchestration.",
    tags: ["Kubernetes", "Monitoring", "Cloud ops"],
  },
  {
    role: "B.E. Computer Science",
    company: "Visvesvaraya Technological University",
    period: "Graduated 2021",
    icon: "cap",
    summary:
      "Built a solid foundation in core computing principles with hands-on exposure to programming, systems design and emerging technologies — fuelling a lasting pull toward innovation and problem-solving.",
    tags: ["Core CS", "Systems design"],
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
    title: "Python & Automation",
    icon: "fa-brands fa-python",
    accent: "from-sky-400/25 to-sky-500/5",
    body: "Robust test scripting and automation frameworks.",
    stack: ["Python", "PyTest", "Robot Framework", "Selenium"],
  },
  {
    title: "Wireless Protocols",
    icon: "lucide:radio",
    accent: "from-cyan-400/25 to-cyan-500/5",
    body: "Protocol-level validation and analysis on real hardware.",
    stack: ["BLE", "Wi-Fi", "TCP/IP", "LTE", "Zigbee"],
  },
  {
    title: "Network & Packet Tools",
    icon: "lucide:network",
    accent: "from-indigo-400/25 to-indigo-500/5",
    body: "Deep packet work, from capture to crafted frames.",
    stack: ["Wireshark", "Scapy", "Requests", "Raw sockets"],
  },
  {
    title: "System Administration",
    icon: "lucide:terminal",
    accent: "from-violet-400/25 to-violet-500/5",
    body: "Managing fleets of Linux boxes and embedded targets.",
    stack: ["Ubuntu", "Kali", "OpenWrt", "Cron", "Bash"],
  },
  {
    title: "DevOps & CI/CD",
    icon: "fa-brands fa-docker",
    accent: "from-fuchsia-400/25 to-fuchsia-500/5",
    body: "Shipping pipelines that keep test suites honest.",
    stack: ["Git", "Jenkins", "Docker", "Kubernetes", "TestRail"],
  },
  {
    title: "Web & API Development",
    icon: "lucide:code",
    accent: "from-emerald-400/25 to-emerald-500/5",
    body: "Internal dashboards and services around the test rigs.",
    stack: ["Django", "FastAPI", "Streamlit", "Flask"],
  },
  {
    title: "Databases",
    icon: "lucide:database",
    accent: "from-amber-400/25 to-amber-500/5",
    body: "Storage and analytics for test telemetry.",
    stack: ["MySQL", "NoSQL", "SQLite"],
  },
  {
    title: "Security Testing",
    icon: "lucide:shield",
    accent: "from-rose-400/25 to-rose-500/5",
    body: "Probing wireless and embedded attack surface.",
    stack: ["BLE security", "Wi-Fi hardening", "Embedded"],
  },
  {
    title: "Shell Scripting & CLI",
    icon: "lucide:square-terminal",
    accent: "from-teal-400/25 to-teal-500/5",
    body: "Glue code that ships with the test framework.",
    stack: ["Bash", "Shell", "Task automation"],
  },
];
