"use client";

import { useEffect, useState } from "react";
import { getQuestionTopic } from "../../../services/questionService";
import { createSubmission } from "../../../services/submissionService";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  LinearProgress
} from "@mui/material";
import "./ListQuestion.css";

function ListQuestion() {
  // State quản lý dữ liệu
  const [questions, setQuestions] = useState([]); // danh sách câu hỏi
  const [answers, setAnswers] = useState({}); // đáp án người dùng chọn
  const [submitting, setSubmitting] = useState(false); // trạng thái đang nộp bài
  const [submitted, setSubmitted] = useState(false); // đã nộp bài hay chưa
  const [startTime] = useState(Date.now()); // thời gian bắt đầu
  const [timeSpent, setTimeSpent] = useState("00:00"); // thời gian đã làm bài

  const searchParams = useSearchParams();
  const topicId = searchParams.get("id"); // lấy id của topic từ query string
  const router = useRouter();

  // Đếm giờ làm bài
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setTimeSpent(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Cảnh báo khi reload hoặc đóng tab mà chưa nộp bài
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submitted && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = "Bạn chưa nộp bài, nếu thoát sẽ mất kết quả!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted, answers]);

  // Fetch câu hỏi từ API
  useEffect(() => {
    if (!topicId) return;
    const fetchApi = async () => {
      try {
        const result = await getQuestionTopic(topicId);
        setQuestions(result.questions);
      } catch (error) {
        console.error("Lỗi khi fetch questions:", error);
      }
    };
    fetchApi();
  }, [topicId]);

  // Chọn đáp án cho câu hỏi
  const handleSelectAnswer = (questionId, key) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: key
    }));
  };

  // Nộp bài
  const handleSubmit = () => {
    if (submitting) return; // ngăn spam
    setSubmitting(true);
    setTimeout(() => {
      alert(
        `Nộp bài thành công!\n\nThống kê:\n- Tổng câu hỏi: ${questions.length
        }\n- Đã trả lời: ${Object.keys(answers).length}\n- Thời gian làm bài: ${timeSpent}\n\nCảm ơn bạn đã tham gia!`
      );
      console.log("Câu trả lời đã chọn:", answers);
      // console.log({
      //   topicId: topicId,
      //   startTime: startTime,
      //   endTime: endTime,
      //   answers: answers
      // });
      // const dataPost = {
      //   topicId: topicId,
      //   startedAt: startTime,
      //   answers: answers
      // }
      const dataPost = {
        topicId,
        startedAt: new Date(startTime).toISOString(), // ISO string
        submittedAt: new Date().toISOString(),            // thêm thời gian kết thúc
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer
        }))
      };
      console.log(dataPost)
      const fetchApi = async () => {
        const result = await createSubmission(dataPost);
        console.log(result);
      }; fetchApi();
      setSubmitting(false);
      setSubmitted(true); // đánh dấu đã nộp -> bỏ cảnh báo reload
    }, 2000);


  };

  // Thống kê tiến độ
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="styled-container">
      <div className="main-card">
        {/* Header: Tiêu đề + progress */}
        <div className="header-box">
          <Typography
            variant="h3"
            sx={{ fontWeight: 300, mb: 1, position: "relative", zIndex: 1 }}
          >
            Bài Kiểm Tra Trực Tuyến
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, position: "relative", zIndex: 1 }}
          >
            Chọn đáp án đúng nhất cho mỗi câu hỏi
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              mt: 2,
              height: 4,
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 2
              }
            }}
          />
          <div className="stats-box">
            <Typography variant="body2">
              Đã trả lời: {answeredCount}/{totalQuestions}
            </Typography>
            <Typography variant="body2">Thời gian: {timeSpent}</Typography>
          </div>
        </div>

        {/* Danh sách câu hỏi */}
        <Box sx={{ p: 4 }}>
          {questions.map((q, index) => (
            <div key={q._id} className="question-card">
              {/* Header của câu hỏi */}
              <div className="question-header">
                <div className="question-number">{index + 1}</div>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, color: "#2c3e50", lineHeight: 1.5 }}
                >
                  {q.question}
                </Typography>
              </div>

              {/* Các đáp án */}
              <Box sx={{ p: 0 }}>
                <RadioGroup
                  className="radio-group"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleSelectAnswer(q._id, e.target.value)}
                >
                  {q.answers.map((ans) => (
                    <FormControlLabel
                      key={ans._id}
                      value={ans.key}
                      control={<Radio />}
                      label={
                        <span className="radio-label">
                          <span className="answer-key">{ans.key}.</span>
                          {ans.text}
                        </span>
                      }
                      className={`radio-option ${answers[q._id] === ans.key ? "checked" : ""
                        }`}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </div>
          ))}

          {/* Nút nộp bài */}
          <Box
            sx={{
              textAlign: "center",
              pt: 4,
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              mt: 3
            }}
          >
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={submitting || answeredCount !== totalQuestions}
            >
              {submitting ? "Đang nộp..." : "Nộp Bài"}
            </button>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default ListQuestion;