"use client";

import { motion } from "framer-motion";
import { FolderGit2, Briefcase, FileText, Eye, TrendingUp, MessageSquare, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";

export default function DashboardOverview() {
  const { data: statsRes, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => DashboardService.getStats()
  });

  const { data: activitiesRes, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['dashboardActivities'],
    queryFn: () => DashboardService.getActivities()
  });

  if (isLoadingStats || isLoadingActivities) {
    return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  const s = statsRes?.data;
  const activities = activitiesRes?.data || [];

  const stats = [
    { label: "Total Views", value: s?.totalViews || 0, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Visitors", value: s?.activeVisitors || 0, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Projects", value: s?.totalProjects || 0, icon: FolderGit2, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Messages", value: s?.totalMessages || 0, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Welcome back, Admin!</h2>
        <p className="text-gray-600 dark:text-gray-400">Here is what is happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-[#1A1C23] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-black dark:text-white">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1C23] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-black dark:text-white">Visitor Analytics</h3>
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <div className="w-full h-[300px] bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-center">
            <p className="text-gray-400">Chart implementation pending...</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1A1C23] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-bold text-black dark:text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-6">
            {activities.length > 0 ? activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  {index !== activities.length - 1 && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[2px] h-10 bg-gray-200 dark:bg-white/10" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleString()}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">No recent activities found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
