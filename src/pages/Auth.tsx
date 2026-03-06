import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const response = await api.post("/auth/login", { email, password });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast({
                    title: "Success",
                    description: "Logged in successfully!",
                });
                navigate("/events");
            } else {
                await api.post("/auth/register", { name, email, password });
                toast({
                    title: "Registration successful",
                    description: "You can now log in with your credentials.",
                });
                setIsLogin(true);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">

            {/* Back button */}
            <div className="absolute top-4 left-4 z-10">
                <Link to="/">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            <Card className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl relative z-10">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {isLogin
                            ? "Sign in to manage your events"
                            : "Join us to participate in events"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                className="bg-background/50 border-input hover:border-primary/50 transition-colors focus:ring-primary/20"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background/50 border-input hover:border-primary/50 transition-colors focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-background/50 border-input hover:border-primary/50 transition-colors focus:ring-primary/20"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full font-semibold mt-6 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setEmail("");
                            setPassword("");
                            setName("");
                        }}
                        className="text-primary hover:text-primary-glow font-medium transition-colors"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Auth;
