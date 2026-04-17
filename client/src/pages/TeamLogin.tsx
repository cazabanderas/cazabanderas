import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Team Login - Custom authentication for team members
 * Username/password login system with navigation to home
 */
export default function TeamLogin() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.teamAuth.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({ username, password });
      
      if (result.success) {
        // Store team member info in localStorage
        localStorage.setItem("teamMember", JSON.stringify(result.member));
        localStorage.setItem("teamMemberLoggedIn", "true");
        
        // Redirect to team dashboard
        setLocation("/team-dashboard");
      }
    } catch (err: any) {
      setError(err.message || t('teamLogin.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col">
      {/* Header with Home Link */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-white tracking-wider">CAZABANDERAS</h2>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded font-mono text-xs"
        >
          <Home size={16} />
          {t('teamLogin.home')}
        </button>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl text-white mb-2 tracking-wider">
              {t('teamLogin.title')}
            </h1>
            <p className="text-white/60 font-mono text-xs tracking-widest uppercase">
              {t('teamLogin.subtitle')}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                {t('teamLogin.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('teamLogin.usernamePlaceholder')}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                {t('teamLogin.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('teamLogin.passwordPlaceholder')}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-sm font-mono">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full px-6 py-3 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('teamLogin.authenticating')}
                </>
              ) : (
                t('teamLogin.signIn')
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs font-mono">
              {t('teamLogin.contactTeamLeadership')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
