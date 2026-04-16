import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore, apiFetch } from '../store';
import MarkdownViewer from '../components/MarkdownViewer';
import { Save, ArrowLeft, Eye, Edit3 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
}

const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await apiFetch(`/api/articles/${id}`);
          if (!response.ok) {
            throw new Error('文章不存在');
          }
          const data = await response.json();
          setFormData({
            title: data.article.title,
            summary: data.article.summary,
            content: data.article.content,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : '加载失败');
        } finally {
          setFetching(false);
        }
      };

      fetchArticle();
    }
  }, [id, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = id ? `/api/articles/${id}` : '/api/articles';
      const method = id ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/admin');
      } else {
        setError(data.message || '保存失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error && id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/admin" className="text-[#1e3a5f] hover:text-[#ff6b35]">
          返回管理
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center text-gray-600 hover:text-[#1e3a5f]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回管理
          </Link>
          <button
            onClick={() => setViewMode(!viewMode)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors"
          >
            {viewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{viewMode ? '编辑' : '预览'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!viewMode ? (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    标题
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-colors text-xl"
                    placeholder="请输入文章标题"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                    摘要 (可选)
                  </label>
                  <textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-colors"
                    placeholder="请输入文章摘要"
                    rows={2}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
                  <h2 className="text-sm font-medium text-gray-700">Markdown 内容</h2>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-6 py-6 min-h-[500px] border-0 focus:ring-0 font-mono text-sm"
                  placeholder="在此输入 Markdown 内容..."
                  required
                />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h1 className="text-3xl font-bold text-[#1e3a5f] mb-4">{formData.title || '无标题'}</h1>
              {formData.summary && (
                <p className="text-gray-600 mb-6">{formData.summary}</p>
              )}
              <hr className="mb-8" />
              <MarkdownViewer content={formData.content || '*暂无内容*'} />
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-[#ff6b35] hover:bg-[#e55a2b] disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? '保存中...' : '保存文章'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;
