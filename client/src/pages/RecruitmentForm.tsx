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
import { toast } from 'sonner';

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

export default function RecruitmentForm() {
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
      toast.success('Application submitted successfully!');
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
      toast.error('Failed to submit application. Please try again.');
      setErrors({ submit: error.message || t('recruitment.errorMessage') });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.discordUsername.trim()) {
      newErrors.discordUsername = t('recruitment.requiredField');
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = t('recruitment.requiredField');
    }

    if (!formData.mainSpecialty) {
      newErrors.mainSpecialty = t('recruitment.requiredField');
    }

    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = t('recruitment.requiredField');
    }

    if (!formData.weeklyCommitment) {
      newErrors.weeklyCommitment = t('recruitment.requiredField');
    }

    if (formData.htbProfile && !isValidUrl(formData.htbProfile)) {
      newErrors.htbProfile = t('recruitment.invalidUrl');
    }

    if (formData.thmProfile && !isValidUrl(formData.thmProfile)) {
      newErrors.thmProfile = t('recruitment.invalidUrl');
    }

    if (formData.hcProfile && !isValidUrl(formData.hcProfile)) {
      newErrors.hcProfile = t('recruitment.invalidUrl');
    }

    if (formData.githubProfile && !isValidUrl(formData.githubProfile)) {
      newErrors.githubProfile = t('recruitment.invalidUrl');
    }

    if (formData.blogUrl && !isValidUrl(formData.blogUrl)) {
      newErrors.blogUrl = t('recruitment.invalidUrl');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    submitMutation.mutate({
      ...formData,
      categoriesToImprove: formData.categoriesToImprove.join(','),
      htbProfile: formData.htbProfile || undefined,
      thmProfile: formData.thmProfile || undefined,
      hcProfile: formData.hcProfile || undefined,
      githubProfile: formData.githubProfile || undefined,
      blogUrl: formData.blogUrl || undefined,
      biggestChallenge: formData.biggestChallenge || undefined,
      idealTeamDynamic: formData.idealTeamDynamic || undefined,
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

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-8 bg-red-500"></div>
              <CardTitle className="text-3xl font-bold uppercase tracking-tight">
                {t('recruitment.title')}
              </CardTitle>
            </div>
            <CardDescription className="text-lg mt-2">
              {t('recruitment.subtitle')}
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-3">
              {t('recruitment.description')}
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            {submitted && (
              <Alert className="mb-6 border-green-500 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {errors.submit && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Discord Username */}
              <div className="space-y-2">
                <Label htmlFor="discord" className="font-semibold">
                  {t('recruitment.discordUsername')} *
                </Label>
                <Input
                  id="discord"
                  placeholder={t('recruitment.discordUsernamePlaceholder')}
                  value={formData.discordUsername}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discordUsername: e.target.value,
                    }))
                  }
                  className={errors.discordUsername ? 'border-red-500' : ''}
                />
                {errors.discordUsername && (
                  <p className="text-sm text-red-500">{errors.discordUsername}</p>
                )}
              </div>

              {/* Profile URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="htb" className="font-semibold">
                    {t('recruitment.htbProfile')}
                  </Label>
                  <Input
                    id="htb"
                    type="url"
                    placeholder={t('recruitment.htbProfilePlaceholder')}
                    value={formData.htbProfile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        htbProfile: e.target.value,
                      }))
                    }
                    className={errors.htbProfile ? 'border-red-500' : ''}
                  />
                  {errors.htbProfile && (
                    <p className="text-sm text-red-500">{errors.htbProfile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thm" className="font-semibold">
                    {t('recruitment.thmProfile')}
                  </Label>
                  <Input
                    id="thm"
                    type="url"
                    placeholder={t('recruitment.thmProfilePlaceholder')}
                    value={formData.thmProfile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        thmProfile: e.target.value,
                      }))
                    }
                    className={errors.thmProfile ? 'border-red-500' : ''}
                  />
                  {errors.thmProfile && (
                    <p className="text-sm text-red-500">{errors.thmProfile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hc" className="font-semibold">
                    {t('recruitment.hcProfile')}
                  </Label>
                  <Input
                    id="hc"
                    type="url"
                    placeholder={t('recruitment.hcProfilePlaceholder')}
                    value={formData.hcProfile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hcProfile: e.target.value,
                      }))
                    }
                    className={errors.hcProfile ? 'border-red-500' : ''}
                  />
                  {errors.hcProfile && (
                    <p className="text-sm text-red-500">{errors.hcProfile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="font-semibold">
                    {t('recruitment.githubProfile')}
                  </Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder={t('recruitment.githubProfilePlaceholder')}
                    value={formData.githubProfile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        githubProfile: e.target.value,
                      }))
                    }
                    className={errors.githubProfile ? 'border-red-500' : ''}
                  />
                  {errors.githubProfile && (
                    <p className="text-sm text-red-500">{errors.githubProfile}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog" className="font-semibold">
                  {t('recruitment.blogUrl')}
                </Label>
                <Input
                  id="blog"
                  type="url"
                  placeholder={t('recruitment.blogUrlPlaceholder')}
                  value={formData.blogUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      blogUrl: e.target.value,
                    }))
                  }
                  className={errors.blogUrl ? 'border-red-500' : ''}
                />
                {errors.blogUrl && (
                  <p className="text-sm text-red-500">{errors.blogUrl}</p>
                )}
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <Label htmlFor="motivation" className="font-semibold">
                  {t('recruitment.motivation')} *
                </Label>
                <Textarea
                  id="motivation"
                  placeholder={t('recruitment.motivationPlaceholder')}
                  value={formData.motivation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      motivation: e.target.value,
                    }))
                  }
                  className={`min-h-24 ${errors.motivation ? 'border-red-500' : ''}`}
                />
                {errors.motivation && (
                  <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{errors.motivation}</span>
                  </div>
                )}
              </div>

              {/* Main Specialty */}
              <div className="space-y-2">
                <Label htmlFor="specialty" className="font-semibold">
                  {t('recruitment.mainSpecialty')} *
                </Label>
                <Select
                  value={formData.mainSpecialty}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      mainSpecialty: value,
                    }))
                  }
                >
                  <SelectTrigger className={errors.mainSpecialty ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('recruitment.mainSpecialtyPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CTF_SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.mainSpecialty && (
                  <p className="text-sm text-red-500">{errors.mainSpecialty}</p>
                )}
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="font-semibold">
                  {t('recruitment.yearsOfExperience')} *
                </Label>
                <Select
                  value={formData.yearsOfExperience}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      yearsOfExperience: value,
                    }))
                  }
                >
                  <SelectTrigger className={errors.yearsOfExperience ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('recruitment.yearsOfExperiencePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.yearsOfExperience && (
                  <p className="text-sm text-red-500">{errors.yearsOfExperience}</p>
                )}
              </div>

              {/* Biggest Challenge */}
              <div className="space-y-2">
                <Label htmlFor="challenge" className="font-semibold">
                  {t('recruitment.biggestChallenge')}
                </Label>
                <Textarea
                  id="challenge"
                  placeholder={t('recruitment.biggestChallengePlaceholder')}
                  value={formData.biggestChallenge}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      biggestChallenge: e.target.value,
                    }))
                  }
                  className="min-h-20"
                />
              </div>

              {/* Categories to Improve */}
              <div className="space-y-3">
                <Label className="font-semibold">
                  {t('recruitment.categoriesToImprove')}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CTF_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={formData.categoriesToImprove.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={`cat-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Commitment */}
              <div className="space-y-2">
                <Label htmlFor="commitment" className="font-semibold">
                  {t('recruitment.weeklyCommitment')} *
                </Label>
                <Select
                  value={formData.weeklyCommitment}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      weeklyCommitment: value,
                    }))
                  }
                >
                  <SelectTrigger className={errors.weeklyCommitment ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('recruitment.weeklyCommitmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMITMENT_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level} hours/week
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.weeklyCommitment && (
                  <p className="text-sm text-red-500">{errors.weeklyCommitment}</p>
                )}
              </div>

              {/* Ideal Team Dynamic */}
              <div className="space-y-2">
                <Label htmlFor="dynamic" className="font-semibold">
                  {t('recruitment.idealTeamDynamic')}
                </Label>
                <Textarea
                  id="dynamic"
                  placeholder={t('recruitment.idealTeamDynamicPlaceholder')}
                  value={formData.idealTeamDynamic}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idealTeamDynamic: e.target.value,
                    }))
                  }
                  className="min-h-20"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider py-6 text-lg"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('recruitment.submitting')}
                  </>
                ) : (
                  t('recruitment.submitApplication')
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * {t('recruitment.requiredField')}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
