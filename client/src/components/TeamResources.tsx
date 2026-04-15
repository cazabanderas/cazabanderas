import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Upload, Download, Trash2, FileText, Archive, Code, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: number;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  downloadCount: number;
  tags: string[];
  createdAt: Date;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Documentation: <BookOpen className="w-4 h-4" />,
  Tools: <Code className="w-4 h-4" />,
  Guides: <FileText className="w-4 h-4" />,
  Scripts: <Code className="w-4 h-4" />,
  Exploits: <Archive className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  Documentation: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  Tools: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  Guides: "bg-green-500/20 text-green-400 border-green-500/50",
  Scripts: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  Exploits: "bg-red-500/20 text-red-400 border-red-500/50",
};

export default function TeamResources() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "Documentation",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: resources, isLoading, refetch } = trpc.resources.list.useQuery({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const uploadMutation = trpc.resources.upload.useMutation();
  const downloadMutation = trpc.resources.download.useMutation();
  const deleteMutation = trpc.resources.delete.useMutation();

  const categories = ["Documentation", "Tools", "Guides", "Scripts", "Exploits"];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!uploadData.title) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(",")[1];

        await uploadMutation.mutateAsync({
          title: uploadData.title,
          description: uploadData.description || undefined,
          category: uploadData.category,
          tags: uploadData.tags ? uploadData.tags.split(",").map((t) => t.trim()) : undefined,
          fileData: base64,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileSize: selectedFile.size,
        });

        toast.success("Resource uploaded successfully!");
        setUploadData({ title: "", description: "", category: "Documentation", tags: "" });
        setSelectedFile(null);
        setShowUploadForm(false);
        refetch();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload resource");
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      await downloadMutation.mutateAsync({ resourceId: resource.id });
      window.open(resource.fileUrl, "_blank");
    } catch (error: any) {
      toast.error("Failed to download resource");
    }
  };

  const handleDelete = async (resourceId: number) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteMutation.mutateAsync({ resourceId });
        toast.success("Resource deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error("Failed to delete resource");
      }
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">TEAM RESOURCES</h3>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-red-700 transition"
        >
          <Upload size={16} />
          Upload Resource
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="border border-[#e63946]/30 p-6 bg-white/5 rounded">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1d24] border border-white/20 text-white rounded text-sm"
                  placeholder="Resource title"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                  Category
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1d24] border border-white/20 text-white rounded text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                Description
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1d24] border border-white/20 text-white rounded text-sm"
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={uploadData.tags}
                onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1d24] border border-white/20 text-white rounded text-sm"
                placeholder="e.g., web, exploit, python"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#e63946] tracking-widest uppercase mb-2">
                File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 bg-[#1a1d24] border border-white/20 text-white rounded text-sm"
              />
              {selectedFile && (
                <p className="text-xs text-green-400 mt-2">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="px-4 py-2 bg-[#e63946] text-white font-mono text-sm tracking-widest uppercase hover:bg-red-700 disabled:opacity-50 transition"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 border border-white/20 text-white font-mono text-sm tracking-widest uppercase hover:border-white/40 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 font-mono text-xs tracking-widest uppercase rounded transition ${
            selectedCategory === "all"
              ? "bg-[#e63946] text-white"
              : "border border-white/20 text-white/60 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 font-mono text-xs tracking-widest uppercase rounded transition ${
              selectedCategory === cat
                ? "bg-[#e63946] text-white"
                : "border border-white/20 text-white/60 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-400">Loading resources...</div>
        ) : resources && resources.length > 0 ? (
          resources.map((resource: Resource) => (
            <div
              key={resource.id}
              className="border border-[#e63946]/30 p-4 hover:border-[#e63946]/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-[#e63946]">{categoryIcons[resource.category]}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{resource.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{resource.fileName}</p>
                  </div>
                </div>
              </div>

              {resource.description && (
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{resource.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`px-2 py-1 text-xs rounded border ${
                    categoryColors[resource.category] || "bg-gray-500/20 text-gray-400 border-gray-500/50"
                  }`}
                >
                  {resource.category}
                </span>
                {resource.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span>{formatFileSize(resource.fileSize)}</span>
                <span>{resource.downloadCount} downloads</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(resource)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#e63946]/20 text-[#e63946] font-mono text-xs tracking-widest uppercase hover:bg-[#e63946]/30 transition rounded"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="px-3 py-2 text-white/50 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-400">
            No resources yet. Upload one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
