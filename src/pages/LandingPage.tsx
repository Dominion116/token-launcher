import React, { useEffect, useRef } from 'react';
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
