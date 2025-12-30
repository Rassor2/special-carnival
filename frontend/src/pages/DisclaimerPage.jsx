import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentAPI } from '@/lib/api';
import { ChevronRight, AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await contentAPI.getPage('disclaimer');
        setContent(res.data);
      } catch (error) {
        console.error('Failed to fetch disclaimer:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div data-testid="disclaimer-page">
      {/* Breadcrumb */}
      <div className="bg-[#FAFAF9] py-4 border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#718096] hover:text-[#7C9A92]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#718096]" />
            <span className="text-[#2D3748] font-medium">Disclaimer</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 md:py-16 bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-14 h-14 bg-[#ED8936]/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-7 h-7 text-[#ED8936]" />
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#2D3748]">
            Disclaimer
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="article-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content?.content?.replace(/\n/g, '<br />') || '' }}
          />
        </div>
      </section>
    </div>
  );
}
