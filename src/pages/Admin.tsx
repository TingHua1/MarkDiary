import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore, apiFetch } from '../store';
import { Plus, Calendar, Edit2, Trash2, ArrowLeft } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchArticles = async () => {
      try {
        const response = await apiFetch('/api/articles');
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [isAuthenticated, navigate]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    
    try {
      const response = await apiFetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setArticles(articles.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-[#1e3a5f] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a5f]">文章管理</h1>
            <p className="text-gray-600 mt-1">管理您的所有文章</p>
          </div>
          <Link
            to="/admin/edit"
            className="flex items-center space-x-2 px-4 py-2 bg-[#ff6b35] hover:bg-[#e55a2b] text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>新建文章</span>
          </Link>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg mb-4">还没有文章</p>
          <Link
            to="/admin/edit"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>写第一篇文章</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#1e3a5f] mb-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>创建: {formatDate(article.createdAt)}</span>
                    {article.updatedAt !== article.createdAt && (
                      <span>更新: {formatDate(article.updatedAt)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/admin/edit/${article.id}`}
                    className="p-2 text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
