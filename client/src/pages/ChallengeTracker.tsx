import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2, Trophy, Calendar, MapPin } from 'lucide-react';

type ChallengeStatus = 'upcoming' | 'active' | 'completed';

export default function ChallengeTracker() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ChallengeStatus>('active');

  const { data: challengesData, isLoading } = trpc.challenges.getAll.useQuery(
    { status: activeTab },
    { enabled: true }
  );

  const challenges = challengesData?.challenges || [];

  const getStatusIcon = (status: ChallengeStatus) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'active':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: ChallengeStatus) => {
    const baseClass = 'px-2 py-1 rounded text-xs font-mono uppercase';
    switch (status) {
      case 'upcoming':
        return `${baseClass} bg-yellow-500/20 text-yellow-400`;
      case 'active':
        return `${baseClass} bg-red-500/20 text-red-400`;
      case 'completed':
        return `${baseClass} bg-green-500/20 text-green-400`;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display text-white tracking-widest mb-2">
            CHALLENGE TRACKER
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Monitor active CTF competitions and team performance
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ChallengeStatus)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {['upcoming', 'active', 'completed'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4 mt-6">
              {isLoading ? (
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">Loading challenges...</p>
                  </CardContent>
                </Card>
              ) : challenges.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No {status} challenges</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {challenges.map((challenge: any) => (
                    <Card key={challenge.id} className="border-border hover:border-accent/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(challenge.status)}
                              <h3 className="text-xl font-mono font-bold text-white">{challenge.name}</h3>
                              <span className={getStatusBadge(challenge.status)}>
                                {challenge.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{challenge.platform}</p>
                          </div>
                          {challenge.isPriority === 1 && (
                            <Badge className="bg-accent text-accent-foreground">PRIORITY</Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-mono mb-1">Start</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(challenge.startDate)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-mono mb-1">End</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(challenge.endDate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Scores */}
                        {challenge.teamScore !== null && (
                          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-mono mb-1">Team Score</p>
                              <p className="text-lg font-mono font-bold text-accent">
                                {challenge.teamScore}/{challenge.totalPoints || '?'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-mono mb-1">Flags</p>
                              <p className="text-lg font-mono font-bold">
                                {challenge.flagsCaptured || 0}/{challenge.totalFlags || '?'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-mono mb-1">Rank</p>
                              <p className="text-lg font-mono font-bold">
                                {challenge.teamRank ? `#${challenge.teamRank}` : 'N/A'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {challenge.notes && (
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground uppercase font-mono mb-2">Notes</p>
                            <p className="text-sm text-muted-foreground">{challenge.notes}</p>
                          </div>
                        )}

                        {/* URL */}
                        {challenge.url && (
                          <div className="pt-2">
                            <a
                              href={challenge.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2"
                            >
                              <MapPin className="h-4 w-4" />
                              Visit Challenge
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Admin Note */}
        {isAuthenticated && user?.role === 'admin' && (
          <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Admin: Use the admin panel to create, edit, and manage active CTF challenges.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
