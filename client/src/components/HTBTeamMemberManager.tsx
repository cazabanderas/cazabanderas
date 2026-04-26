import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Edit2, Save, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function HTBTeamMemberManager() {
  const { data: members, isLoading, refetch } = trpc.htb.getAllTeamMembers.useQuery();
  const updateMemberMutation = trpc.htb.updateTeamMember.useMutation();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    displayName: "",
    title: "",
    bio: "",
    specialties: "",
    htbUrl: "",
    thmUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    blogUrl: "",
    notes: "",
    isVisible: true,
  });

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setEditForm({
      displayName: member.displayName || "",
      title: member.title || "",
      bio: member.bio || "",
      specialties: member.specialties || "",
      htbUrl: member.htbUrl || "",
      thmUrl: member.thmUrl || "",
      githubUrl: member.githubUrl || "",
      linkedinUrl: member.linkedinUrl || "",
      blogUrl: member.blogUrl || "",
      notes: member.notes || "",
      isVisible: member.isVisible !== 0,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    try {
      await updateMemberMutation.mutateAsync({
        id: editingId,
        displayName: editForm.displayName,
        title: editForm.title,
        bio: editForm.bio,
        specialties: editForm.specialties,
        htbUrl: editForm.htbUrl,
        thmUrl: editForm.thmUrl,
        githubUrl: editForm.githubUrl,
        linkedinUrl: editForm.linkedinUrl,
        blogUrl: editForm.blogUrl,
        notes: editForm.notes,
        isVisible: editForm.isVisible ? 1 : 0,
      });
      
      toast.success("Team member updated successfully");
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update team member");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      displayName: "",
      title: "",
      bio: "",
      specialties: "",
      htbUrl: "",
      thmUrl: "",
      githubUrl: "",
      linkedinUrl: "",
      blogUrl: "",
      notes: "",
      isVisible: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#e63946]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members && members.length > 0 ? (
        members.map((member: any) => (
          <div
            key={member.id}
            className="border border-[#e63946]/30 p-6 hover:border-[#e63946]/60 transition-colors"
          >
            {editingId === member.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                      Title/Role
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="e.g., Web Exploitation Specialist"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                    Bio/Description
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell us about this team member..."
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                    Specialties (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.specialties}
                    onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value })}
                    placeholder="e.g., Web, Reverse Engineering, Cryptography"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                    Profile URLs
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="url"
                      value={editForm.htbUrl}
                      onChange={(e) => setEditForm({ ...editForm, htbUrl: e.target.value })}
                      placeholder="HackTheBox URL"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors text-sm"
                    />
                    <input
                      type="url"
                      value={editForm.thmUrl}
                      onChange={(e) => setEditForm({ ...editForm, thmUrl: e.target.value })}
                      placeholder="TryHackMe URL"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors text-sm"
                    />
                    <input
                      type="url"
                      value={editForm.githubUrl}
                      onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                      placeholder="GitHub URL"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors text-sm"
                    />
                    <input
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                      placeholder="LinkedIn URL"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors text-sm"
                    />
                    <input
                      type="url"
                      value={editForm.blogUrl}
                      onChange={(e) => setEditForm({ ...editForm, blogUrl: e.target.value })}
                      placeholder="Blog URL"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors text-sm col-span-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    rows={2}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isVisible}
                      onChange={(e) => setEditForm({ ...editForm, isVisible: e.target.checked })}
                      className="w-4 h-4 accent-[#e63946]"
                    />
                    <span className="font-mono text-sm text-white">Visible on public page</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handleSave}
                    disabled={updateMemberMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] transition-all duration-200 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {updateMemberMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 font-mono text-sm tracking-widest uppercase hover:border-white/40 hover:text-white transition-all duration-200"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {member.profilePictureUrl && (
                      <img
                        src={member.profilePictureUrl}
                        alt={member.displayName}
                        className="w-12 h-12 rounded-lg object-cover border border-[#e63946]/30"
                      />
                    )}
                    <div>
                      <h3 className="font-display text-lg text-white tracking-wider">
                        {member.displayName}
                      </h3>
                      {member.title && (
                        <p className="text-[#e63946] font-mono text-xs tracking-wide">
                          {member.title}
                        </p>
                      )}
                      <p className="text-white/60 font-mono text-xs">
                        HTB: {member.htbUsername}
                      </p>
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-white/70 text-sm mb-3 p-3 bg-white/5 border border-white/10 rounded">
                      {member.bio}
                    </p>
                  )}

                  {member.specialties && (
                    <p className="text-white/60 text-sm mb-2">
                      <span className="font-mono text-[#e63946]">Specialties:</span> {member.specialties}
                    </p>
                  )}

                  {(member.htbUrl || member.thmUrl || member.githubUrl || member.linkedinUrl || member.blogUrl) && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {member.htbUrl && (
                        <a
                          href={member.htbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#e63946] hover:text-white text-xs font-mono transition-colors"
                        >
                          HTB
                        </a>
                      )}
                      {member.thmUrl && (
                        <a
                          href={member.thmUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#e63946] hover:text-white text-xs font-mono transition-colors"
                        >
                          THM
                        </a>
                      )}
                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#e63946] hover:text-white text-xs font-mono transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#e63946] hover:text-white text-xs font-mono transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {member.blogUrl && (
                        <a
                          href={member.blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#e63946] hover:text-white text-xs font-mono transition-colors"
                        >
                          Blog
                        </a>
                      )}
                    </div>
                  )}

                  {member.notes && (
                    <p className="text-white/60 text-xs mb-3 p-2 bg-white/5 border border-white/10 rounded italic">
                      {member.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                    {member.isVisible ? (
                      <>
                        <Eye size={14} />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} />
                        <span>Hidden</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-white/50 hover:text-[#e63946] transition-colors"
                  title="Edit member"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12 border border-white/10 p-8">
          <p className="text-white/60">No team members synced from HackTheBox yet.</p>
        </div>
      )}
    </div>
  );
}
