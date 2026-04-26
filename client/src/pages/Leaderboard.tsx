import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Zap, Target } from "lucide-react";

type TierType = "bronze" | "silver" | "gold" | "platinum";

const tierColors: Record<TierType, { bg: string; text: string; border: string; icon: string }> = {
  bronze: { bg: "bg-amber-900/20", text: "text-amber-600", border: "border-amber-600", icon: "🥉" },
  silver: { bg: "bg-gray-400/20", text: "text-gray-400", border: "border-gray-400", icon: "🥈" },
  gold: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500", icon: "🥇" },
  platinum: { bg: "bg-purple-500/20", text: "text-purple-500", border: "border-purple-500", icon: "👑" },
};

export default function Leaderboard() {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<TierType | null>(null);

  // Fetch leaderboard data
  const { data: leaderboardResponse, isLoading } = trpc.leaderboard.getLeaderboard.useQuery();
  const { data: statsResponse } = trpc.leaderboard.getLeaderboardStats.useQuery();

  const leaderboard = leaderboardResponse?.data || [];
  const stats = statsResponse?.data;

  // Filter by tier if selected
  const filteredLeaderboard = useMemo(() => {
    if (!selectedTier) return leaderboard;
    return leaderboard.filter((member) => member.tier === selectedTier);
  }, [leaderboard, selectedTier]);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {t("leaderboard.title", "Team Leaderboard")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {t("leaderboard.subtitle", "Rank members by flags captured, challenges solved, and total points")}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <Card className="p-6 border-red-500/30 bg-red-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("leaderboard.totalMembers", "Total Members")}
                  </p>
                  <p className="text-3xl font-bold text-red-500">{stats.totalMembers}</p>
                </div>
                <Target className="w-8 h-8 text-red-500/50" />
              </div>
            </Card>

            <Card className="p-6 border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("leaderboard.averageFlags", "Avg Flags")}
                  </p>
                  <p className="text-3xl font-bold text-yellow-500">{stats.averageFlags}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500/50" />
              </div>
            </Card>

            <Card className="p-6 border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("leaderboard.averagePoints", "Avg Points")}
                  </p>
                  <p className="text-3xl font-bold text-blue-500">{stats.averagePoints}</p>
                </div>
                <Medal className="w-8 h-8 text-blue-500/50" />
              </div>
            </Card>

            <Card className="p-6 border-purple-500/30 bg-purple-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("leaderboard.topMember", "Top Member")}
                  </p>
                  <p className="text-lg font-bold text-purple-500 truncate">
                    {stats.topMember?.memberName || "—"}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-purple-500/50" />
              </div>
            </Card>
          </div>
        )}

        {/* Tier Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedTier === null ? "default" : "outline"}
            onClick={() => setSelectedTier(null)}
            className="rounded-full"
          >
            {t("leaderboard.allMembers", "All Members")} ({leaderboard.length})
          </Button>

          {Object.entries(tierColors).map(([tier, colors]) => (
            <Button
              key={tier}
              variant={selectedTier === tier ? "default" : "outline"}
              onClick={() => setSelectedTier(tier as TierType)}
              className={`rounded-full ${selectedTier === tier ? "" : colors.text}`}
            >
              {tierColors[tier as TierType].icon} {tier.charAt(0).toUpperCase() + tier.slice(1)} (
              {leaderboard.filter((m) => m.tier === tier).length})
            </Button>
          ))}
        </div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("leaderboard.loading", "Loading leaderboard...")}</p>
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-muted-foreground mb-2">{t("leaderboard.empty", "No members found")}</p>
            <p className="text-sm text-muted-foreground">
              {selectedTier
                ? t("leaderboard.noMembersInTier", "No members in this tier yet")
                : t("leaderboard.noMembers", "Start adding team members to the leaderboard")}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLeaderboard.map((member, index) => {
              const tier = (member.tier || "bronze") as TierType;
              const tierColor = tierColors[tier];
              const isTopThree = index < 3;

              return (
                <Card
                  key={member.id}
                  className={`p-4 md:p-6 border-l-4 transition-all hover:shadow-lg ${tierColor.border} ${
                    isTopThree ? tierColor.bg : "bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-lg text-white">
                      {member.rankPosition || index + 1}
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {member.memberAvatar && (
                          <img
                            src={member.memberAvatar}
                            alt={member.memberName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-lg truncate">{member.memberName}</p>
                          <p className="text-sm text-muted-foreground">@{member.memberUsername}</p>
                        </div>
                      </div>

                      {/* Specialties */}
                      {member.memberSpecialties && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.memberSpecialties.split(",").map((specialty, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                            >
                              {specialty.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex-shrink-0 grid grid-cols-3 gap-4 md:gap-6">
                      <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-red-500">
                          {member.totalFlags || 0}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {t("leaderboard.flags", "Flags")}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-blue-500">
                          {member.totalChallenges || 0}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {t("leaderboard.challenges", "Challenges")}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-yellow-500">
                          {member.totalPoints || 0}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {t("leaderboard.points", "Points")}
                        </p>
                      </div>
                    </div>

                    {/* Tier Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${tierColor.bg} ${tierColor.text}`}
                      >
                        {tierColors[tier].icon} {tier.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
