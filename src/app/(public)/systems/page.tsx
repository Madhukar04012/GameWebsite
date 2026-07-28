"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swords, Shield, Zap, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SkillTree } from "@/components/ui/SkillTree";
import { GearBrowser } from "@/components/ui/GearBrowser";

type Tab = "skills" | "gear";

export default function SystemsPage() {
  const [tab, setTab] = useState<Tab>("skills");

  return (
    <div className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-heading text-primary mb-4">
            Game Systems
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-subheading">
            Plan your build. Browse legendary equipment. Shape your legend.
          </p>
        </AnimatedSection>

        {/* Tab bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-card border border-border rounded-lg overflow-hidden">
            {[
              { id: "skills" as Tab, label: "Skill Tree", icon: Zap },
              { id: "gear" as Tab, label: "Equipment", icon: Shield },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider font-body transition-colors ${
                    isActive
                      ? "bg-primary text-background"
                      : "text-text-secondary hover:text-primary hover:bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <AnimatedSection key={tab} variant="fade-up">
          {tab === "skills" && (
            <div className="max-w-3xl mx-auto">
              <SkillTree />
            </div>
          )}
          {tab === "gear" && (
            <div className="max-w-4xl mx-auto">
              <GearBrowser />
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
