import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Writeup {
  id: number;
  teamMemberId: number;
  title: string;
  content: string;
  challengeName: string | null;
  platform: string | null;
  difficulty: string | null;
  category: string | null;
  isPublic: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function WriteUpsManager({ teamMemberId }: { teamMemberId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    challengeName: "",
    platform: "",
    difficulty: "Medium",
    category: "",
    isPublic: 0,
  });

  const { data: writeups, isLoading, refetch } = trpc.writeups.getByTeamMember.useQuery(
    { teamMemberId },
    { enabled: !!teamMemberId }
  );
  const createMutation = trpc.writeups.create.useMutation();
  const updateMutation = trpc.writeups.update.useMutation();
  const deleteMutation = trpc.writeups.delete.useMutation();
  const toggleVisibilityMutation = trpc.writeups.toggleVisibility.useMutation();

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          writeupId: editingId,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync({
          teamMemberId,
          ...formData,
        });
      }
      setFormData({
        title: "",
        content: "",
        challengeName: "",
        platform: "",
        difficulty: "Medium",
        category: "",
        isPublic: 0,
      });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to save write-up");
    }
  };

  const handleEdit = (writeup: Writeup) => {
    setFormData({
      title: writeup.title,
      content: writeup.content,
      challengeName: writeup.challengeName || "",
      platform: writeup.platform || "",
      difficulty: writeup.difficulty || "Medium",
      category: writeup.category || "",
      isPublic: writeup.isPublic,
    });
    setEditingId(writeup.id);
    setShowForm(true);
    setPreviewMode(false);
  };

  const handleDelete = async (writeupId: number) => {
    if (confirm("Are you sure you want to delete this write-up?")) {
      try {
        await deleteMutation.mutateAsync({ writeupId });
        refetch();
      } catch (error: any) {
        alert(error.message || "Failed to delete write-up");
      }
    }
  };

  const handleToggleVisibility = async (writeupId: number, currentVisibility: number) => {
    try {
      await toggleVisibilityMutation.mutateAsync({
        writeupId,
        isPublic: currentVisibility === 1 ? 0 : 1,
      });
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to toggle visibility");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      content: "",
      challengeName: "",
      platform: "",
      difficulty: "Medium",
      category: "",
      isPublic: 0,
    });
    setEditingId(null);
    setShowForm(false);
    setPreviewMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#e63946]" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-white mb-2 tracking-wider">MY WRITE-UPS</h2>
          <p className="text-white/60">Create and manage your CTF write-ups</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] transition-all duration-200"
          >
            <Plus size={18} />
            New Write-up
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="border border-[#e63946]/30 p-6 bg-white/5 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-white tracking-wider">
              {editingId ? "EDIT WRITE-UP" : "NEW WRITE-UP"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-white/60 hover:text-[#e63946] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., HackTheBox - Retired Machine Writeup"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Challenge Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                  Challenge Name
                </label>
                <input
                  type="text"
                  value={formData.challengeName}
                  onChange={(e) => setFormData({ ...formData, challengeName: e.target.value })}
                  placeholder="e.g., Retired"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-[#e63946] focus:outline-none transition-colors"
                >
                  <option value="">Select Platform</option>
                  <option value="HackTheBox">HackTheBox</option>
                  <option value="TryHackMe">TryHackMe</option>
                  <option value="CTFtime">CTFtime</option>
                  <option value="PicoCTF">PicoCTF</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-[#e63946] focus:outline-none transition-colors"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Insane">Insane</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Web, Pwn, Crypto"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase">
                  Content (Markdown) *
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs font-mono text-white/60 hover:text-white transition-colors"
                >
                  {previewMode ? "Edit" : "Preview"}
                </button>
              </div>

              {previewMode ? (
                <div className="w-full min-h-96 px-4 py-3 bg-white/5 border border-white/10 text-white rounded prose prose-invert max-w-none overflow-auto">
                  {(ReactMarkdown as any)({
                    children: formData.content || "*No content yet*",
                    remarkPlugins: [remarkGfm],
                  })}
                </div>
              ) : (
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your write-up in markdown format..."
                  className="w-full min-h-96 px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#e63946] focus:outline-none transition-colors font-mono text-sm resize-none"
                  required
                />
              )}
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded">
              <input
                type="checkbox"
                checked={formData.isPublic === 1}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 accent-[#e63946]"
              />
              <div>
                <p className="text-white font-mono text-sm tracking-widest uppercase">
                  {formData.isPublic === 1 ? "PUBLIC" : "PRIVATE"}
                </p>
                <p className="text-white/60 text-xs">
                  {formData.isPublic === 1
                    ? "This write-up will be visible on the homepage"
                    : "Only team members can see this write-up"}
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] disabled:opacity-50 transition-all duration-200"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    SAVE WRITE-UP
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-white/20 text-white/60 font-mono text-sm tracking-widest uppercase hover:border-white/40 hover:text-white transition-all duration-200"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Write-ups List */}
      <div className="space-y-4">
        {writeups && writeups.length > 0 ? (
          writeups.map((writeup: Writeup) => (
            <div
              key={writeup.id}
              className="border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-display text-lg tracking-wider mb-2">{writeup.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs font-mono text-white/60">
                    {writeup.challengeName && (
                      <span className="px-2 py-1 bg-white/10 rounded">Challenge: {writeup.challengeName}</span>
                    )}
                    {writeup.platform && (
                      <span className="px-2 py-1 bg-white/10 rounded">Platform: {writeup.platform}</span>
                    )}
                    {writeup.difficulty && (
                      <span className="px-2 py-1 bg-white/10 rounded">Difficulty: {writeup.difficulty}</span>
                    )}
                    {writeup.category && (
                      <span className="px-2 py-1 bg-white/10 rounded">Category: {writeup.category}</span>
                    )}
                    <span className="px-2 py-1 bg-white/10 rounded">Views: {writeup.viewCount}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="ml-4">
                  {writeup.isPublic === 1 ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-mono tracking-widest uppercase rounded">
                      <Eye size={14} />
                      PUBLIC
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-mono tracking-widest uppercase rounded">
                      <EyeOff size={14} />
                      PRIVATE
                    </span>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded max-h-32 overflow-hidden text-white/70 text-sm prose prose-invert prose-sm max-w-none">
                {(ReactMarkdown as any)({
                  children: writeup.content.substring(0, 200) + "...",
                  remarkPlugins: [remarkGfm],
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(writeup)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white/60 font-mono text-xs tracking-widest uppercase hover:border-[#e63946] hover:text-[#e63946] transition-colors"
                >
                  <Edit2 size={14} />
                  EDIT
                </button>
                <button
                  onClick={() =>
                    handleToggleVisibility(writeup.id, writeup.isPublic)
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white/60 font-mono text-xs tracking-widest uppercase hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  {writeup.isPublic === 1 ? (
                    <>
                      <EyeOff size={14} />
                      MAKE PRIVATE
                    </>
                  ) : (
                    <>
                      <Eye size={14} />
                      PUBLISH
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(writeup.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-white/60 font-mono text-xs tracking-widest uppercase hover:border-[#e63946] hover:text-[#e63946] transition-colors"
                >
                  <Trash2 size={14} />
                  DELETE
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border border-white/10 p-8">
            <p className="text-white/60 mb-4">No write-ups yet. Create your first one!</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-[#c1121f] transition-all duration-200"
            >
              <Plus size={18} />
              Create Write-up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
