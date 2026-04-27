import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, LogOut, Lock, User, Trash2, Download } from "lucide-react";

interface ActivityLogEntry {
  id: number;
  teamMemberId: number;
  action: string;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  success: number;
  timestamp: Date;
}

const actionIcons: Record<string, React.ReactNode> = {
  login: <LogOut className="w-4 h-4 text-green-500" />,
  login_failed: <AlertCircle className="w-4 h-4 text-red-500" />,
  credential_created: <Lock className="w-4 h-4 text-blue-500" />,
  credential_reset: <Lock className="w-4 h-4 text-yellow-500" />,
  credential_deactivated: <Lock className="w-4 h-4 text-orange-500" />,
  member_deleted: <Trash2 className="w-4 h-4 text-red-600" />,
  member_added: <User className="w-4 h-4 text-green-500" />,
};

const actionLabels: Record<string, string> = {
  login: "Login",
  login_failed: "Failed Login",
  credential_created: "Credential Created",
  credential_reset: "Password Reset",
  credential_deactivated: "Credential Deactivated",
  member_deleted: "Member Deleted",
  member_added: "Member Added",
};

export default function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [limit, setLimit] = useState(50);

  const { data: activityLogs, isLoading } = trpc.admin.getActivityLog.useQuery({
    action: filter !== "all" ? filter : undefined,
    limit,
  });

  useEffect(() => {
    if (activityLogs) {
      setLogs(activityLogs);
    }
  }, [activityLogs]);

  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "login", label: "Logins" },
    { value: "login_failed", label: "Failed Logins" },
    { value: "credential_created", label: "Credentials Created" },
    { value: "credential_reset", label: "Password Resets" },
    { value: "credential_deactivated", label: "Credentials Deactivated" },
    { value: "member_deleted", label: "Members Deleted" },
  ];

  const handleExportCSV = () => {
    if (logs.length === 0) return;

    // Create CSV header
    const headers = ["ID", "Action", "Details", "Status", "Timestamp", "IP Address", "User Agent"];
    const rows = logs.map((log) => [
      log.id,
      actionLabels[log.action] || log.action,
      log.details || "",
      log.success === 1 ? "Success" : "Failed",
      format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss"),
      log.ipAddress || "",
      log.userAgent || "",
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const str = String(cell);
            return str.includes(",") || str.includes('"')
              ? `"${str.replace(/"/g, '""')}"`
              : str;
          })
          .join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `activity-log-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">ACTIVITY LOG</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-[#e63946] text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Export activity log as CSV"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-[#1a1d24] border border-[#e63946] text-white rounded text-sm flex-1 max-w-xs"
          >
            {actionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e63946]">
              <th className="text-left px-4 py-3 text-[#e63946] font-bold">ACTION</th>
              <th className="text-left px-4 py-3 text-[#e63946] font-bold">DETAILS</th>
              <th className="text-left px-4 py-3 text-[#e63946] font-bold">STATUS</th>
              <th className="text-left px-4 py-3 text-[#e63946] font-bold">TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Loading activity log...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No activity recorded yet
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[#2a2d34] hover:bg-[#1a1d24] transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {actionIcons[log.action] || <AlertCircle className="w-4 h-4" />}
                      <span className="text-white font-medium">
                        {actionLabels[log.action] || log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{log.details || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {log.success === 1 ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Success</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-500">Failed</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {logs.length > 0 && logs.length >= limit && (
        <button
          onClick={() => setLimit(limit + 50)}
          className="w-full px-4 py-2 bg-[#e63946] text-white font-bold rounded hover:bg-red-700 transition"
        >
          LOAD MORE
        </button>
      )}
    </div>
  );
}
