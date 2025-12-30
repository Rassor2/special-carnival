import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryRes, articlesRes] = await Promise.all([
          categoriesAPI.getBySlug(slug),
          articlesAPI.getAll({ category: slug }),
        ]);
        setCategory(categoryRes.data);
        setArticles(articlesRes.data);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-[#2D3748] mb-4">
          Category Not Found
        </h1>
        <p className="text-[#718096] mb-6">
          The category you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="category-page">
      {/* Breadcrumb */}
      <div className="bg-[#FAFAF9] py-4 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#718096] hover:text-[#7C9A92]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#718096]" />
            <span className="text-[#2D3748] font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="py-12 md:py-16 bg-[#FAFAF9]" data-testid="category-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2D3748] mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-[#4A5568] leading-relaxed">
              {category.description}
            </p>
            {articles.length > 0 && (
              <p className="text-[#718096] mt-4">
                {articles.length} article{articles.length !== 1 ? 's' : ''} in this category
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#718096] text-lg mb-4">
                No articles in this category yet.
              </p>
              <Link to="/" className="btn-outline">
                Browse All Articles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Ad Placeholder */}
      <section className="py-8 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ad-container relative rounded-xl min-h-[120px]">
            <span className="text-stone-400 text-sm">Advertisement Space</span>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup interests={[slug]} />
        </div>
      </section>
    </div>
  );
}
