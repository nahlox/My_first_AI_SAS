'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Loader2, Copy, Check, Coins } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { AIOutput } from '@/lib/types/database';

export default function ResearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    title: '',
    linkedin_url: '',
  });

  const [result, setResult] = useState<AIOutput | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      router.push('/login');
      return;
    }

    setUser(session.user);
    await fetchCredits(session.user.id);
  };

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (data) {
      setCredits(data.balance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'An error occurred');
        return;
      }

      setResult(data.data);
      setCredits(data.credits_remaining);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating research');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    if (result?.cold_email) {
      await navigator.clipboard.writeText(result.cold_email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <nav className="border-b border-blue-900/20 backdrop-blur-lg bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                ProspectIQ
              </span>
            </Link>

            <div className="flex items-center gap-2 bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2">
              <Coins className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">
                {credits} credits
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-blue-900/20 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">New Research</h1>
          <p className="text-slate-400">Generate AI-powered prospect research and personalized emails</p>
        </div>

        {!result ? (
          <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Prospect Information</CardTitle>
              <CardDescription className="text-slate-400">
                Enter the prospect details to generate personalized research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Prospect Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-950/50 border-blue-900/30 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-300">Company *</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    className="bg-slate-950/50 border-blue-900/30 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Job Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="VP of Sales"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-slate-950/50 border-blue-900/30 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="text-slate-300">
                    LinkedIn URL (Optional)
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    placeholder="https://linkedin.com/in/johndoe"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="bg-slate-950/50 border-blue-900/30 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || credits < 1}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Research...
                    </>
                  ) : (
                    <>Generate Research (1 Credit)</>
                  )}
                </Button>

                {credits < 1 && (
                  <p className="text-sm text-red-400 text-center">
                    Insufficient credits. Please upgrade your plan.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
              <CardHeader>
                <CardTitle className="text-white text-xl">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.insights.map((insight, index) => (
                    <li key={index} className="text-slate-300 flex gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
              <CardHeader>
                <CardTitle className="text-white text-xl">Pain Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.pain_points.map((point, index) => (
                    <li key={index} className="text-slate-300 flex gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
              <CardHeader>
                <CardTitle className="text-white text-xl">Personalization Angles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.personalization_angles.map((angle, index) => (
                    <li key={index} className="text-slate-300 flex gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{angle}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-lg border-blue-400/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">Personalized Cold Email</CardTitle>
                  <Button
                    onClick={copyEmail}
                    size="sm"
                    variant="outline"
                    className="border-blue-400/30 text-blue-300 hover:bg-blue-900/20"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Email
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-950/50 rounded-lg p-4 text-slate-200 whitespace-pre-wrap font-mono text-sm">
                  {result.cold_email}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setResult(null);
                  setFormData({ name: '', company: '', title: '', linkedin_url: '' });
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                New Research
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-blue-400/30 text-slate-300 hover:bg-blue-900/20"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
