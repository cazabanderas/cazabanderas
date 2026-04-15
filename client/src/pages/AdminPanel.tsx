import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Edit2, Eye, EyeOff, LogOut, Home, LayoutDashboard } from "lucide-react";
import ActivityLog from "@/components/ActivityLog";
import HuntersProfileManager from "@/components/HuntersProfileManager";

interface TeamMember {
  id: number;
  displayName: string;
  specialty: string | null;
  openId: string;
  isApproved: number;
  createdAt: Date;
  credentials: Array<{
    id: number;
    username: string;
    isActive: number;
  }>;
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    specialty: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"members" | "activity" | "hunters">("members");

  const { data: members, isLoading, refetch } = trpc.admin.listMembers.useQuery();
  const addMemberMutation = trpc.admin.addMember.useMutation();
  const updateMemberMutation = trpc.admin.updateMember.useMutation();
  const resetPasswordMutation = trpc.admin.resetPassword.useMutation();
  const deactivateMutation = trpc.admin.deactivateCredential.useMutation();
  const deleteMemberMutation = trpc.admin.deleteMember.useMutation();

  useEffect(() => {
    // Check if user is admin (founder)
    const teamMember = localStorage.getItem("teamMember");
    if (teamMember) {
      try {
        const member = JSON.parse(teamMember);
        // Only founder/owner can access admin panel
        if (member.displayName === "aw0ken" || member.specialty?.includes("Owner")) {
          setIsAdmin(true);
        } else {
          setLocation("/team-portal");
        }
      } catch {
        setLocation("/team-login");
      }
    } else {
      setLocation("/team-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("teamMember");
    localStorage.removeItem("teamMemberLoggedIn");
    setLocation("/team-login");
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMemberMutation.mutateAsync({
        displayName: formData.displayName,
        specialty: formData.specialty || undefined,
        username: formData.username,
        password: formData.password,
      });
      setFormData({ displayName: "", specialty: "", username: "", password: "" });
      setShowAddForm(false);
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to add member");
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteMemberMutation.mutateAsync({ memberId });
        refetch();
      } catch (error: any) {
        alert(error.message || "Failed to delete member");
      }
    }
  };

  const handleDeactivateCredential = async (credentialId: number) => {
    try {
      await deactivateMutation.mutateAsync({ credentialId });
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to deactivate credential");
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#e63946] mx-auto mb-4" />
          <p className="text-white/60">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0d0f14]/95 backdrop-blur-md border-b border-white/5">
        <div className="container flex items-center justify-between h-16">
          <div>
            <h1 className="font-display text-white text-xl tracking-widest">ADMIN PANEL</h1>
            <p className="font-mono text-[0.6rem] text-[#e63946]/70 tracking-[0.2em] uppercase">Team Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-[#e63946] text-[#e63946] font-mono text-xs tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      {/* Admin Header with Navigation */}
      <div className="fixed top-0 left-0 right-0 border-b border-white/10 bg-[#0d0f14]/95 backdrop-blur-sm z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-white tracking-wider">ADMIN PANEL</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/team-portal")}
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded font-mono text-xs"
              title="Team Dashboard"
            >
              <LayoutDashboard size={16} />
              Team Dashboard
            </button>
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded font-mono text-xs"
              title="Home Page"
            >
              <Home size={16} />
              Home
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("teamMemberLoggedIn");
                localStorage.removeItem("teamMember");
                setLocation("/");
              }}
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-[#e63946] hover:bg-[#e63946]/10 transition-colors rounded font-mono text-xs"
              title="Logout"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="pt-32 pb-16">
        <div className="container max-w-6xl">
          {/* Tab Navigation */}
          <div className="mb-8 flex gap-4 border-b border-[#e63946]/30">
            <button
              onClick={() => setActiveTab("members")}
              className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-all ${
                activeTab === "members"
                  ? "text-[#e63946] border-b-2 border-[#e63946]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Team Members
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-all ${
                activeTab === "activity"
                  ? "text-[#e63946] border-b-2 border-[#e63946]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Activity Log
            </button>
            <button
              onClick={() => setActiveTab("hunters")}
              className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-all ${
                activeTab === "hunters"
                  ? "text-[#e63946] border-b-2 border-[#e63946]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Hunters Profiles
            </button>
          </div>

          {/* Add Member Button */}
          {activeTab === "members" && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl text-white mb-2 tracking-wider">TEAM MEMBERS</h2>
              <p className="text-white/60">Manage operative credentials and access</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] transition-all duration-200"
            >
              <Plus size={18} />
              Add Member
            </button>
          </div>
          )}

          {/* Add Member Form */}
          {activeTab === "members" && showAddForm && (
            <div className="mb-8 border border-[#e63946]/30 p-6 bg-white/5">
              <h3 className="font-display text-xl text-white mb-6 tracking-wider">NEW OPERATIVE</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="e.g., Hunter One"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                      Specialty (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      placeholder="e.g., Web Exploitation"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="e.g., hunter@cazabanderas.team"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min 8 characters"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={addMemberMutation.isPending}
                    className="px-6 py-2 bg-[#e63946] text-white font-mono text-xs tracking-widest uppercase hover:bg-[#c1121f] disabled:opacity-50 transition-all duration-200"
                  >
                    {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border border-white/20 text-white font-mono text-xs tracking-widest uppercase hover:border-white/40 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Members List */}
          {activeTab === "members" && (
          <div className="space-y-4">
            {members && members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="border border-[#e63946]/30 p-6 hover:border-[#e63946]/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg text-white tracking-wider">{member.displayName}</h3>
                      {member.specialty && (
                        <p className="text-[#e63946] font-mono text-xs tracking-widest uppercase mt-1">
                          {member.specialty}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 text-white/50 hover:text-[#e63946] transition-colors"
                      title="Delete member"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Credentials */}
                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <p className="font-mono text-xs text-white/60 tracking-widest uppercase mb-3">Credentials</p>
                    <div className="space-y-3">
                      {member.credentials.map((cred) => (
                        <div key={cred.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                          <div>
                            <p className="text-white font-mono text-sm">{cred.username}</p>
                            <p className={`text-xs font-mono mt-1 ${cred.isActive ? "text-green-400" : "text-white/40"}`}>
                              {cred.isActive ? "✓ Active" : "✗ Inactive"}
                            </p>
                          </div>
                          {cred.isActive && (
                            <button
                              onClick={() => handleDeactivateCredential(cred.id)}
                              className="px-3 py-1 text-xs border border-[#e63946] text-[#e63946] font-mono tracking-widest uppercase hover:bg-[#e63946] hover:text-white transition-all duration-200"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-white/10 p-8">
                <p className="text-white/60">No team members yet. Add one to get started.</p>
              </div>
            )}
          </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity" && (
            <ActivityLog />
          )}

          {/* Hunters Profiles Tab */}
          {activeTab === "hunters" && (
            <div>
              <div className="mb-8">
                <h2 className="font-display text-3xl text-white mb-2 tracking-wider">HUNTERS PROFILES</h2>
                <p className="text-white/60">Manage team member profiles for the public website</p>
              </div>
              <HuntersProfileManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
