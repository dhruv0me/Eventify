import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, MapPin, Clock, Trophy, LogOut, ArrowLeft, Loader2, User } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Registration {
    registration_id: number;
    event: {
        id: number;
        title: string;
        category: string;
        date: string;
        time: string;
        location: string;
    };
    team_name: string;
    team_code: string;
    score: number;
    registered_at: string;
}

const Dashboard = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/auth");
            return;
        }
        setUser(JSON.parse(storedUser));

        const fetchRegistrations = async () => {
            try {
                const response = await api.get("/user/registrations");
                setRegistrations(response.data.registrations);
            } catch (error) {
                console.error("Failed to fetch registrations:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load registrations",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [navigate, toast]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        toast({
            title: "Logged out",
            description: "Come back soon!",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                            <Link to="/events">
                                <Button variant="ghost">Events</Button>
                            </Link>
                            <Button variant="hero" size="sm" onClick={handleLogout} className="gap-2">
                                <LogOut className="w-4 h-4" /> Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Header */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-card/50 backdrop-blur border border-border/50 p-8 rounded-2xl">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/20">
                            <User className="w-12 h-12 text-primary-foreground" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-bold">{user?.name}</h1>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <Badge variant="outline" className="capitalize">{user?.role}</Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registrations Section */}
            <section className="container mx-auto px-4 pb-20">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-primary" /> My Registrations
                        </h2>
                    </div>

                    {registrations.length === 0 ? (
                        <Card className="p-12 text-center space-y-6 bg-card/30 border-dashed">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <Calendar className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">No registrations yet</h3>
                                <p className="text-muted-foreground">Go to events and find something exciting to join!</p>
                            </div>
                            <Link to="/events">
                                <Button variant="hero">Browse Events</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {registrations.map((reg) => (
                                <Card key={reg.registration_id} className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group overflow-hidden relative">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                        <div className="space-y-4 flex-grow">
                                            <div>
                                                <Badge className="mb-2">{reg.event.category}</Badge>
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{reg.event.title}</h3>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{reg.event.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{reg.event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{reg.event.location}</span>
                                                </div>
                                            </div>

                                            {reg.team_name && (
                                                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Team</p>
                                                        <p className="font-bold text-primary">{reg.team_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Invite Code</p>
                                                        <p className="font-mono font-bold bg-primary/10 px-2 py-0.5 rounded">{reg.team_code}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center md:text-right space-y-2 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Live Score</p>
                                            <div className="flex items-center justify-center md:justify-end gap-2">
                                                <Trophy className="w-6 h-6 text-yellow-500" />
                                                <span className="text-4xl font-bold text-primary">{reg.score}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background Decoration */}
                                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
