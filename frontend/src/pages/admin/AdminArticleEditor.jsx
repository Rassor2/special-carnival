import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    is_featured: false,
    is_published: true,
    reading_time: 5,
    whats_new: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await categoriesAPI.getAll();
        setCategories(categoriesRes.data);

        if (isEditing) {
          const articlesRes = await articlesAPI.getAllAdmin();
          const article = articlesRes.data.find((a) => a.id === id);
          if (article) {
            setFormData({
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              category_id: article.category_id,
              featured_image: article.featured_image || '',
              meta_title: article.meta_title || '',
              meta_description: article.meta_description || '',
              is_featured: article.is_featured,
              is_published: article.is_published,
              reading_time: article.reading_time,
              whats_new: article.whats_new || '',
            });
          }
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      meta_title: prev.meta_title || title,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await articlesAPI.update(id, formData);
        toast.success('Article updated');
      } else {
        await articlesAPI.create(formData);
        toast.success('Article created');
      }
      navigate('/admin/articles');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div data-testid="admin-article-editor">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/articles')}
          className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#718096]" />
        </button>
        <div>
          <h1 className="font-['Playfair_Display'] text-2xl font-semibold text-[#2D3748]">
            {isEditing ? 'Edit Article' : 'New Article'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="input-default w-full text-lg"
                placeholder="Article title"
                data-testid="article-title-input"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <label className="form-label">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                className="input-default w-full resize-none"
                placeholder="A brief summary of the article..."
                data-testid="article-excerpt-input"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <label className="form-label">Content (HTML)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={20}
                className="input-default w-full font-mono text-sm resize-none"
                placeholder="<h2>Introduction</h2><p>Your article content...</p>"
                data-testid="article-content-input"
              />
              <p className="text-xs text-[#718096] mt-2">
                Supports HTML tags: h2, h3, p, ul, ol, li, blockquote, a, strong, em
              </p>
            </div>

            {/* What's New */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <label className="form-label">What's New This Week (Optional)</label>
              <textarea
                name="whats_new"
                value={formData.whats_new}
                onChange={handleChange}
                rows={2}
                className="input-default w-full resize-none"
                placeholder="Brief summary of recent updates to this article..."
                data-testid="article-whats-new-input"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-[#2D3748] mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Published</Label>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_published: checked }))
                    }
                    data-testid="article-published-switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Featured</Label>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_featured: checked }))
                    }
                    data-testid="article-featured-switch"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                data-testid="article-save-btn"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Update Article' : 'Create Article'}
                  </>
                )}
              </button>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <label className="form-label">Category</label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger data-testid="article-category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <label className="form-label">Featured Image URL</label>
              <input
                type="url"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                className="input-default w-full"
                placeholder="https://..."
                data-testid="article-image-input"
              />
              {formData.featured_image && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-[#2D3748] mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="input-default w-full"
                    placeholder="article-slug"
                    data-testid="article-slug-input"
                  />
                </div>
                <div>
                  <label className="form-label">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    className="input-default w-full"
                    placeholder="SEO title"
                    data-testid="article-meta-title-input"
                  />
                </div>
                <div>
                  <label className="form-label">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    rows={2}
                    className="input-default w-full resize-none"
                    placeholder="SEO description"
                    data-testid="article-meta-desc-input"
                  />
                </div>
                <div>
                  <label className="form-label">Reading Time (minutes)</label>
                  <input
                    type="number"
                    name="reading_time"
                    value={formData.reading_time}
                    onChange={handleChange}
                    min={1}
                    className="input-default w-full"
                    data-testid="article-reading-time-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
