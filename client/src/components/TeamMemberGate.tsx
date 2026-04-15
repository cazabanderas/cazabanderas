import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Loader2 } from "lucide-react";

interface TeamMemberGateProps {
  children: React.ReactNode;
}

/**
 * TeamMemberGate - Restricts access to official Cazabanderas team members only
 * Shows login prompt if not authenticated
 * Shows access denied if authenticated but not a team member
 */
export default function TeamMemberGate({ children }: TeamMemberGateProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: teamCheckData, isLoading: checkLoading } = trpc.auth.checkTeamMember.useQuery();

  const isLoading = authLoading || checkLoading;
  const isTeamMember = teamCheckData?.isTeamMember ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#e63946] mx-auto mb-4" />
          <p className="text-white/60">Verifying team membership...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="text-center max-w-md">
          <h1 className="font-display text-4xl text-white mb-4">CAZABANDERAS</h1>
          <p className="text-white/60 mb-8">
            This site is restricted to official Cazabanderas team members only.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-block px-8 py-3 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] transition-all duration-200"
          >
            Sign In with Manus
          </a>
        </div>
      </div>
    );
  }

  if (!isTeamMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="text-center max-w-md">
          <h1 className="font-display text-4xl text-white mb-4">ACCESS DENIED</h1>
          <p className="text-white/60 mb-4">
            You are signed in as <span className="text-[#e63946]">{user.email}</span>
          </p>
          <p className="text-white/60 mb-8">
            This site is restricted to official Cazabanderas team members only. If you believe this is an error, contact the team leadership.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-block px-8 py-3 border border-[#e63946] text-[#e63946] font-mono text-sm tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all duration-200 mr-4"
          >
            Sign In as Different User
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
