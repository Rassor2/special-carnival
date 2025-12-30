import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const defaultImages = {
  'sleep-rest': 'https://images.unsplash.com/photo-1758243954982-cd1d5a8b9f97?w=600',
  'mental-health': 'https://images.unsplash.com/photo-1758274539654-23fa349cc090?w=600',
  'stress-anxiety': 'https://images.unsplash.com/photo-1665764356520-3daa0e8326b1?w=600',
  'productivity-focus': 'https://images.unsplash.com/photo-1700554565325-aea824405166?w=600',
  'lifestyle-habits': 'https://images.unsplash.com/photo-1628743270481-123e2501e518?w=600',
  'research-studies': 'https://images.unsplash.com/photo-1692035072849-93a511f35b2c?w=600',
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || slug,
      image_url: prev.image_url || defaultImages[slug] || '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      meta_title: '',
      meta_description: '',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image_url || '',
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id ? { ...c, ...formData } : c
          )
        );
        toast.success('Category updated');
      } else {
        const res = await categoriesAPI.create(formData);
        setCategories([...categories, res.data]);
        toast.success('Category created');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await categoriesAPI.delete(deleteId);
      setCategories(categories.filter((c) => c.id !== deleteId));
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setDeleteId(null);
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
    <div data-testid="admin-categories">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#2D3748]">
            Categories
          </h1>
          <p className="text-[#718096] mt-1">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button
          onClick={openCreateDialog}
          className="btn-primary flex items-center gap-2"
          data-testid="create-category-btn"
        >
          <Plus className="w-5 h-5" /> New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
          >
            <div className="aspect-video bg-stone-100">
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-[#2D3748] mb-1">{category.name}</h3>
              <p className="text-sm text-[#718096] line-clamp-2 mb-4">
                {category.description}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditDialog(category)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2"
                  data-testid={`edit-category-${category.id}`}
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(category.id)}
                  className="p-2 rounded-lg text-[#F56565] hover:bg-[#F56565]/10 transition-colors"
                  data-testid={`delete-category-${category.id}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#718096] mb-4">No categories yet</p>
          <button onClick={openCreateDialog} className="btn-primary">
            Create First Category
          </button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="input-default w-full"
                placeholder="Category name"
                data-testid="category-name-input"
              />
            </div>
            <div>
              <label className="form-label">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="input-default w-full"
                placeholder="category-slug"
                data-testid="category-slug-input"
              />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="input-default w-full resize-none"
                placeholder="Category description..."
                data-testid="category-description-input"
              />
            </div>
            <div>
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-default w-full"
                placeholder="https://..."
                data-testid="category-image-input"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
                data-testid="category-save-btn"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editingCategory ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Articles in this category will
              not be deleted but will need to be reassigned.
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
