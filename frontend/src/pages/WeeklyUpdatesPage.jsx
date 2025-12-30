import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { RefreshCw, ChevronRight } from 'lucide-react';

export default function WeeklyUpdatesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await articlesAPI.getWeeklyUpdates();
        setArticles(res.data);
      } catch (error) {
        console.error('Failed to fetch weekly updates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div data-testid="weekly-updates-page">
      {/* Breadcrumb */}
      <div className="bg-[#FAFAF9] py-4 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#718096] hover:text-[#7C9A92]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#718096]" />
            <span className="text-[#2D3748] font-medium">Weekly Updates</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 md:py-16 bg-[#FAFAF9]" data-testid="weekly-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="w-14 h-14 bg-[#7C9A92]/10 rounded-full flex items-center justify-center mb-6">
              <RefreshCw className="w-7 h-7 text-[#7C9A92]" />
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2D3748] mb-4">
              Weekly Updates
            </h1>
            <p className="text-lg text-[#4A5568] leading-relaxed">
              Stay current with our recently updated articles. We refresh our content weekly 
              to bring you the latest research and insights on sleep, mental health, and productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Updated Articles */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-[#718096]">
                  {articles.length} article{articles.length !== 1 ? 's' : ''} updated this week
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <RefreshCw className="w-12 h-12 text-[#718096] mx-auto mb-4" />
              <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#2D3748] mb-2">
                No Updates This Week
              </h3>
              <p className="text-[#718096] mb-6">
                Check back soon for fresh content updates.
              </p>
              <Link to="/" className="btn-primary">
                Browse All Articles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
