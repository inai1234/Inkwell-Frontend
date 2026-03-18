import { Link } from 'react-router-dom';
import BlogForm from '../components/BlogForm';
import { blogAPI } from '../utils/api';

export default function CreateBlogPage() {
  const handleSubmit = async (data) => {
    await blogAPI.create(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/blogs" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Create New Post</h1>
          <p className="text-textSecondary mt-0.5 text-sm">Write and publish your blog post</p>
        </div>
      </div>

      <BlogForm onSubmit={handleSubmit} submitLabel="Publish Post" />
    </div>
  );
}
