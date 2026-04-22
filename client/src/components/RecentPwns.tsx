import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { Trophy, Clock, Zap } from "lucide-react";

interface RecentPwn {
  username: string;
  challengeName: string;
  category: string;
  date: string;
  points: number;
}

export default function RecentPwns() {
  const { t } = useTranslation();
  const { data: pwns = [], isLoading } = trpc.htb.getLatestPwns.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-800/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!pwns || pwns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No recent pwns yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pwns.map((pwn, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-red-900/20 to-red-900/10 border border-red-900/30 rounded-lg p-4 hover:border-red-700/50 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-red-500" />
                <h3 className="font-bold text-white text-sm">{pwn.username}</h3>
              </div>
              <p className="text-gray-300 text-sm mb-2">{pwn.challengeName}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="px-2 py-1 bg-red-900/30 rounded text-red-300">
                  {pwn.category}
                </span>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {pwn.date}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Zap size={16} />
              {pwn.points}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
