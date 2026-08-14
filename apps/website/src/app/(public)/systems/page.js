"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Shield, Zap } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SkillTree } from "@/components/ui/SkillTree";
import { GearBrowser } from "@/components/ui/GearBrowser";
export default function SystemsPage() {
    const [tab, setTab] = useState("skills");
    return (_jsx("div", { className: "pt-24 pb-24 bg-background min-h-screen", children: _jsxs("div", { className: "container mx-auto px-6", children: [_jsxs(AnimatedSection, { className: "mb-10 text-center max-w-3xl mx-auto", children: [_jsx("h1", { className: "text-5xl md:text-8xl font-heading text-primary mb-4", children: "Game Systems" }), _jsx("p", { className: "text-lg md:text-xl text-text-secondary font-subheading", children: "Plan your build. Browse legendary equipment. Shape your legend." })] }), _jsx("div", { className: "flex justify-center mb-10", children: _jsx("div", { className: "inline-flex bg-card border border-border rounded-lg overflow-hidden", children: [
                            { id: "skills", label: "Skill Tree", icon: Zap },
                            { id: "gear", label: "Equipment", icon: Shield },
                        ].map((t) => {
                            const Icon = t.icon;
                            const isActive = tab === t.id;
                            return (_jsxs("button", { onClick: () => setTab(t.id), className: `flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider font-body transition-colors ${isActive
                                    ? "bg-primary text-background"
                                    : "text-text-secondary hover:text-primary hover:bg-surface"}`, children: [_jsx(Icon, { className: "w-4 h-4" }), t.label] }, t.id));
                        }) }) }), _jsxs(AnimatedSection, { variant: "fade-up", children: [tab === "skills" && (_jsx("div", { className: "max-w-3xl mx-auto", children: _jsx(SkillTree, {}) })), tab === "gear" && (_jsx("div", { className: "max-w-4xl mx-auto", children: _jsx(GearBrowser, {}) }))] }, tab)] }) }));
}
//# sourceMappingURL=page.js.map