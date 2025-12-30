import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export const ArticleCard = ({ article, variant = 'default' }) => {
  const formattedDate = article.updated_at 
    ? format(new Date(article.updated_at), 'MMM d, yyyy')
    : format(new Date(article.created_at), 'MMM d, yyyy');

  if (variant === 'featured') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="card-article group block"
        data-testid={`article-card-${article.slug}`}
      >
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={article.featured_image || 'https://images.unsplash.com/photo-1578258691902-327e3c08b7e9?w=800'}
              alt={article.title}
              className="article-card-image w-full h-full object-cover"
            />
          </div>
          {article.is_featured && (
            <span className="featured-badge absolute top-4 left-4 text-white text-xs font-medium px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-[#718096] mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.reading_time} min read
            </span>
            <span>{formattedDate}</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-semibold mb-3 group-hover:text-[#7C9A92] transition-colors">
            {article.title}
          </h3>
          <p className="text-[#4A5568] line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 text-[#7C9A92] font-medium text-sm group-hover:gap-3 transition-all">
            Read Article <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group flex gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors"
        data-testid={`article-card-${article.slug}`}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={article.featured_image || 'https://images.unsplash.com/photo-1578258691902-327e3c08b7e9?w=200'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#2D3748] group-hover:text-[#7C9A92] transition-colors line-clamp-2 mb-1">
            {article.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-[#718096]">
            <span>{article.reading_time} min</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/article/${article.slug}`}
      className="card-article group block"
      data-testid={`article-card-${article.slug}`}
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={article.featured_image || 'https://images.unsplash.com/photo-1578258691902-327e3c08b7e9?w=600'}
          alt={article.title}
          className="article-card-image w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-sm text-[#718096] mb-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.reading_time} min
          </span>
          {article.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views}
            </span>
          )}
        </div>
        <h3 className="font-['Playfair_Display'] text-lg font-semibold mb-2 group-hover:text-[#7C9A92] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[#4A5568] text-sm line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
