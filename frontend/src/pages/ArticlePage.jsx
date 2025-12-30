import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesAPI } from '@/lib/api';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { ArticleCard } from '@/components/ArticleCard';
import { ChevronRight, Clock, Calendar, RefreshCw, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const articleRes = await articlesAPI.getBySlug(slug);
        setArticle(articleRes.data);
        
        // Fetch related articles
        if (articleRes.data.category) {
          const relatedRes = await articlesAPI.getAll({ 
            category: articleRes.data.category.slug,
            limit: 4 
          });
          setRelatedArticles(
            relatedRes.data.filter(a => a.slug !== slug).slice(0, 3)
          );
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById('article-content');
      if (article) {
        const scrollTop = window.scrollY;
        const docHeight = article.offsetHeight - window.innerHeight;
        const progress = Math.min((scrollTop / docHeight) * 100, 100);
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareUrl = window.location.href;
  const shareText = article?.title || '';

  const handleShare = (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-[#2D3748] mb-4">
          Article Not Found
        </h1>
        <p className="text-[#718096] mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const createdDate = format(new Date(article.created_at), 'MMMM d, yyyy');
  const updatedDate = article.updated_at 
    ? format(new Date(article.updated_at), 'MMMM d, yyyy')
    : null;

  return (
    <div data-testid="article-page">
      {/* Reading Progress */}
      <div 
        className="reading-progress" 
        style={{ width: `${readingProgress}%` }} 
      />

      {/* Breadcrumb */}
      <div className="bg-[#FAFAF9] py-4 border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-[#718096] hover:text-[#7C9A92]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#718096]" />
            {article.category && (
              <>
                <Link 
                  to={`/category/${article.category.slug}`} 
                  className="text-[#718096] hover:text-[#7C9A92]"
                >
                  {article.category.name}
                </Link>
                <ChevronRight className="w-4 h-4 text-[#718096]" />
              </>
            )}
            <span className="text-[#2D3748] font-medium line-clamp-1">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-12 md:py-16 bg-[#FAFAF9]" data-testid="article-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {article.category && (
            <Link 
              to={`/category/${article.category.slug}`}
              className="inline-block bg-[#7C9A92]/10 text-[#7C9A92] text-sm font-medium px-4 py-1.5 rounded-full mb-6 hover:bg-[#7C9A92]/20 transition-colors"
            >
              {article.category.name}
            </Link>
          )}
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2D3748] leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-lg md:text-xl text-[#4A5568] mb-8">
            {article.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#718096]">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.reading_time} min read
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {createdDate}
            </span>
            {updatedDate && updatedDate !== createdDate && (
              <span className="flex items-center gap-2 text-[#7C9A92]">
                <RefreshCw className="w-4 h-4" />
                Updated {updatedDate}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-12">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full aspect-[21/9] object-cover rounded-2xl shadow-lg"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="py-8 md:py-12 bg-white" id="article-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* What's New Section */}
              {article.whats_new && (
                <div className="bg-[#E8E1D5]/50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-[#2D3748] mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#7C9A92]" />
                    What's New This Week
                  </h3>
                  <p className="text-[#4A5568]">{article.whats_new}</p>
                </div>
              )}

              {/* Article Body */}
              <div 
                className="article-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Last Updated */}
              {updatedDate && (
                <div className="mt-12 pt-6 border-t border-stone-200">
                  <p className="text-sm text-[#718096]">
                    <strong>Last updated:</strong> {updatedDate}
                  </p>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-stone-200">
                <div className="flex items-center gap-4">
                  <span className="text-[#718096] flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share:
                  </span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-[#4A5568] hover:bg-[#1877F2] hover:text-white transition-colors"
                    aria-label="Share on Facebook"
                    data-testid="share-facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-[#4A5568] hover:bg-[#1DA1F2] hover:text-white transition-colors"
                    aria-label="Share on Twitter"
                    data-testid="share-twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-[#4A5568] hover:bg-[#0A66C2] hover:text-white transition-colors"
                    aria-label="Share on LinkedIn"
                    data-testid="share-linkedin"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Newsletter */}
                <div className="bg-[#FAFAF9] rounded-xl p-6">
                  <h3 className="font-semibold text-[#2D3748] mb-4">
                    Get Weekly Updates
                  </h3>
                  <NewsletterSignup variant="compact" />
                </div>

                {/* Ad Space */}
                <div className="ad-container relative rounded-xl min-h-[250px]">
                  <span className="text-stone-400 text-sm">Advertisement</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-[#FAFAF9]" data-testid="related-articles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#2D3748] mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
