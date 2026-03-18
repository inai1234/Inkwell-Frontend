import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import BlogForm from '../components/BlogForm';
import { blogAPI } from '../utils/api';

export default function EditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // We need to get by ID for admin - fetch all and find
    blogAPI.getAll({ limit: 1000 })
      .then(({ data }) => {
        const found = data.blogs.find(b => b._id === id);
        if (found) setBlog(found);
        else setError('Post not found');
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    await blogAPI.update(id, data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-medium">{error}</p>
        <Link to="/blogs" className="btn-primary mt-4 inline-flex">← Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/blogs" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Edit Post</h1>
          <p className="text-textSecondary mt-0.5 text-sm line-clamp-1">{blog?.title}</p>
        </div>
      </div>

      <BlogForm initialData={blog} onSubmit={handleSubmit} submitLabel="Update Post" />
    </div>
  );
}
