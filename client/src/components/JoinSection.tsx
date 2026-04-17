'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CTF_SPECIALTIES = [
  'OSINT',
  'Mobile',
  'Web',
  'GamePwn',
  'Reversing',
  'AI/ML',
  'Crypto',
  'Hardware',
  'Coding',
  'Forensics',
  'Blockchain',
];

const CTF_CATEGORIES = [
  'OSINT',
  'Mobile',
  'Web',
  'GamePwn',
  'Reversing',
  'AI/ML',
  'Crypto',
  'Hardware',
  'Coding',
  'Forensics',
  'Blockchain',
];

const EXPERIENCE_LEVELS = ['<1', '1-2', '2-5', '5+'];
const COMMITMENT_LEVELS = ['<5', '5-10', '10-20', '20+'];

export default function JoinSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    discordUsername: '',
    htbProfile: '',
    thmProfile: '',
    hcProfile: '',
    githubProfile: '',
    blogUrl: '',
    motivation: '',
    mainSpecialty: '',
    yearsOfExperience: '',
    biggestChallenge: '',
    categoriesToImprove: [] as string[],
    weeklyCommitment: '',
    idealTeamDynamic: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const submitMutation = trpc.recruitment.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setSuccessMessage(data.message);
      setFormData({
        discordUsername: '',
        htbProfile: '',
        thmProfile: '',
        hcProfile: '',
        githubProfile: '',
        blogUrl: '',
        motivation: '',
        mainSpecialty: '',
        yearsOfExperience: '',
        biggestChallenge: '',
        categoriesToImprove: [],
        weeklyCommitment: '',
        idealTeamDynamic: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => {
      setErrors({ submit: error.message || 'Failed to submit application' });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.discordUsername.trim()) newErrors.discordUsername = 'Discord username is required';
    if (!formData.htbProfile.trim()) newErrors.htbProfile = 'HackTheBox profile URL is required';
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required';
    if (!formData.mainSpecialty) newErrors.mainSpecialty = 'Please select a specialty';
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Please select experience level';
    if (!formData.biggestChallenge.trim()) newErrors.biggestChallenge = 'Challenge description is required';
    if (formData.categoriesToImprove.length === 0) newErrors.categoriesToImprove = 'Select at least one category';
    if (!formData.weeklyCommitment) newErrors.weeklyCommitment = 'Please select commitment level';
    if (!formData.idealTeamDynamic.trim()) newErrors.idealTeamDynamic = 'Team dynamic description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await submitMutation.mutateAsync({
      discordUsername: formData.discordUsername,
      htbProfile: formData.htbProfile,
      thmProfile: formData.thmProfile || undefined,
      hcProfile: formData.hcProfile || undefined,
      githubProfile: formData.githubProfile || undefined,
      blogUrl: formData.blogUrl || undefined,
      motivation: formData.motivation,
      mainSpecialty: formData.mainSpecialty,
      yearsOfExperience: formData.yearsOfExperience,
      biggestChallenge: formData.biggestChallenge,
      categoriesToImprove: formData.categoriesToImprove.join(','),
      weeklyCommitment: formData.weeklyCommitment,
      idealTeamDynamic: formData.idealTeamDynamic,
    });
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categoriesToImprove: prev.categoriesToImprove.includes(category)
        ? prev.categoriesToImprove.filter((c) => c !== category)
        : [...prev.categoriesToImprove, category],
    }));
  };

  if (submitted) {
    return (
      <section className="min-h-screen bg-background py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-accent/50 bg-accent/5">
            <CardHeader className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white">{t('recruitment.form.success') || 'Application Submitted'}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">{successMessage}</p>
              <p className="text-sm text-muted-foreground">
                We'll review your application and contact you via Discord within 24-48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent/20 rounded-full border border-accent/50 mb-4">
            <p className="text-accent font-mono text-sm uppercase tracking-widest">
              {t('join.label') || 'Recruitment'}
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-display text-white tracking-widest mb-4">
            {t('join.title') || 'Join'} <span className="text-accent">{t('join.subtitle') || 'the Hunt'}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('join.description') || 'Ready to hunt flags with Cazabanderas? Submit your application and tell us why you should join our pack.'}
          </p>
        </div>

        {/* Form */}
        <Card className="border-border bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle>{t('recruitment.form.title') || 'Recruitment Application'}</CardTitle>
            <CardDescription>{t('recruitment.form.description') || 'Complete all fields to apply'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Discord Username */}
              <div>
                <Label htmlFor="discord" className="text-white mb-2 block">
                  {t('recruitment.form.discord') || 'Discord Username'} *
                </Label>
                <Input
                  id="discord"
                  placeholder="e.g. 0xHunter"
                  value={formData.discordUsername}
                  onChange={(e) => setFormData({ ...formData, discordUsername: e.target.value })}
                  className={errors.discordUsername ? 'border-red-500' : ''}
                />
                {errors.discordUsername && <p className="text-red-500 text-sm mt-1">{errors.discordUsername}</p>}
              </div>

              {/* Profile URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="htb" className="text-white mb-2 block">
                    {t('recruitment.form.htb') || 'HackTheBox Profile'} *
                  </Label>
                  <Input
                    id="htb"
                    placeholder="https://app.hackthebox.com/users/..."
                    value={formData.htbProfile}
                    onChange={(e) => setFormData({ ...formData, htbProfile: e.target.value })}
                    className={errors.htbProfile ? 'border-red-500' : ''}
                  />
                  {errors.htbProfile && <p className="text-red-500 text-sm mt-1">{errors.htbProfile}</p>}
                </div>

                <div>
                  <Label htmlFor="thm" className="text-white mb-2 block">
                    {t('recruitment.form.thm') || 'TryHackMe Profile'}
                  </Label>
                  <Input
                    id="thm"
                    placeholder="https://tryhackme.com/p/..."
                    value={formData.thmProfile}
                    onChange={(e) => setFormData({ ...formData, thmProfile: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="hc" className="text-white mb-2 block">
                    {t('recruitment.form.hc') || 'HackingClub Profile'}
                  </Label>
                  <Input
                    id="hc"
                    placeholder="https://hackingclub.com/profile/..."
                    value={formData.hcProfile}
                    onChange={(e) => setFormData({ ...formData, hcProfile: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="github" className="text-white mb-2 block">
                    {t('recruitment.form.github') || 'GitHub Profile'}
                  </Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/..."
                    value={formData.githubProfile}
                    onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="blog" className="text-white mb-2 block">
                  {t('recruitment.form.blog') || 'Blog/Website'}
                </Label>
                <Input
                  id="blog"
                  placeholder="https://yourblog.com"
                  value={formData.blogUrl}
                  onChange={(e) => setFormData({ ...formData, blogUrl: e.target.value })}
                />
              </div>

              {/* Motivation */}
              <div>
                <Label htmlFor="motivation" className="text-white mb-2 block">
                  {t('recruitment.form.motivation') || 'Why do you want to join Cazabanderas?'} *
                </Label>
                <Textarea
                  id="motivation"
                  placeholder="Tell us about your passion for CTF and why you want to join our team..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className={`h-24 ${errors.motivation ? 'border-red-500' : ''}`}
                />
                {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
              </div>

              {/* Specialty & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty" className="text-white mb-2 block">
                    {t('recruitment.form.specialty') || 'Main CTF Specialty'} *
                  </Label>
                  <Select value={formData.mainSpecialty} onValueChange={(value) => setFormData({ ...formData, mainSpecialty: value })}>
                    <SelectTrigger className={errors.mainSpecialty ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your specialty..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CTF_SPECIALTIES.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.mainSpecialty && <p className="text-red-500 text-sm mt-1">{errors.mainSpecialty}</p>}
                </div>

                <div>
                  <Label htmlFor="experience" className="text-white mb-2 block">
                    {t('recruitment.form.experience') || 'Years of Experience'} *
                  </Label>
                  <Select value={formData.yearsOfExperience} onValueChange={(value) => setFormData({ ...formData, yearsOfExperience: value })}>
                    <SelectTrigger className={errors.yearsOfExperience ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select experience level..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level} years
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
                </div>
              </div>

              {/* Biggest Challenge */}
              <div>
                <Label htmlFor="challenge" className="text-white mb-2 block">
                  {t('recruitment.form.challenge') || "What's your biggest CTF challenge/failure and what did you learn?"} *
                </Label>
                <Textarea
                  id="challenge"
                  placeholder="Share a challenge you faced and how you overcame it..."
                  value={formData.biggestChallenge}
                  onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                  className={`h-24 ${errors.biggestChallenge ? 'border-red-500' : ''}`}
                />
                {errors.biggestChallenge && <p className="text-red-500 text-sm mt-1">{errors.biggestChallenge}</p>}
              </div>

              {/* Categories to Improve */}
              <div>
                <Label className="text-white mb-4 block">
                  {t('recruitment.form.categories') || 'What CTF categories do you want to improve in?'} *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CTF_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={formData.categoriesToImprove.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`cat-${category}`} className="cursor-pointer text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.categoriesToImprove && <p className="text-red-500 text-sm mt-2">{errors.categoriesToImprove}</p>}
              </div>

              {/* Weekly Commitment */}
              <div>
                <Label htmlFor="commitment" className="text-white mb-2 block">
                  {t('recruitment.form.commitment') || 'How many hours per week can you commit?'} *
                </Label>
                <Select value={formData.weeklyCommitment} onValueChange={(value) => setFormData({ ...formData, weeklyCommitment: value })}>
                  <SelectTrigger className={errors.weeklyCommitment ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select commitment level..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMITMENT_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level} hours/week
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.weeklyCommitment && <p className="text-red-500 text-sm mt-1">{errors.weeklyCommitment}</p>}
              </div>

              {/* Team Dynamic */}
              <div>
                <Label htmlFor="dynamic" className="text-white mb-2 block">
                  {t('recruitment.form.dynamic') || 'Describe your ideal team dynamic'} *
                </Label>
                <Textarea
                  id="dynamic"
                  placeholder="What type of team environment helps you thrive?"
                  value={formData.idealTeamDynamic}
                  onChange={(e) => setFormData({ ...formData, idealTeamDynamic: e.target.value })}
                  className={`h-24 ${errors.idealTeamDynamic ? 'border-red-500' : ''}`}
                />
                {errors.idealTeamDynamic && <p className="text-red-500 text-sm mt-1">{errors.idealTeamDynamic}</p>}
              </div>

              {/* Error Alert */}
              {errors.submit && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-accent hover:bg-accent/90 text-black font-bold uppercase tracking-widest"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('recruitment.form.submitting') || 'Submitting...'}
                  </>
                ) : (
                  t('recruitment.form.submit') || 'SUBMIT APPLICATION'
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                We'll review your application and contact you via Discord within 24-48 hours.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
