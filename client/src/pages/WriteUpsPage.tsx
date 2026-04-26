import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface WriteUp {
  id: number;
  title: string;
  challengeName: string | null;
  platform: string | null;
  difficulty: string | null;
  category: string | null;
  content: string;
  isPublic: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function WriteUpsPage() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    challengeName: "",
    platform: "HackTheBox",
    difficulty: "Medium",
    category: "",
    content: "",
    isPublic: 0,
  });

  const [showPreview, setShowPreview] = useState(false);

  // Fetch write-ups
  const { data: writeups = [], isLoading, refetch } = trpc.writeups.getByTeamMember.useQuery(
    { teamMemberId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Mutations
  const createMutation = trpc.writeups.create.useMutation({
    onSuccess: () => {
      toast.success('Write-up created successfully!');
      resetForm();
      refetch();
    },
    onError: () => {
      toast.error('Failed to create write-up. Please try again.');
    },
  });

  const updateMutation = trpc.writeups.update.useMutation({
    onSuccess: () => {
      toast.success('Write-up updated successfully!');
      resetForm();
      refetch();
    },
    onError: () => {
      toast.error('Failed to update write-up. Please try again.');
    },
  });

  const deleteMutation = trpc.writeups.delete.useMutation({
    onSuccess: () => {
      toast.success('Write-up deleted successfully!');
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete write-up. Please try again.');
    },
  });

  const toggleVisibilityMutation = trpc.writeups.toggleVisibility.useMutation({
    onSuccess: () => {
      toast.success('Visibility updated!');
      refetch();
    },
    onError: () => {
      toast.error('Failed to update visibility. Please try again.');
    },
  });

  // Filtered and searched write-ups
  const filteredWriteups = useMemo(() => {
    return writeups.filter((wu: any) => {
      const matchesSearch =
        wu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wu.challengeName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform = platformFilter === "all" || wu.platform === platformFilter;
      const matchesDifficulty = difficultyFilter === "all" || wu.difficulty === difficultyFilter;

      return matchesSearch && matchesPlatform && matchesDifficulty;
    });
  }, [writeups, searchQuery, platformFilter, difficultyFilter]);

  const resetForm = () => {
    setFormData({
      title: "",
      challengeName: "",
      platform: "HackTheBox",
      difficulty: "Medium",
      category: "",
      content: "",
      isPublic: 0,
    });
    setEditingId(null);
    setShowForm(false);
    setShowPreview(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert("Title and content are required");
      return;
    }

    if (editingId) {
      await updateMutation.mutateAsync({
        writeupId: editingId,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync({
        teamMemberId: user?.id || 0,
        ...formData,
      });
    }
  };

  const handleEdit = (writeup: WriteUp) => {
    setFormData({
      title: writeup.title,
      challengeName: writeup.challengeName || "",
      platform: writeup.platform || "HackTheBox",
      difficulty: writeup.difficulty || "Medium",
      category: writeup.category || "",
      content: writeup.content,
      isPublic: writeup.isPublic,
    });
    setEditingId(writeup.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this write-up?")) {
      deleteMutation.mutate({ writeupId: id });
    }
  };

  const handleToggleVisibility = (id: number, currentVisibility: boolean) => {
    toggleVisibilityMutation.mutate({
      writeupId: id,
      isPublic: currentVisibility ? 0 : 1,
    } as any);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to manage write-ups</p>
          <Button onClick={() => navigate("/team-login")}>Go to Team Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0f14] text-white">
      {/* Main Content */}
      <div className="pb-16">
        <div className="container max-w-6xl">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters & Create */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Create Button */}
                <Button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="w-full bg-[#e63946] hover:bg-[#e63946]/90 text-white font-mono text-xs tracking-widest uppercase"
                >
                  <Plus size={16} className="mr-2" />
                  New Write-Up
                </Button>

                {/* Filters */}
                <div className="border border-white/10 p-4 space-y-4">
                  <h3 className="font-mono text-xs text-[#e63946] tracking-widest uppercase">Filters</h3>

                  {/* Platform Filter */}
                  <div>
                    <label className="block text-xs text-white/60 mb-2 font-mono">Platform</label>
                    <select
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm p-2 rounded"
                    >
                      <option value="all">All Platforms</option>
                      <option value="HackTheBox">HackTheBox</option>
                      <option value="TryHackMe">TryHackMe</option>
                      <option value="CTFtime">CTFtime</option>
                      <option value="PicoCTF">PicoCTF</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-xs text-white/60 mb-2 font-mono">Difficulty</label>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm p-2 rounded"
                    >
                      <option value="all">All Levels</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Insane">Insane</option>
                    </select>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="block text-xs text-white/60 mb-2 font-mono">Search</label>
                    <Input
                      type="text"
                      placeholder="Search write-ups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="border border-white/10 p-4 space-y-2">
                  <p className="text-xs text-white/60 font-mono">Total Write-ups</p>
                  <p className="text-2xl font-display text-[#e63946]">{writeups.length}</p>
                  <p className="text-xs text-white/60 font-mono">
                    {writeups.filter((w: any) => w.isPublic).length} Public
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {showForm ? (
                // Editor Form
                <div className="border border-white/10 p-8">
                  <h3 className="font-display text-2xl text-white mb-6 tracking-wider">
                    {editingId ? "EDIT WRITE-UP" : "CREATE NEW WRITE-UP"}
                  </h3>

                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-xs text-white/60 mb-2 font-mono">Title *</label>
                      <Input
                        type="text"
                        placeholder="e.g., HackTheBox - Retired Machine Writeup"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    {/* Challenge Name */}
                    <div>
                      <label className="block text-xs text-white/60 mb-2 font-mono">Challenge Name</label>
                      <Input
                        type="text"
                        placeholder="e.g., Retired, Tabby, Lame"
                        value={formData.challengeName}
                        onChange={(e) => setFormData({ ...formData, challengeName: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    {/* Platform & Difficulty */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/60 mb-2 font-mono">Platform</label>
                        <select
                          value={formData.platform}
                          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white text-sm p-2 rounded"
                        >
                          <option value="HackTheBox">HackTheBox</option>
                          <option value="TryHackMe">TryHackMe</option>
                          <option value="CTFtime">CTFtime</option>
                          <option value="PicoCTF">PicoCTF</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-2 font-mono">Difficulty</label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white text-sm p-2 rounded"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Insane">Insane</option>
                        </select>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs text-white/60 mb-2 font-mono">Category/Tags</label>
                      <Input
                        type="text"
                        placeholder="e.g., Web, Pwn, Crypto (comma-separated)"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    {/* Content Editor & Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs text-white/60 font-mono">Content * (Markdown)</label>
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="text-xs text-[#e63946] hover:text-white transition-colors font-mono"
                        >
                          {showPreview ? "← Edit" : "Preview →"}
                        </button>
                      </div>

                      {!showPreview ? (
                        <textarea
                          placeholder="Write your write-up in markdown format..."
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="w-full h-64 bg-white/5 border border-white/10 text-white p-4 rounded placeholder:text-white/40 font-mono text-sm"
                        />
                      ) : (
                        <div className="h-64 bg-white/5 border border-white/10 p-4 rounded overflow-y-auto prose prose-invert max-w-none">
                          <div className="text-white/80 text-sm whitespace-pre-wrap">{formData.content}</div>
                        </div>
                      )}
                    </div>

                    {/* Visibility Toggle */}
                    <div className="border-t border-white/10 pt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.isPublic)}
                          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked ? 1 : 0 } as any)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-white font-mono text-xs tracking-widest uppercase">
                            {formData.isPublic ? "PUBLIC" : "PRIVATE"}
                          </p>
                          <p className="text-xs text-white/60">
                            {formData.isPublic
                              ? "This write-up will appear on the homepage"
                              : "Only team members can see this write-up"}
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6">
                      <Button
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="flex-1 bg-[#e63946] hover:bg-[#e63946]/90 text-white font-mono text-xs tracking-widest uppercase"
                      >
                        {createMutation.isPending || updateMutation.isPending ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="mr-2" />
                            {editingId ? "Update Write-Up" : "Create Write-Up"}
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="flex-1 border-white/10 text-white hover:bg-white/5 font-mono text-xs tracking-widest uppercase"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Write-ups List
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border border-white/10 p-6 animate-pulse">
                          <div className="space-y-3">
                            <div className="h-6 bg-white/10 rounded w-3/4" />
                            <div className="flex gap-2">
                              <div className="h-4 bg-white/10 rounded w-20" />
                              <div className="h-4 bg-white/10 rounded w-20" />
                              <div className="h-4 bg-white/10 rounded w-20" />
                            </div>
                            <div className="h-4 bg-white/10 rounded w-full" />
                            <div className="h-4 bg-white/10 rounded w-5/6" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredWriteups.length === 0 ? (
                    <div className="border border-dashed border-white/20 p-12 text-center rounded-lg bg-white/5">
                      <div className="mb-4">
                        <div className="text-4xl mb-3">📝</div>
                        <h3 className="text-xl font-display text-white mb-2">No Write-Ups Yet</h3>
                        <p className="text-white/60 mb-4">Start sharing your CTF solutions and knowledge with the team</p>
                      </div>
                      <Button
                        onClick={() => setShowForm(true)}
                        className="bg-[#e63946] hover:bg-[#e63946]/90 text-white font-mono text-xs tracking-widest uppercase"
                      >
                        <Plus size={16} className="mr-2" />
                        Create Your First Write-Up
                      </Button>
                    </div>
                  ) : (
                    filteredWriteups.map((writeup) => (
                      <div key={writeup.id} className="border border-white/10 p-6 hover:border-white/20 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-display text-lg text-white mb-2">{writeup.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                                {writeup.platform}
                              </span>
                              <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                                {writeup.difficulty}
                              </span>
                              {writeup.category && (
                                <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                                  {writeup.category}
                                </span>
                              )}
                              <span
                                className={`text-xs px-2 py-1 rounded font-mono tracking-widest uppercase ${
                                  Boolean(writeup.isPublic)
                                    ? "bg-[#e63946]/20 text-[#e63946]"
                                    : "bg-white/10 text-white/60"
                                }`}
                              >
                                {Boolean(writeup.isPublic) ? "PUBLIC" : "PRIVATE"}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 font-mono">
                              {new Date(writeup.createdAt).toLocaleDateString()} • {writeup.viewCount} views
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleToggleVisibility(writeup.id, Boolean(writeup.isPublic))}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                              title={Boolean(writeup.isPublic) ? "Make Private" : "Make Public"}
                            >
                              {Boolean(writeup.isPublic) ? (
                                <Eye size={18} className="text-[#e63946]" />
                              ) : (
                                <EyeOff size={18} className="text-white/40" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(writeup)}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} className="text-white/60" />
                            </button>
                            <button
                              onClick={() => handleDelete(writeup.id)}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} className="text-white/60" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
