'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Clock, Coins } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Research } from '@/lib/types/database';

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [research, setResearch] = useState<Research[]>([]);
  const [credits, setCredits] = useState(0);

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
      await fetchAllResearch(session.user.id);
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

  const fetchAllResearch = async (userId: string) => {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setResearch(data);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <h1 className="text-4xl font-bold text-white mb-2">Research History</h1>
          <p className="text-slate-400">View all your past prospect research</p>
        </div>

        {research.length === 0 ? (
          <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
            <CardContent className="py-12 text-center">
              <div className="text-slate-400 mb-4">
                No research history yet. Start by creating your first research!
              </div>
              <Link href="/research">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  Create Research
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {research.map((item) => (
              <Link key={item.id} href={`/history/${item.id}`}>
                <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30 hover:border-blue-700/50 transition-all cursor-pointer">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-xl mb-2">
                          {item.prospect_name}
                        </h3>
                        <p className="text-slate-400 mb-3">
                          {item.prospect_title} at {item.prospect_company}
                        </p>
                        {item.linkedin_url && (
                          <p className="text-slate-500 text-sm mb-3">
                            {item.linkedin_url}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock className="h-4 w-4" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
