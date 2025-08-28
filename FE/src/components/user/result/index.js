"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSubmissionById } from "../../../services/submissionService";
import "./KetQuaBaiLam.css";

function KetQuaBaiLam() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await getSubmissionById(id);
        setResult(data);
        console.log("API trả về:", data);
      } catch (error) {
        console.error("Error fetching submission:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApi();
  }, [id]);

  const formatDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="result-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-container">
        <div className="error">
          <h2>Không tìm thấy kết quả</h2>
          <p>Vui lòng kiểm tra lại đường dẫn</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <div className="result-container">
      {/* Header */}
      <div className="header1">
        <h1>Kết Quả Bài Làm</h1>
        <p>Xem chi tiết kết quả bài trắc nghiệm của bạn</p>
      </div>

      {/* Điểm */}
      <div className="score-section">
        <div
          className={`score-circle ${percentage >= 80 ? "excellent" : percentage >= 60 ? "good" : "poor"
            }`}
        >
          {result.score}/{result.totalQuestions}
        </div>
        <div className="score-text">
          {percentage >= 80
            ? "Xuất sắc!"
            : percentage >= 60
              ? "Khá tốt!"
              : "Cần cố gắng thêm!"}
        </div>
        <div className="score-percentage">{percentage}%</div>
      </div>

      {/* Thông tin chung */}
      <div className="info-grid">
        <div className="info-card">
          📚 <div className="info-label">Chủ đề</div>
          <div className="info-value">{result.topicTitle || "N/A"}</div>
        </div>
        <div className="info-card">
          ⏱️ <div className="info-label">Thời gian</div>
          <div className="info-value">
            {formatDuration(result.startedAt, result.submittedAt)}
          </div>
        </div>
        <div className="info-card">
          ❓ <div className="info-label">Số câu hỏi</div>
          <div className="info-value">{result.totalQuestions}</div>
        </div>
        <div className="info-card">
          📅 <div className="info-label">Ngày làm</div>
          <div className="info-value">Vào {formatDate(result.submittedAt)}</div>
        </div>
      </div>

      {/* Câu trả lời chi tiết */}
      <div className="answers-section">
        <h2>📝 Chi tiết câu trả lời</h2>
        {result.questions?.length ? (
          result.questions.map((q, i) => {
            const isCorrect = q.isCorrect;

            return (
              <div
                key={q._id || i}
                className={`answer-item ${isCorrect ? "correct" : "incorrect"}`}
              >
                <div className="answer-header">
                  <span>Câu {i + 1}</span>
                  <span className={`badge ${isCorrect ? "ok" : "fail"}`}>
                    {isCorrect ? "✅ Đúng" : "❌ Sai"}
                  </span>
                </div>

                {/* Câu hỏi */}
                <div className="question-text">{q.question}</div>

                {/* Đáp án */}
                <div className="options">
                  {q.answers?.map((opt) => {
                    const selected = q.selectedAnswer === opt.key;
                    const correct = q.correctAnswer === opt.key;

                    return (
                      <div
                        key={opt._id}
                        className={`option ${correct
                          ? "correct-option"
                          : selected && !correct
                            ? "wrong-option"
                            : ""
                          }`}
                      >
                        <b>{opt.key}.</b> {opt.text}
                        {/* Hiển thị icon ✅ ❌ */}
                        {correct && <span className="icon">✅</span>}
                        {selected && !correct && <span className="icon">❌</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p>Không có dữ liệu chi tiết</p>
        )}
      </div>

      {/* Nút hành động */}
      <div className="actions">
        {/* <button onClick={() => router.push(`/Question?id=${result.topicId}`)}> */}
        <button
          onClick={() => {
            if (window.confirm("Bạn có chắc chắn muốn làm lại bài này không?\n\nLưu ý: Câu hỏi có thể đã thay đổi hoặc không còn.")) {
              router.push(`/Question?id=${result.topicId}`);
            }
          }}
        >
          🔄 Làm lại
        </button>
        <button onClick={() => router.push("/")}>🏠 Về trang chủ</button>
      </div>
    </div>
  );
}

export default KetQuaBaiLam;
