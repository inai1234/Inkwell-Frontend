import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, uploadAPI } from '../utils/api';

const EMOJI_ICONS = ['💻','🎨','🌿','✈️','🔬','🏃','📚','🍕','🎵','💡','🌍','❤️','📸','🎭','🏆'];

export default function BlogForm({ initialData, onSubmit, submitLabel = 'Publish Post' }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // const [form, setForm] = useState({
  //   title: '',
  //   excerpt: '',
  //   content: '',
  //   coverImage: '',
  //   category: '',
  //   tags: '',
  //   status: 'draft',
  //   featured: false,
  //   metaTitle: '',
  //   metaDescription: '',
  //   ...initialData,
  //   tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
  // });

  const { tags, ...restInitialData } = initialData || {};

const [form, setForm] = useState({
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  status: 'draft',
  featured: false,
  metaTitle: '',
  metaDescription: '',
  ...restInitialData,
  tags: Array.isArray(tags) ? tags.join(', ') : (tags || ''),
});

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file);
      setForm(f => ({ ...f, coverImage: data.url }));
    } catch {
      setError('Image upload failed. Make sure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (statusOverride) => {
    setError('');
    if (!form.title.trim()) return setError('Title is required');
    if (!form.excerpt.trim()) return setError('Excerpt is required');
    if (!form.content.trim()) return setError('Content is required');
    if (!form.category) return setError('Category is required');

    setSaving(true);
    try {
      const payload = {
        ...form,
        status: statusOverride || form.status,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await onSubmit(payload);
      navigate('/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post. Check if backend is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="xl:col-span-2 space-y-5">
          {/* Title */}
          <div className="card">
            <label className="label text-base font-semibold">Post Title *</label>
            <input
              type="text" name="title" value={form.title} onChange={handleChange}
              className="input-field text-lg font-medium"
              placeholder="Enter an engaging post title..."
            />
          </div>

          {/* Excerpt */}
          <div className="card">
            <label className="label">Excerpt / Summary *</label>
            <textarea
              name="excerpt" value={form.excerpt} onChange={handleChange}
              rows={3} className="input-field resize-none"
              placeholder="A short description shown on blog cards (max 500 chars)"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.excerpt.length}/500</p>
          </div>

          {/* Content */}
          <div className="card">
            <label className="label">Content * <span className="text-xs font-normal text-gray-400">(HTML supported)</span></label>
            <textarea
              name="content" value={form.content} onChange={handleChange}
              rows={20} className="input-field resize-y font-mono text-sm"
              placeholder={`<h2>Introduction</h2>\n<p>Start writing your blog content here...</p>\n\n<h2>Main Section</h2>\n<p>Add your content...</p>\n\n<blockquote>A meaningful quote</blockquote>`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Tip: Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;blockquote&gt;, &lt;strong&gt;
            </p>
          </div>

          {/* SEO */}
          <div className="card">
            <h3 className="font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              SEO Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="label">Meta Title <span className="text-xs font-normal text-gray-400">(optional, max 60)</span></label>
                <input type="text" name="metaTitle" value={form.metaTitle} onChange={handleChange}
                  className="input-field" placeholder="Leave empty to use post title" maxLength={60} />
              </div>
              <div>
                <label className="label">Meta Description <span className="text-xs font-normal text-gray-400">(optional, max 160)</span></label>
                <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange}
                  rows={2} className="input-field resize-none" placeholder="Leave empty to use excerpt" maxLength={160} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-5">
          {/* Publish Actions */}
          <div className="card">
            <h3 className="font-semibold text-textPrimary mb-4">Publish</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input-field">
                  <option value="draft">📝 Draft</option>
                  <option value="published">✅ Published</option>
                  <option value="archived">📦 Archived</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary transition-colors">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                  className="w-4 h-4 accent-primary" />
                <div>
                  <p className="text-sm font-medium text-textPrimary">Featured Post ⭐</p>
                  <p className="text-xs text-gray-400">Show on homepage hero section</p>
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => handleSubmit('published')} disabled={saving}
                className="btn-primary justify-center w-full">
                {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : '🚀 Publish Now'}
              </button>
              <button onClick={() => handleSubmit('draft')} disabled={saving}
                className="btn-secondary justify-center w-full">
                💾 Save as Draft
              </button>
              <button onClick={() => navigate('/blogs')} className="btn-secondary justify-center w-full text-gray-500">
                Cancel
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="card">
            <label className="label">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-amber-600 mt-1.5">
                ⚠️ No categories found. <a href="/categories" className="underline">Create one first.</a>
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="card">
            <label className="label">Tags</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange}
              className="input-field"
              placeholder="tech, design, ai (comma separated)" />
            <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
          </div>

          {/* Cover Image */}
          <div className="card">
            <label className="label">Cover Image</label>
            {form.coverImage && (
              <div className="relative mb-3">
                <img src={form.coverImage} alt="cover" className="w-full h-40 object-cover rounded-xl" />
                <button onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                  ×
                </button>
              </div>
            )}
            <label className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary hover:bg-primary-50'}`}>
              {uploading ? (
                <>
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-primary font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-xs text-gray-500 text-center">Click to upload image<br/>(JPG, PNG, WebP — max 5MB)</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>

            <div className="mt-3">
              <label className="label text-xs">Or paste image URL</label>
              <input type="url" name="coverImage" value={form.coverImage} onChange={handleChange}
                className="input-field text-xs" placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
