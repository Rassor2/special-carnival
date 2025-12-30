import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react';
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

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        articlesAPI.getAllAdmin(),
        categoriesAPI.getAll(),
      ]);
      setArticles(articlesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await articlesAPI.delete(deleteId);
      setArticles(articles.filter((a) => a.id !== deleteId));
      toast.success('Article deleted');
    } catch (error) {
      toast.error('Failed to delete article');
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublished = async (article) => {
    try {
      await articlesAPI.update(article.id, { is_published: !article.is_published });
      setArticles(
        articles.map((a) =>
          a.id === article.id ? { ...a, is_published: !a.is_published } : a
        )
      );
      toast.success(article.is_published ? 'Article unpublished' : 'Article published');
    } catch (error) {
      toast.error('Failed to update article');
    }
  };

  const toggleFeatured = async (article) => {
    try {
      await articlesAPI.update(article.id, { is_featured: !article.is_featured });
      setArticles(
        articles.map((a) =>
          a.id === article.id ? { ...a, is_featured: !a.is_featured } : a
        )
      );
      toast.success(article.is_featured ? 'Removed from featured' : 'Added to featured');
    } catch (error) {
      toast.error('Failed to update article');
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div data-testid="admin-articles">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#2D3748]">
            Articles
          </h1>
          <p className="text-[#718096] mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link to="/admin/articles/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Article
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="input-default w-full pl-12"
            data-testid="articles-search-input"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                          {article.featured_image && (
                            <img
                              src={article.featured_image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#2D3748] truncate max-w-xs">
                            {article.title}
                          </p>
                          <p className="text-xs text-[#718096]">
                            {article.reading_time} min read
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{getCategoryName(article.category_id)}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {article.is_published ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#48BB78] bg-[#48BB78]/10 px-2 py-1 rounded-full">
                            <Eye className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#718096] bg-stone-100 px-2 py-1 rounded-full">
                            <EyeOff className="w-3 h-3" /> Draft
                          </span>
                        )}
                        {article.is_featured && (
                          <span className="inline-flex items-center gap-1 text-xs text-[#ED8936] bg-[#ED8936]/10 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{article.views || 0}</td>
                    <td className="text-sm text-[#718096]">
                      {format(new Date(article.updated_at), 'MMM d, yyyy')}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured(article)}
                          className={`p-2 rounded-lg transition-colors ${
                            article.is_featured
                              ? 'text-[#ED8936] hover:bg-[#ED8936]/10'
                              : 'text-[#718096] hover:bg-stone-100'
                          }`}
                          title={article.is_featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {article.is_featured ? (
                            <StarOff className="w-5 h-5" />
                          ) : (
                            <Star className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => togglePublished(article)}
                          className={`p-2 rounded-lg transition-colors ${
                            article.is_published
                              ? 'text-[#48BB78] hover:bg-[#48BB78]/10'
                              : 'text-[#718096] hover:bg-stone-100'
                          }`}
                          title={article.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {article.is_published ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        <Link
                          to={`/admin/articles/edit/${article.id}`}
                          className="p-2 rounded-lg text-[#7C9A92] hover:bg-[#7C9A92]/10 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(article.id)}
                          className="p-2 rounded-lg text-[#F56565] hover:bg-[#F56565]/10 transition-colors"
                          data-testid={`delete-article-${article.id}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#718096]">
                    {searchTerm ? 'No articles match your search' : 'No articles yet'}
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
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#F56565] hover:bg-[#E53E3E]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
