"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { PageTransition } from "@/components/public/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HeroLogo } from "@/components/ui/HeroLogo";
import { withBasePath } from "@/lib/base-path";

/** Add your photo as: public/hero-background.jpg */
const HERO_BACKGROUND = withBasePath("/hero-background.jpg");

const features = [
  {
    icon: FileText,
    title: "Submit Research",
    description:
      "Upload your manuscript through our streamlined submission portal with instant tracking codes.",
    href: "/submit",
    color: "text-paom-red",
  },
  {
    icon: BookOpen,
    title: "Published Archive",
    description:
      "Browse our collection of published management research from scholars across the Philippines.",
    href: "/archive",
    color: "text-paom-blue",
  },
];

export default function LandingPage() {
  return (
    <PageTransition>
      <section className="relative min-h-[88vh] overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BACKGROUND})` }}
        />
        {/* Dark overlay for text contrast (light + dark mode) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-4xl"
          >
            {/* Frosted panel — readable on any background photo */}
            <div className="rounded-3xl border border-white/20 bg-white/95 px-6 py-10 shadow-2xl backdrop-blur-md sm:px-10 sm:py-12 dark:border-white/10 dark:bg-card/95">
              <div className="text-center">
                <div className="mb-10 flex justify-center">
                  <HeroLogo />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-foreground">
                  PAoM Journal Publication{" "}
                  <span className="bg-gradient-to-r from-paom-red to-paom-blue bg-clip-text text-transparent">
                    Management System
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg dark:text-muted">
                  Advancing academic excellence and research publication in management
                  science. Submit your manuscript or explore published scholarship from
                  the Philippine academic community.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Button href="/submit" size="lg">
                    Submit Journal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href="/archive"
                    variant="outline"
                    size="lg"
                    className="border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-border dark:bg-transparent dark:text-foreground"
                  >
                    View Publications
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Publish with PAoM</h2>
            <p className="mt-3 text-muted">
              Submit your research and access our published journal archive
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="h-full">
                  <feature.icon className={`mb-4 h-10 w-10 ${feature.color}`} />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted">{feature.description}</p>
                  <Button
                    href={feature.href}
                    variant="ghost"
                    size="sm"
                    className="mt-4 px-0"
                  >
                    Learn more <ArrowRight className="h-3 w-3" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Card className="overflow-hidden bg-gradient-to-r from-paom-blue to-paom-blue/90 p-8 text-white sm:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to contribute to management scholarship?
            </h2>
            <p className="mt-3 text-blue-100">
              Submit your manuscript to the Philippine Academy of Management Journal
              and receive a tracking code to follow your submission.
            </p>
            <Button href="/submit" variant="gold" size="lg" className="mt-6">
              Start Your Submission
            </Button>
          </div>
        </Card>
      </section>
    </PageTransition>
  );
}
