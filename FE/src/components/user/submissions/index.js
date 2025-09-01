'use client';
import { useEffect, useState } from "react";
import { getSubmission } from "../../../services/submissionService";
import { useRouter } from "next/navigation";
import './LichSuLam.css';

export default function LichSuLam() {
  const [dataGet, setDataGet] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getSubmission();
      setDataGet(result);
      console.log(result);
    };
    fetchApi();
  }, []);

  const getDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes} phút ${seconds} giây`;
  };

  const getScoreClass = (score) => {
    if (score >= 0.90) return 'score-excellent';
    if (score >= 0.75) return 'score-good';
    if (score >= 0.50) return 'score-average';
    return 'score-poor';
  };

  const getRank = (score) => {
    if (score >= 0.90) return 'Xuất sắc';
    if (score >= 0.75) return 'Tốt';
    if (score >= 0.50) return 'Trung bình';
    return 'Kém';
  };

  // Stats
  const totalSubmissions = dataGet.length;
  const averageScore = totalSubmissions
    ? Math.round(dataGet.reduce((a, b) => a + b.score, 0) / totalSubmissions)
    : 0;

  return (
    <div className="history-container">
      <div className="title">Lịch Sử Làm Bài</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalSubmissions}</div>
          <div className="stat-label">Tổng bài làm</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{averageScore}%</div>
          <div className="stat-label">Tỉ lệ đúng trung bình</div>
        </div>
      </div>

      <div className="history-list">
        {dataGet.map(item => (
          <div key={item._id} className="history-card">
            <div className="item-header">
              <div>
                <div className="topic-title">{item.topicId?.title}</div>
                <div className="subject">{item.topicId?.description || 'Chưa dữ liệu'}</div>
              </div>
              <div className="date-text">
                {new Date(item.submittedAt).toLocaleDateString()} - {new Date(item.submittedAt).toLocaleTimeString()}
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <div className={`detail-value ${getScoreClass(item.score)}`}>{item.score / item.totalQuestions * 100}%</div>
                <div className="detail-label">Tỉ lệ</div>
              </div>
              <div className="detail-item">
                <div className="detail-value">{item.score}/{item.totalQuestions}</div>
                <div className="detail-label">Câu đúng</div>
              </div>
              <div className="detail-item">
                <div className="detail-value">{getDuration(item.startedAt, item.submittedAt)}</div>
                <div className="detail-label">Thời gian</div>
              </div>
              <div className="detail-item">
                <div className="detail-value">{getRank(item.score/item.totalQuestions)}</div>
                <div className="detail-label">Xếp loại</div>
              </div>
            </div>

            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/result?id=${item._id}`);
                }}
              >
                Xem chi tiết
              </button>
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/Question?id=${item.topicId._id}`);
                }}
              >
                Làm lại
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
