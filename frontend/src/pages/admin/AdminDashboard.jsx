import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, articlesAPI, subscribersAPI } from '@/lib/api';
import { FileText, Users, Eye, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, articlesRes, subscribersRes] = await Promise.all([
          statsAPI.getDashboard(),
          articlesAPI.getAllAdmin(),
          subscribersAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setRecentArticles(articlesRes.data.slice(0, 5));
        setRecentSubscribers(subscribersRes.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Articles',
      value: stats?.total_articles || 0,
      icon: FileText,
      color: 'text-[#7C9A92]',
      bgColor: 'bg-[#7C9A92]/10',
    },
    {
      label: 'Published',
      value: stats?.published_articles || 0,
      icon: TrendingUp,
      color: 'text-[#48BB78]',
      bgColor: 'bg-[#48BB78]/10',
    },
    {
      label: 'Subscribers',
      value: stats?.total_subscribers || 0,
      icon: Users,
      color: 'text-[#8FB8DE]',
      bgColor: 'bg-[#8FB8DE]/10',
    },
    {
      label: 'Total Views',
      value: stats?.total_views || 0,
      icon: Eye,
      color: 'text-[#ED8936]',
      bgColor: 'bg-[#ED8936]/10',
    },
  ];

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#2D3748]">
          Dashboard
        </h1>
        <p className="text-[#718096] mt-1">
          Overview of your content and audience
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="dashboard-stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-semibold text-[#2D3748]">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-[#718096] mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[#2D3748]">Recent Articles</h2>
            <Link
              to="/admin/articles"
              className="text-sm text-[#7C9A92] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2D3748] truncate">{article.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[#718096] mt-1">
                      <span>{article.views || 0} views</span>
                      <span>
                        {article.is_published ? (
                          <span className="text-[#48BB78]">Published</span>
                        ) : (
                          <span className="text-[#ED8936]">Draft</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/admin/articles/edit/${article.id}`}
                    className="text-[#7C9A92] hover:text-[#6A857D] text-sm"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-[#718096] text-center py-8">No articles yet</p>
            )}
          </div>
        </div>

        {/* Recent Subscribers */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[#2D3748]">Recent Subscribers</h2>
            <Link
              to="/admin/subscribers"
              className="text-sm text-[#7C9A92] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentSubscribers.length > 0 ? (
              recentSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#7C9A92]/10 rounded-full flex items-center justify-center text-[#7C9A92] font-medium">
                    {subscriber.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2D3748] truncate">{subscriber.email}</p>
                    <p className="text-xs text-[#718096] mt-0.5">
                      {format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {subscriber.interests.length > 0 && (
                    <div className="flex gap-1">
                      {subscriber.interests.slice(0, 2).map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-stone-100 text-[#718096] px-2 py-1 rounded"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#718096] text-center py-8">No subscribers yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-[#E8E1D5]/50 rounded-2xl">
        <h3 className="font-semibold text-[#2D3748] mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/articles/new" className="btn-primary">
            Create New Article
          </Link>
          <Link to="/admin/categories" className="btn-secondary">
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
