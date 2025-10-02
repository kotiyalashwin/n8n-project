import React from "react";
import {
  Zap,
  Shield,
  Workflow,
  Code2,
  Database,
  Globe,
  MessageSquare,
  Mail,
  Bot,
} from "lucide-react";
import { NewWorkFlow } from "@/components/NewFlowButton";
import * as motion from "motion/react-client";

// Reusable integrations data
const integrations = [
  {
    name: "Telegram",
    desc: "Send messages via Bot API",
    status: "Active",
    icon: MessageSquare,
  },
  {
    name: "Gmail",
    desc: "Send emails with Resend",
    status: "Active",
    icon: Mail,
  },
  {
    name: "WhatsApp",
    desc: "Messages via API",
    status: "Coming Soon",
    icon: MessageSquare,
  },
  {
    name: "AI Agents",
    desc: "OpenAI, Gemini, Claude",
    status: "Active",
    icon: Bot,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="sticky top-0 bg-background/90 backdrop-blur-md border-b border-border/50 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center transition-transform hover:rotate-3">
              <span className="text-primary-foreground font-bold text-xl tracking-tight">
                x8x
              </span>
            </div>
            <span className="text-lg font-semibold text-foreground hidden sm:block">
              x8x Workflow
            </span>
          </div>
          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#integrations"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors duration-300"
            >
              Integrations
            </a>
            <NewWorkFlow className="relative bg-primary text-primary-foreground px-4 sm:px-6 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-all duration-300 group">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </NewWorkFlow>
          </div>
        </div>
      </nav>
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ skewY: 6 }}
          animate={{ skewY: -6 }}
          transition={{ duration: 0.75 }}
          className="absolute inset-0 bg-gradient-to-b lg:graient-to-br from-primary/20 to-background -skew-y-6 z-0"
        ></motion.div>
        <div className="relative container mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-left">
            <div className="inline-flex items-center gap-2 bg-card/70 border border-border px-4 py-1.5 rounded-full mb-6 transition-transform hover:translate-x-2">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-orange-400">
                Open-Source Automation
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Craft Workflows <br />
              with <span className="text-primary">Ease</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-md mb-8 leading-relaxed">
              Click and connect your apps to automate tasks effortlessly. No
              code, just creativity.
            </p>
            <div className="flex gap-4">
              <NewWorkFlow>Start Now</NewWorkFlow>
              <a
                href="https://github.com/kotiyalashwin/n8n-project"
                target="_blank"
                className="bg-card border border-border text-foreground px-6 py-3 rounded-md font-medium text-base hover:bg-muted/70 transition-all duration-300"
              >
                GitHub
              </a>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="bg-card/50 border border-border rounded-xl p-8 max-w-sm lg:max-w-md mx-auto lg:ml-auto shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <p className="text-muted-foreground italic">
                “x8x is built after many iterations and is still being improved”
                —{" "}
                <a
                  href="https://woksh.com"
                  target="_blank"
                  className="text-orange-400"
                >
                  Ashwin
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="features"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="relative container mx-auto">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Your Automation Toolkit
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to streamline your work, no fluff.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                icon: Workflow,
                title: "Click and Add",
                desc: "Build workflows visually with React Flow’s intuitive canvas.",
                borderColor: "border-l-orange-400",
                width: "max-w-2xl",
              },
              {
                icon: Globe,
                title: "Global",
                desc: "Connect tools like Telegram and Gmail in a snap.",
                borderColor: "border-l-white",
                width: "max-w-xl",
              },
              {
                icon: Shield,
                title: "Secure Core",
                desc: "Your credentials stay safe with top-tier encryption.",
                borderColor: "border-l-orange-400",
                width: "max-w-3xl",
              },
              {
                icon: Zap,
                title: "Instant Action",
                desc: "Run workflows and see results instantly.",
                borderColor: "border-l-white",
                width: "max-w-lg",
              },
              {
                icon: Code2,
                title: "Modern Stack",
                desc: "Built with Next.js 15, React 19, and TypeScript.",
                borderColor: "border-l-orange-400",
                width: "max-w-2xl",
              },
              {
                icon: Database,
                title: "Scalable Data",
                desc: "Reliable storage with PostgreSQL and Prisma.",
                borderColor: "border-l-white",
                width: "max-w-xl",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`bg-card border ${feature.borderColor} border-l-4 rounded-md p-6 ${feature.width} opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] transition-all duration-300 hover:shadow-md hover:bg-card/80`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="integrations"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="container mx-auto">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Connect What Matters
            </h2>
            <p className="text-lg text-muted-foreground">
              Link your apps in seconds for seamless automation.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            {integrations.map((integration, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-md p-6 w-full sm:w-80 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] transition-all duration-300 hover:shadow-md hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                    <integration.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">
                        {integration.name}
                      </h4>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          integration.status === "Active"
                            ? "bg-primary/10 text-orange-400"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {integration.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {integration.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 lg:bg-gradient-to-br bg-gradient-to-t from-primary/10 to-background lg:-skew-y-3 z-0"></div>
        <div className="relative container mx-auto text-center">
          <div className="max-w-2xl mx-auto bg-card/70 border border-border rounded-xl p-8 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-500">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
              Ready to Automate?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Jump into x8x and start crafting workflows that save you time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NewWorkFlow className="relative bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-md font-medium text-base hover:bg-primary/90 transition-all duration-300 group flex items-center gap-2">
                <span className="relative z-10">Get Started Free</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </NewWorkFlow>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center transition-transform hover:rotate-3">
              <span className="text-primary-foreground font-bold text-lg">
                x8x
              </span>
            </div>
            <span className="font-semibold text-foreground">x8x Workflow</span>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <a
              href="https://github.com/kotiyalashwin/n8n-project"
              target="_blank"
              className="text-muted-foreground  hover:text-orange-400 text-sm font-medium transition-colors duration-300 underline "
            >
              GitHub
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Developed by{" "}
            <a
              href="https://woksh.com"
              target="_blank"
              className="text-orange-400"
            >
              Ashwin
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
