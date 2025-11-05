import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topicService } from '../../services/topicService';
import { Search, BookOpen, ArrowRight, Sparkles, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await topicService.getAllTopics();
        setTopics(data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách chủ đề:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((topic) => {
    const titleMatch = topic.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = topic.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || descMatch;
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '30px auto 40px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> TẤT CẢ CHỦ ĐỀ
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
          Khám Phá Các <span className="gradient-text">Bộ Đề Thi Trắc Nghiệm</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Chọn chủ đề bạn quan tâm và thử thách kiến thức bản thân ngay bây giờ.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginTop: '28px' }}>
          <Search
            size={20}
            color="var(--text-subtle)"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm kiếm chủ đề theo tên hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '48px',
              paddingRight: '20px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--bg-surface)'
            }}
          />
        </div>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <LoadingSpinner message="Đang tải danh sách chủ đề..." />
      ) : filteredTopics.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--text-muted)'
          }}>
            <Filter size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Không tìm thấy chủ đề phù hợp</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
            {searchQuery ? `Không có kết quả nào khớp với "${searchQuery}"` : 'Hiện chưa có chủ đề nào trên hệ thống.'}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="btn btn-secondary btn-sm">
              Xóa tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredTopics.map((topic, index) => (
            <div
              key={topic._id}
              className="glass-card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '24px',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: index % 3 === 0 
                      ? 'var(--primary-gradient)' 
                      : index % 3 === 1 
                      ? 'var(--accent-gradient)' 
                      : 'var(--warm-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <BookOpen size={22} />
                  </div>
                  <span className="badge badge-primary">TRẮC NGHIỆM</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>
                  {topic.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {topic.description || 'Chủ đề ôn luyện kiến thức trắc nghiệm chất lượng cao.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                  Miễn phí tham gia
                </span>
                <Link to={`/quiz/${topic._id}`} className="btn btn-primary btn-sm">
                  Bắt đầu làm bài <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicsPage;
