'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

interface ApplicationWithScore {
  id: string;
  discordUsername: string;
  htbProfile?: string;
  thmProfile?: string;
  hcProfile?: string;
  githubProfile?: string;
  blogProfile?: string;
  motivation: string;
  specialty: string;
  experience: string;
  challenge?: string;
  categoriesToImprove: string[];
  weeklyCommitment: string;
  teamDynamic?: string;
  automatedScore: number;
  skillLevel: string;
  status: ApplicationStatus;
  reviewNotes?: string;
  feedbackMessage?: string;
  reviewedAt?: Date;
  decidedAt?: Date;
  createdAt: Date;
}

function RecruitmentAdminContent() {
  const { t } = useTranslation();
  const [selectedApp, setSelectedApp] = useState<ApplicationWithScore | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('reviewed');
  const [activeTab, setActiveTab] = useState<ApplicationStatus>('pending');

  const { data: applicationsData, isLoading, refetch } = trpc.recruitment.getApplications.useQuery(
    { status: activeTab, limit: 100 },
    { enabled: true }
  );

  const updateMutation = trpc.recruitment.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedApp(null);
      setReviewNotes('');
      setFeedbackMessage('');
      setNewStatus('reviewed');
    },
  });

  const applications = applicationsData?.applications || [];

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'reviewed':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const baseClass = 'px-2 py-1 rounded text-xs font-mono uppercase';
    switch (status) {
      case 'pending':
        return `${baseClass} bg-yellow-500/20 text-yellow-400`;
      case 'reviewed':
        return `${baseClass} bg-blue-500/20 text-blue-400`;
      case 'accepted':
        return `${baseClass} bg-green-500/20 text-green-400`;
      case 'rejected':
        return `${baseClass} bg-red-500/20 text-red-400`;
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedApp) return;

    await updateMutation.mutateAsync({
      id: parseInt(selectedApp.id),
      status: newStatus,
      reviewNotes,
      feedbackMessage: newStatus !== 'reviewed' ? feedbackMessage : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display text-white tracking-widest mb-2">
            {t('recruitment.admin.title')}
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            {t('recruitment.admin.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ApplicationStatus)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">{t('recruitment.admin.pending')}</TabsTrigger>
                <TabsTrigger value="reviewed">{t('recruitment.admin.reviewed')}</TabsTrigger>
                <TabsTrigger value="accepted">{t('recruitment.admin.accepted')}</TabsTrigger>
                <TabsTrigger value="rejected">{t('recruitment.admin.rejected')}</TabsTrigger>
              </TabsList>

              {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {isLoading ? (
                    <Card className="border-border">
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">{t('recruitment.admin.loading')}</p>
                      </CardContent>
                    </Card>
                  ) : applications.length === 0 ? (
                    <Card className="border-border">
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">{t('recruitment.admin.noApplications')}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    applications.map((app: ApplicationWithScore) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`p-4 border border-border rounded-lg cursor-pointer transition-colors ${
                          selectedApp?.id === app.id
                            ? 'bg-accent/10 border-accent'
                            : 'hover:bg-accent/5'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(app.status as ApplicationStatus)}
                              <span className="font-mono font-bold text-white">{app.discordUsername}</span>
                              <span className={getStatusBadge(app.status as ApplicationStatus)}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{app.specialty}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono bg-accent/20 px-2 py-1 rounded">
                                Score: {app.automatedScore}/100
                              </span>
                              <span className="text-xs font-mono bg-blue-500/20 px-2 py-1 rounded text-blue-400">
                                {app.skillLevel}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Review Panel */}
          <div className="lg:col-span-1">
            {selectedApp ? (
              <Card className="border-border sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">{t('recruitment.admin.reviewPanel')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Application Details */}
                  <div className="space-y-3 pb-4 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-mono">{t('recruitment.form.discord')}</p>
                      <p className="text-sm font-mono text-white">{selectedApp.discordUsername}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-mono">{t('recruitment.form.specialty')}</p>
                      <p className="text-sm text-white">{selectedApp.specialty}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-mono">{t('recruitment.form.experience')}</p>
                      <p className="text-sm text-white">{selectedApp.experience}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-mono">{t('recruitment.form.commitment')}</p>
                      <p className="text-sm text-white">{selectedApp.weeklyCommitment}</p>
                    </div>

                    {/* Profile Links */}
                    <div className="pt-2 space-y-2">
                      {selectedApp.htbProfile && (
                        <a
                          href={selectedApp.htbProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          HackTheBox
                        </a>
                      )}
                      {selectedApp.githubProfile && (
                        <a
                          href={selectedApp.githubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Review Controls */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase font-mono block mb-2">
                        {t('recruitment.admin.decision')}
                      </label>
                      <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ApplicationStatus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reviewed">{t('recruitment.admin.reviewed')}</SelectItem>
                          <SelectItem value="accepted">{t('recruitment.admin.accepted')}</SelectItem>
                          <SelectItem value="rejected">{t('recruitment.admin.rejected')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground uppercase font-mono block mb-2">
                        {t('recruitment.admin.notes')}
                      </label>
                      <Textarea
                        placeholder={t('recruitment.admin.notesPlaceholder')}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="h-24 resize-none"
                      />
                    </div>

                    {newStatus !== 'reviewed' && (
                      <div>
                        <label className="text-xs text-muted-foreground uppercase font-mono block mb-2">
                          {t('recruitment.admin.feedback')}
                        </label>
                        <Textarea
                          placeholder={t('recruitment.admin.feedbackPlaceholder')}
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          className="h-24 resize-none"
                        />
                      </div>
                    )}

                    <Button
                      onClick={handleSubmitReview}
                      disabled={updateMutation.isPending}
                      className="w-full"
                    >
                      {updateMutation.isPending ? t('recruitment.admin.submitting') : t('recruitment.admin.submit')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">{t('recruitment.admin.selectApp')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecruitmentAdmin() {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page is only accessible to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RecruitmentAdminContent />;
}
