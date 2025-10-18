import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Users, MapPin, Clock, ArrowLeft } from "lucide-react";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "GameOn: Arena Wars",
      category: "Gaming",
      description: "24x7 gaming tournament with multiple battle arenas",
      date: "November 7-8, 2025",
      time: "Throughout the day",
      location: "Study Center Arena",
      participants: 200,
      teamSize: "Solo/Team (varies by game)",
      status: "Open",
      prizePool: "₹50,000"
    },
    {
      id: 2,
      title: "Drop That Beat",
      category: "Cultural",
      description: "Solo DJ competition featuring the best beatmakers",
      date: "November 8, 2025",
      time: "11:00 AM - 2:00 PM",
      location: "Main Stage",
      participants: 30,
      teamSize: "Solo",
      status: "Open",
      prizePool: "₹30,000"
    },
    {
      id: 3,
      title: "Parmish Verma Live",
      category: "Concert",
      description: "Popular Indian singer-songwriter live performance",
      date: "November 8, 2025",
      time: "09:00 PM onwards",
      location: "Main Stage",
      participants: 2000,
      teamSize: "No registration needed",
      status: "Open Entry",
      prizePool: "Free Entry"
    },
    {
      id: 4,
      title: "DJ Paroma Night",
      category: "Concert",
      description: "High-energy DJ set to end the fest on a high note",
      date: "November 8, 2025",
      time: "11:00 PM onwards",
      location: "Main Stage",
      participants: 2000,
      teamSize: "No registration needed",
      status: "Open Entry",
      prizePool: "Free Entry"
    },
    {
      id: 5,
      title: "Tech Innovation Challenge",
      category: "Technical",
      description: "Build innovative tech solutions for real-world problems",
      date: "November 7, 2025",
      time: "10:00 AM - 1:00 PM",
      location: "Innovation Lab",
      participants: 100,
      teamSize: "3-4 members",
      status: "Filling Fast",
      prizePool: "₹40,000"
    },
    {
      id: 6,
      title: "Cosplay Competition",
      category: "Cultural",
      description: "Embrace the Halloween Multiverse theme in style",
      date: "November 7, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Central Arena",
      participants: 80,
      teamSize: "Solo/Duo",
      status: "Open",
      prizePool: "₹25,000"
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "bg-primary/20 text-primary border-primary/30";
      case "Cultural":
        return "bg-accent/20 text-accent border-accent/30";
      case "Gaming":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Concert":
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
      case "Open Entry":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
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
          <div className="inline-block">
            <div className="bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-sm font-medium text-accent mb-4">
              🎃 ECHÔNA '25 - Halloween Multiverse Festival
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            November 7-8, 2025
          </h1>
          <p className="text-xl text-muted-foreground">
            Anand International College of Engineering, Jaipur • Cash Prizes Worth ₹2 Lakh
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
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.participants} expected • {event.teamSize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    {event.prizePool !== "Free Entry" && (
                      <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                        🏆 {event.prizePool}
                      </Badge>
                    )}
                  </div>
                  <Link to="/auth">
                    <Button variant="hero" size="sm">
                      {event.category === "Concert" ? "Get Pass" : "Register Now"}
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
