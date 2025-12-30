import { useState, useEffect } from 'react';
import { subscribersAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Search, Trash2, Download, Mail, Users } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subscribersRes, statsRes] = await Promise.all([
        subscribersAPI.getAll(),
        subscribersAPI.getStats(),
      ]);
      setSubscribers(subscribersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await subscribersAPI.unsubscribe(deleteId);
      setSubscribers(subscribers.filter((s) => s.id !== deleteId));
      toast.success('Subscriber removed');
    } catch (error) {
      toast.error('Failed to remove subscriber');
    } finally {
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Interests', 'Subscribed At'],
      ...subscribers.map((s) => [
        s.email,
        s.interests.join('; '),
        format(new Date(s.subscribed_at), 'yyyy-MM-dd HH:mm'),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Subscribers exported');
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div data-testid="admin-subscribers">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#2D3748]">
            Subscribers
          </h1>
          <p className="text-[#718096] mt-1">
            {stats?.total || 0} active subscriber{stats?.total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center gap-2"
          data-testid="export-subscribers-btn"
        >
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7C9A92]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#7C9A92]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#2D3748]">{stats.total}</p>
                <p className="text-xs text-[#718096]">Total</p>
              </div>
            </div>
          </div>
          {Object.entries(stats.by_interest || {}).map(([interest, count]) => (
            <div
              key={interest}
              className="bg-white rounded-xl p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8FB8DE]/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#8FB8DE]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#2D3748]">{count}</p>
                  <p className="text-xs text-[#718096] capitalize">{interest}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email..."
            className="input-default w-full pl-12"
            data-testid="subscribers-search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Interests</th>
                <th>Subscribed</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#7C9A92]/10 rounded-full flex items-center justify-center text-[#7C9A92] text-sm font-medium">
                          {subscriber.email.charAt(0).toUpperCase()}
                        </div>
                        <span>{subscriber.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {subscriber.interests.length > 0 ? (
                          subscriber.interests.map((interest) => (
                            <span
                              key={interest}
                              className="text-xs bg-stone-100 text-[#718096] px-2 py-1 rounded capitalize"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#718096]">All topics</span>
                        )}
                      </div>
                    </td>
                    <td className="text-sm text-[#718096]">
                      {format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setDeleteId(subscriber.id)}
                          className="p-2 rounded-lg text-[#F56565] hover:bg-[#F56565]/10 transition-colors"
                          data-testid={`delete-subscriber-${subscriber.id}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-[#718096]">
                    {searchTerm ? 'No subscribers match your search' : 'No subscribers yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this subscriber? They will no longer receive
              newsletter emails.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#F56565] hover:bg-[#E53E3E]"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
