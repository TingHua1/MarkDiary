import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ArticleEditor from './pages/ArticleEditor';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/edit" element={<ArticleEditor />} />
            <Route path="/admin/edit/:id" element={<ArticleEditor />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
