import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Trophy, Users, Zap, ChevronRight, Sparkles } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Team Management",
      description: "Create and join teams with unique invite codes. No more manual coordination.",
    },
    {
      icon: Trophy,
      title: "Live Leaderboards",
      description: "Real-time score updates and rankings that sync instantly across all devices.",
    },
    {
      icon: Calendar,
      title: "Event Scheduling",
      description: "Complete event timelines, rounds, and location tracking in one place.",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Push alerts and announcements delivered the moment they're posted.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Eventify
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/events">
                <Button variant="ghost">Events</Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <div className="bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6">
              🎯 Smart Event Management for College Fests
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            One Platform.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Every Event.
            </span>{" "}
            Total Control.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Centralized event registration, team management, and live leaderboards — all in one portal. 
            Built for hackathons, cultural fests, and college events.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="group">
                Start Managing Events
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg">
                Browse Events
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Real-time sync</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>Role-based access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-glow rounded-full animate-pulse" />
              <span>Cross-platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Run Successful Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reduce coordination time by 80% and eliminate manual errors with our automated platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all hover:shadow-glow group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-border/50 p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-muted-foreground">Real-time Sync</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                80%
              </div>
              <div className="text-muted-foreground">Time Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent mb-2">
                Zero
              </div>
              <div className="text-muted-foreground">Manual Errors</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join colleges and organizations using Eventify to run seamless fests and hackathons.
          </p>
          <Link to="/auth">
            <Button variant="hero" size="lg" className="group">
              Get Started Free
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-glow rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Eventify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Eventify. Built with ❤️ for college fests.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
