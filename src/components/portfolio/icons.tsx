import type { ReactNode } from "react";
import {
  Award,
  Brain,
  Briefcase,
  Clock,
  Code2,
  Cpu,
  Database,
  GraduationCap,
  Network,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  TerminalSquare,
} from "lucide-react";

/** Icon renderer used by stats / highlights / timeline entries. */
export function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const map: Record<string, ReactNode> = {
    clock: <Clock className={className} />,
    code: <Code2 className={className} />,
    sparkles: <Sparkles className={className} />,
    radio: <Radio className={className} />,
    brain: <Brain className={className} />,
    cpu: <Cpu className={className} />,
    briefcase: <Briefcase className={className} />,
    graduation: <Award className={className} />,
    server: <Server className={className} />,
    cap: <GraduationCap className={className} />,
    network: <Network className={className} />,
    terminal: <TerminalSquare className={className} />,
    database: <Database className={className} />,
    shield: <ShieldCheck className={className} />,
    "square-terminal": <SquareTerminal className={className} />,
  };
  return <>{map[name] ?? <Sparkles className={className} />}</>;
}

/** Skill tile icon: supports Font Awesome brand classes and `lucide:<name>` keys. */
export function SkillIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon.startsWith("fa-")) {
    return <i className={`${icon} ${className ?? ""}`} aria-hidden />;
  }
  const name = icon.replace("lucide:", "");
  return <FeatureIcon name={name} className={className} />;
}
