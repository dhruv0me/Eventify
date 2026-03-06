import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Users, MapPin, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  teamSize: string;
  status: string;
  prizePool: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [registering, setRegistering] = useState<number | null>(null);
  const [teamName, setTeamName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please log in to register for events.",
      });
      return;
    }

    try {
      await api.post("/events/register", {
        event_id: eventId,
        team_name: teamName || null,
      });
      toast({
        title: "Registration successful!",
        description: "Check your dashboard for details.",
      });
      setRegistering(null);
      setTeamName("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

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
                  Home
                </Button>
              </Link>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="hero">My Dashboard</Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="hero">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-block">
            <div className="bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-sm font-medium text-accent mb-4">
              🎉 Upcoming Events Dashboard
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Discover & Register
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore a wide range of technical, cultural, and gaming events happening this season.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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

                    {registering === event.id ? (
                      <div className="flex flex-col gap-2 w-full mt-4">
                        <Input
                          placeholder="Team Name (Optional)"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="text-xs h-8"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 text-xs h-8" onClick={() => handleRegister(event.id)}>Confirm</Button>
                          <Button size="sm" variant="ghost" className="text-xs h-8" onClick={() => { setRegistering(null); setTeamName(""); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => {
                          if (!user) {
                            window.location.href = '#/auth';
                            return;
                          }
                          if (event.category === "Concert") {
                            handleRegister(event.id);
                          } else {
                            setRegistering(event.id);
                          }
                        }}
                      >
                        {event.category === "Concert" ? "Get Pass" : "Register Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;
