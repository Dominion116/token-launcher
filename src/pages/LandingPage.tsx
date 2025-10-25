import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Shield, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/header';
import { WalletService, type WalletState } from '@/lib/walletService';
import { useToast } from '@/hooks/use-toast';

interface LandingPageProps {
    walletService: WalletService | null;
    walletState: WalletState;
    onConnectWallet: () => void;
    onDisconnectWallet: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
    walletService,
    walletState,
    onConnectWallet,
    onDisconnectWallet,
    darkMode,
    toggleDarkMode
}) => {
    const { toast } = useToast();
    const featuresRef = useRef<HTMLDivElement>(null);
    const howItWorksRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    const features = [
        {
            icon: <Zap className="h-8 w-8" />,
            title: "No Coding Required",
            description: "Launch your token without writing a single line of code"
        },
        {
            icon: <Rocket className="h-8 w-8" />,
            title: "Instant Deployment",
            description: "Deploy your token in minutes with our streamlined process"
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Secure & Audited",
            description: "Built on battle-tested smart contracts with security first"
        }
    ];

    const steps = [
        {
            number: "1",
            title: "Connect Your Wallet",
            description: "Connect your Web3 wallet to get started"
        },
        {
            number: "2",
            title: "Configure Your Token",
            description: "Set your token name, symbol, supply, and other parameters"
        },
        {
            number: "3",
            title: "Deploy & Launch",
            description: "Deploy your token with one click and start building your community"
        }
    ];

    const stats = [
        { value: "10,000+", label: "Tokens Launched" },
        { value: "$50M+", label: "Total Value" },
        { value: "25,000+", label: "Active Users" },
        { value: "5+", label: "Supported Networks" }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.observe-me');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Header
                walletService={walletService}
                walletState={walletState}
                onConnectWallet={onConnectWallet}
                onDisconnectWallet={onDisconnectWallet}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden h-screen flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
                <div className="container relative mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                            Launch Your Token in <span className="text-primary">Minutes</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            The easiest way to create and deploy your own token on Celo. No coding required, just pure innovation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Button asChild size="lg" className="text-lg px-8 py-6">
                                <Link to="/launch">
                                    Launch Your Token
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 observe-me">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TokenLaunch?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to bring your token vision to life, all in one platform
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 observe-me" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* How It Works Section */}
            <section id="how-it-works" ref={howItWorksRef} className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 observe-me">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Simple three-step process to launch your token
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 relative observe-me">
                        <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-border hidden md:block" />
                        {steps.map((step, index) => (
                            <div key={index} className="text-center relative" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="w-12 h-12 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold relative z-10">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section id="stats" ref={statsRef} className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 observe-me">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center observe-me">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Launch Your Token?</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of creators who have successfully launched their tokens with our platform
                    </p>
                    <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                        <Link to="/launch" className="flex items-center gap-2">
                            Get Started Now <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
            {/* Footer */}
            <footer className="py-12 border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-xs">T</span>
                                </div>
                                <span className="font-bold">TokenLaunch</span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                © 2024 TokenLaunch. All rights reserved.
                            </p>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Docs</a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
