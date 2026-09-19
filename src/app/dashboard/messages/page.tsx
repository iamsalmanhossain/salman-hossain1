"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactService } from "@/services/contact.service";
import { Mail, MailOpen, Trash2, Loader2, Calendar, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { ContactMessage } from "@/types/contact";

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["messages", page, filter],
    queryFn: () => ContactService.getMessages({ 
      page, 
      limit: 10,
      status: filter === "ALL" ? undefined : filter
    }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => ContactService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
    },
    onError: () => {
      toast.error("Failed to mark message as read");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ContactService.deleteMessage(id),
    onSuccess: () => {
      toast.success("Message deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
    },
    onError: () => {
      toast.error("Failed to delete message");
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const messages = messagesData?.data || [];
  const meta = messagesData?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-500" /> Contact Messages
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to messages from your website.</p>
        </div>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Messages</option>
          <option value="UNREAD">Unread Only</option>
          <option value="READ">Read Only</option>
        </select>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/10">
          <MailOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No messages found</h3>
          <p className="text-gray-500">You don't have any messages matching the current filter.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4">Status</th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {messages.map((msg: ContactMessage) => (
                  <tr 
                    key={msg.id} 
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'UNREAD') {
                        markAsReadMutation.mutate(msg.id);
                      }
                    }}
                    className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${msg.status === 'UNREAD' ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''}`}
                  >
                    <td className="p-4">
                      {msg.status === 'UNREAD' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          Read
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
                      <div className="text-sm text-gray-500">{msg.email}</div>
                    </td>
                    <td className="p-4 max-w-md">
                      {msg.subject && <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">{msg.subject}</div>}
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{msg.message}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(msg.createdAt).toLocaleString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric', 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(msg);
                            if (msg.status === 'UNREAD') {
                              markAsReadMutation.mutate(msg.id);
                            }
                          }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {msg.status === 'UNREAD' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsReadMutation.mutate(msg.id);
                            }}
                            disabled={markAsReadMutation.isPending}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Mark as Read"
                          >
                            <MailOpen className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMessageToDelete(msg.id);
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && (meta.totalPage ?? 0) > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {meta.totalPage ?? 1}
          </span>
          <button
            disabled={page === (meta.totalPage ?? 1)}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-white/10 shrink-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Message Details</h2>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">From</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMessage.name}</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm text-blue-500 hover:underline">{selectedMessage.email}</a>
                </div>
                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date Received</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedMessage.createdAt).toLocaleString(undefined, { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Subject</p>
                <div className="text-gray-900 dark:text-white font-medium p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                  {selectedMessage.subject || <span className="text-gray-400 italic">No subject provided</span>}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Message</p>
                <div className="text-gray-700 dark:text-gray-300 p-4 sm:p-6 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-white/10 shrink-0 flex items-center justify-between bg-gray-50 dark:bg-black/40">
              <button
                onClick={() => {
                  setMessageToDelete(selectedMessage.id);
                }}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium text-sm cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden text-center p-6 sm:p-8 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Message?</h3>
            <p className="text-gray-500 text-sm mb-8">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMessageToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(messageToDelete);
                  setMessageToDelete(null);
                  if (selectedMessage && selectedMessage.id === messageToDelete) {
                    setSelectedMessage(null);
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
