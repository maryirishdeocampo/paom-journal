import { Award, BookOpen, Globe, Target } from "lucide-react";
import { PageTransition } from "@/components/public/PageTransition";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { BRAND } from "@/lib/constants";

const highlights = [
  {
    icon: Target,
    title: "Mission",
    description:
      "To advance management scholarship in the Philippines by providing a premier platform for rigorous academic research, peer review, and knowledge dissemination.",
  },
  {
    icon: Globe,
    title: "Vision",
    description:
      "To be the leading journal of management research in Southeast Asia, recognized for academic excellence, integrity, and impact on practice and policy.",
  },
  {
    icon: BookOpen,
    title: "Academic Focus",
    description:
      "Strategic management, organizational behavior, entrepreneurship, finance, marketing, operations, human resources, and governance across Philippine and ASEAN contexts.",
  },
  {
    icon: Award,
    title: "Organization",
    description:
      "Founded by leading management scholars, PAoM brings together researchers from top Philippine universities to foster collaborative, high-impact scholarship.",
  },
];

export const metadata = {
  title: "About PAoM",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <Logo showText={false} size="lg" href="/about" />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{BRAND.name}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            {BRAND.tagline}. The PAoM Journal is the flagship publication of the
            Philippine Academy of Management, dedicated to advancing management
            research and practice across the nation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {highlights.map((item) => (
            <Card key={item.title} hover>
              <item.icon className="mb-4 h-8 w-8 text-paom-blue" />
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-paom-blue/5 to-paom-red/5">
          <h2 className="text-xl font-semibold">Why Publish with PAoM?</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>• Rigorous double-blind peer review process</li>
            <li>• Indexed and discoverable by the global academic community</li>
            <li>• Fast, transparent submission tracking</li>
            <li>• Dedicated support for Philippine management researchers</li>
            <li>• Open access to published articles</li>
          </ul>
        </Card>
      </div>
    </PageTransition>
  );
}
