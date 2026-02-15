import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Target, Mail, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-blue-900/20 backdrop-blur-lg bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                ProspectIQ
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-blue-900/20">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center space-x-2 bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-8">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">AI-Powered Cold Email Research</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Turn Cold Prospects Into
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Warm Conversations
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              ProspectIQ uses advanced AI to research your prospects and generate
              hyper-personalized cold emails that actually get responses.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400/30 text-slate-300 hover:bg-blue-900/20 hover:text-white px-8 py-6 text-lg"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>10 free credits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why ProspectIQ?
            </h2>
            <p className="text-xl text-slate-400">
              Stop wasting time on generic templates. Let AI do the research.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30 hover:border-blue-700/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Deep Research</CardTitle>
                <CardDescription className="text-slate-400">
                  AI analyzes prospects to uncover pain points, goals, and personalization angles
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30 hover:border-blue-700/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Personalized Emails</CardTitle>
                <CardDescription className="text-slate-400">
                  Generate compelling cold emails tailored to each prospect automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30 hover:border-blue-700/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Lightning Fast</CardTitle>
                <CardDescription className="text-slate-400">
                  Get research and emails in seconds, not hours. Scale your outreach effortlessly
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400">
              Choose the plan that fits your outreach needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30 hover:border-blue-700/50 transition-all">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Free</CardTitle>
                <CardDescription className="text-slate-400">
                  Perfect for trying out ProspectIQ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-white">$0</div>
                  <div className="text-slate-400">forever</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">10 research credits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">AI-powered insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Email generation</span>
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-blue-400/30 text-slate-300 hover:bg-blue-900/20 hover:text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-lg border-blue-400/50 hover:border-blue-400/70 transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-white text-2xl">Pro</CardTitle>
                <CardDescription className="text-blue-200">
                  For serious outreach professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-white">$97</div>
                  <div className="text-blue-200">per month</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-white">200 research credits/mo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-white">Priority AI processing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-white">Advanced insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-white">Export history</span>
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50"
                  >
                    Upgrade to Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-900/20 backdrop-blur-lg bg-slate-950/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              ProspectIQ
            </span>
          </div>
          <p className="text-slate-400">
            AI-powered cold email research for modern sales teams
          </p>
          <p className="text-slate-500 text-sm mt-4">
            &copy; 2024 ProspectIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
