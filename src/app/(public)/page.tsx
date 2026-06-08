"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { PageTransition } from "@/components/public/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { BRAND } from "@/lib/constants";

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-paom-blue/5 via-transparent to-paom-red/5" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-paom-gold/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-paom-blue/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-8 flex justify-center">
              <Logo showText={false} size="lg" />
            </div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted shadow-sm">
              <span className="h-2 w-2 rounded-full bg-paom-red" />
              {BRAND.name}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              PAoM Journal Publication{" "}
              <span className="bg-gradient-to-r from-paom-red to-paom-blue bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted sm:text-xl">
              Advancing academic excellence and research publication in management
              science. Submit your manuscript or explore published scholarship from
              the Philippine academic community.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/submit" size="lg">
                Submit Journal
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/archive" variant="outline" size="lg">
                View Publications
              </Button>
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
