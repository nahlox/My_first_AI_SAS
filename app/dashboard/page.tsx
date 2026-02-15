'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, History, LogOut, Coins, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Credits, Research } from '@/lib/types/database';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [recentResearch, setRecentResearch] = useState<Research[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        await fetchCredits(session.user.id);
        await fetchRecentResearch(session.user.id);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setCredits(data);
    }
  };

  const fetchRecentResearch = async (userId: string) => {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentResearch(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-12 w-12 text-blue-400 animate-pulse" />
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
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

            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2">
                <Coins className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">
                  {credits?.balance || 0} credits
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-blue-400/30">
                      <AvatarFallback className="bg-blue-900/50 text-blue-300">
                        {user?.email?.[0].toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-900 border-blue-900/30" align="end">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-slate-300 focus:bg-blue-900/20 focus:text-white cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Manage your prospect research and outreach</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-lg border-blue-400/50">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Research
              </CardTitle>
              <CardDescription className="text-blue-200">
                Generate AI-powered prospect research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/research">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50">
                  Start Research
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <History className="h-5 w-5" />
                Research History
              </CardTitle>
              <CardDescription className="text-slate-400">
                View all your past research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/history">
                <Button
                  variant="outline"
                  className="w-full border-blue-400/30 text-slate-300 hover:bg-blue-900/20 hover:text-white"
                >
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Research</h2>

          {recentResearch.length === 0 ? (
            <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30">
              <CardContent className="py-12 text-center">
                <div className="text-slate-400 mb-4">
                  No research yet. Start by creating your first research!
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
              {recentResearch.map((research) => (
                <Link key={research.id} href={`/history/${research.id}`}>
                  <Card className="bg-slate-900/50 backdrop-blur-lg border-blue-900/30 hover:border-blue-700/50 transition-all cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {research.prospect_name}
                          </h3>
                          <p className="text-slate-400 text-sm mb-2">
                            {research.prospect_title} at {research.prospect_company}
                          </p>
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Clock className="h-3 w-3" />
                            {formatDate(research.created_at)}
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
    </div>
  );
}
