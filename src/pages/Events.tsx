import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Users, MapPin, Clock, ArrowLeft } from "lucide-react";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "CodeSprint 2025",
      category: "Technical",
      description: "36-hour coding marathon to build innovative solutions",
      date: "March 15-17, 2025",
      location: "Tech Auditorium",
      participants: 150,
      teamSize: "3-4 members",
      status: "Open",
    },
    {
      id: 2,
      title: "Battle of Bands",
      category: "Cultural",
      description: "Showcase your musical talent on the big stage",
      date: "March 20, 2025",
      location: "Main Stage",
      participants: 45,
      teamSize: "4-6 members",
      status: "Open",
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      category: "Business",
      description: "Present your startup idea to industry experts",
      date: "March 25, 2025",
      location: "Innovation Hub",
      participants: 80,
      teamSize: "2-3 members",
      status: "Open",
    },
    {
      id: 4,
      title: "Dance Face-Off",
      category: "Cultural",
      description: "Compete in the ultimate dance showdown",
      date: "March 18, 2025",
      location: "Central Arena",
      participants: 120,
      teamSize: "5-8 members",
      status: "Filling Fast",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "bg-primary/20 text-primary border-primary/30";
      case "Cultural":
        return "bg-accent/20 text-accent border-accent/30";
      case "Business":
        return "bg-primary-glow/20 text-primary-glow border-primary-glow/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Filling Fast":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Eventify
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Upcoming Events
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse and register for exciting college fest events
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all hover:shadow-glow group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  <Badge variant="outline" className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.participants} participants • {event.teamSize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Badge variant="outline" className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                  <Link to="/auth">
                    <Button variant="hero" size="sm">
                      Register Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Events;
