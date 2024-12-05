import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 ">
    <div className="text-center space-y-6 max-w-3xl">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
        Transform Your YouTube
        <br /> Content Strategy
      </h1>

      <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
        Generate fresh, engaging ideas for your YouTube channel in seconds.
        Never run out of content again!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-lg px-8 py-6">
          <Link href="/videos">
            Get Started Free →
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">No credit card required</p>
      </div>

      <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-primary h-5 w-5" />
          <span className="text-muted-foreground">AI-Powered</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="text-primary h-5 w-5" />
          <span className="text-muted-foreground">Instant Results</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="text-primary h-5 w-5" />
          <span className="text-muted-foreground">Free to Try</span>
        </div>
      </div>
    </div>
  </div>
  );
}
