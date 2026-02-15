'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Copy, Check, Coins, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Research } from '@/lib/types/database';

export default function ResearchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [research, setResearch] = useState<Research | null>(null);
  const [credits, setCredits] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.push('/login');
        return;
      }

      await fetchCredits(session.user.id);
      await fetchResearch(session.user.id, params.id as string);
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
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

  const fetchResearch = async (userId: string, researchId: string) => {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .eq('id', researchId)
      .eq('user_id', userId)
      .single();

    if (data) {
      setResearch(data);
    } else {
      router.push('/history');
    }
  };

  const copyEmail = async () => {
    if (research?.ai_output.cold_email) {
      await navigator.clipboard.writeText(research.ai_output.cold_email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!research) {
    return null;
  }

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
          <Link href="/history">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-blue-900/20 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to History
            </Button>
          </Link>

          <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30 mb-6">
            <CardContent className="py-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {research.prospect_name}
              </h1>
              <p className="text-slate-400 text-lg mb-2">
                {research.prospect_title} at {research.prospect_company}
              </p>
              {research.linkedin_url && (
                <a
                  href={research.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {research.linkedin_url}
                </a>
              )}
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-4">
                <Clock className="h-4 w-4" />
                {formatDate(research.created_at)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {research.ai_output.insights.map((insight, index) => (
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
                {research.ai_output.pain_points.map((point, index) => (
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
                {research.ai_output.personalization_angles.map((angle, index) => (
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
                {research.ai_output.cold_email}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
