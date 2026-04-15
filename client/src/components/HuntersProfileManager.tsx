import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function HuntersProfileManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    teamMemberId: 1,
    displayName: "",
    title: "",
    bio: "",
    specialty: "",
    avatarUrl: "",
    htbProfile: "",
    thmProfile: "",
    githubProfile: "",
    twitterProfile: "",
    flagsCount: 0,
    ranking: 1,
    isVisible: 1,
  });

  const { data: profiles = [], refetch } = trpc.admin.listHuntersProfiles.useQuery();
  const upsertMutation = trpc.admin.upsertHuntersProfile.useMutation();
  const deleteMutation = trpc.admin.deleteHuntersProfile.useMutation();

  const handleSubmit = async () => {
    if (!formData.displayName.trim()) {
      toast.error("Display name is required");
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        ...formData,
        id: editingId || undefined,
      });
      toast.success(editingId ? "Profile updated" : "Profile created");
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save profile");
    }
  };

  const handleEdit = (profile: any) => {
    setFormData(profile);
    setEditingId(profile.id);
    setShowForm(true);
  };

  const handleDelete = async (profileId: number) => {
    if (!window.confirm("Delete this hunter profile?")) return;

    try {
      await deleteMutation.mutateAsync({ profileId });
      toast.success("Profile deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  const resetForm = () => {
    setFormData({
      teamMemberId: 1,
      displayName: "",
      title: "",
      bio: "",
      specialty: "",
      avatarUrl: "",
      htbProfile: "",
      thmProfile: "",
      githubProfile: "",
      twitterProfile: "",
      flagsCount: 0,
      ranking: 1,
      isVisible: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Hunters Profiles</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2 bg-[#e63946] hover:bg-[#e63946]/90"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Hunter"}
        </Button>
      </div>

      {showForm && (
        <div className="border border-white/10 rounded-lg p-6 bg-[#111318] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
            <Input
              placeholder="Title (e.g., Web Exploitation Specialist)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
          </div>

          <Textarea
            placeholder="Bio / Catchphrase"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="bg-[#0d0f14] border-white/10 text-white"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Specialty"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
            <Input
              placeholder="Avatar URL"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="HTB Profile URL"
              value={formData.htbProfile}
              onChange={(e) => setFormData({ ...formData, htbProfile: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
            <Input
              placeholder="THM Profile URL"
              value={formData.thmProfile}
              onChange={(e) => setFormData({ ...formData, thmProfile: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="GitHub Profile URL"
              value={formData.githubProfile}
              onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
            <Input
              placeholder="Twitter Profile URL"
              value={formData.twitterProfile}
              onChange={(e) => setFormData({ ...formData, twitterProfile: e.target.value })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Flags Count"
              value={formData.flagsCount}
              onChange={(e) => setFormData({ ...formData, flagsCount: parseInt(e.target.value) })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
            <Input
              type="number"
              placeholder="Ranking"
              value={formData.ranking ?? ""}
              onChange={(e) => setFormData({ ...formData, ranking: e.target.value ? parseInt(e.target.value) : 0 })}
              className="bg-[#0d0f14] border-white/10 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isVisible === 1}
              onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked ? 1 : 0 })}
              className="w-4 h-4"
            />
            <label className="text-sm text-white/60">Visible on public website</label>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={upsertMutation.isPending}
              className="flex-1 bg-[#e63946] hover:bg-[#e63946]/90"
            >
              {upsertMutation.isPending ? "Saving..." : editingId ? "Update Profile" : "Create Profile"}
            </Button>
            <Button onClick={resetForm} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {profiles.length === 0 ? (
          <div className="text-center py-8 text-white/40">No hunter profiles yet</div>
        ) : (
          profiles.map((profile: any) => (
            <div
              key={profile.id}
              className="border border-white/10 rounded-lg p-4 bg-[#111318] flex items-start justify-between hover:border-white/20 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-white">{profile.displayName}</h4>
                {profile.title && <p className="text-sm text-[#e63946]">{profile.title}</p>}
                {profile.bio && <p className="text-xs text-white/50 mt-1">{profile.bio}</p>}
                <div className="flex gap-2 mt-2 text-xs text-white/40">
                  {profile.specialty && <span>Specialty: {profile.specialty}</span>}
                  {profile.flagsCount > 0 && <span>Flags: {profile.flagsCount}</span>}
                  {profile.ranking && <span>Rank: #{profile.ranking}</span>}
                  <span className={profile.isVisible ? "text-green-400" : "text-red-400"}>
                    {profile.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => handleEdit(profile)}
                  size="sm"
                  variant="outline"
                  className="gap-1"
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  onClick={() => handleDelete(profile.id)}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
