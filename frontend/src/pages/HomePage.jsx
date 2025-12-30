import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { ArrowRight, Moon, Brain, Sparkles, BookOpen, Heart, FlaskConical } from 'lucide-react';

const categoryIcons = {
  'sleep-rest': Moon,
  'mental-health': Brain,
  'stress-anxiety': Heart,
  'productivity-focus': Sparkles,
  'lifestyle-habits': BookOpen,
  'research-studies': FlaskConical,
};

const categoryImages = {
  'sleep-rest': 'https://images.unsplash.com/photo-1758243954982-cd1d5a8b9f97?w=600',
  'mental-health': 'https://images.unsplash.com/photo-1758274539654-23fa349cc090?w=600',
  'stress-anxiety': 'https://images.unsplash.com/photo-1665764356520-3daa0e8326b1?w=600',
  'productivity-focus': 'https://images.unsplash.com/photo-1700554565325-aea824405166?w=600',
  'lifestyle-habits': 'https://images.unsplash.com/photo-1628743270481-123e2501e518?w=600',
  'research-studies': 'https://images.unsplash.com/photo-1692035072849-93a511f35b2c?w=600',
};

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          articlesAPI.getAll({ limit: 12 }),
          categoriesAPI.getAll(),
        ]);
        
        const allArticles = articlesRes.data;
        setFeaturedArticles(allArticles.filter(a => a.is_featured).slice(0, 3));
        setArticles(allArticles.filter(a => !a.is_featured).slice(0, 6));
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1578258691902-327e3c08b7e9?w=1920"
            alt="Calm nature landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 animate-fade-in">
              <span className="inline-block bg-[#7C9A92]/10 text-[#7C9A92] text-sm font-medium px-4 py-2 rounded-full mb-6">
                Science-Backed Wellness
              </span>
              <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2D3748] leading-tight mb-6">
                Better Sleep,{' '}
                <span className="text-gradient">Mental Clarity</span>,{' '}
                Daily Productivity
              </h1>
              <p className="text-lg md:text-xl text-[#4A5568] mb-8 max-w-xl leading-relaxed">
                Discover evidence-based insights to improve your sleep quality, 
                mental well-being, and daily performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/category/sleep-rest"
                  className="btn-primary inline-flex items-center gap-2"
                  data-testid="hero-cta-primary"
                >
                  Start Reading <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/weekly-updates"
                  className="btn-secondary inline-flex items-center gap-2"
                  data-testid="hero-cta-secondary"
                >
                  Weekly Updates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 md:py-24 bg-white" data-testid="featured-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[#7C9A92] text-sm font-medium uppercase tracking-wider">
                  Featured
                </span>
                <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#2D3748] mt-2">
                  Editor's Picks
                </h2>
              </div>
              <Link
                to="/weekly-updates"
                className="hidden sm:inline-flex items-center gap-2 text-[#7C9A92] font-medium hover:gap-3 transition-all"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className={`animate-slide-up stagger-${index + 1}`}
                  style={{ opacity: 0 }}
                >
                  <ArticleCard article={article} variant="featured" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="py-16 md:py-24 bg-[#FAFAF9]" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#7C9A92] text-sm font-medium uppercase tracking-wider">
              Explore Topics
            </span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#2D3748] mt-2">
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || BookOpen;
              const image = categoryImages[category.slug];
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="category-card group aspect-[4/3] rounded-2xl overflow-hidden"
                  data-testid={`category-card-${category.slug}`}
                >
                  <img
                    src={image || category.image_url}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="category-card-content absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg md:text-xl">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mt-1 line-clamp-2 hidden md:block">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {articles.length > 0 && (
        <section className="py-16 md:py-24 bg-white" data-testid="articles-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[#7C9A92] text-sm font-medium uppercase tracking-wider">
                  Latest Articles
                </span>
                <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#2D3748] mt-2">
                  Recent Insights
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad Placeholder */}
      <section className="py-8 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ad-container relative rounded-xl min-h-[120px]">
            <span className="text-stone-400 text-sm">Advertisement Space</span>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-white" data-testid="newsletter-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
