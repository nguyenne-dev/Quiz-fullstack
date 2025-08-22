"use client";

import { getTopic } from "../../../services/topicService";
import { getQuestionTopic } from "../../../services/questionService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

function PageTopic() {
  const [topic, setTopic] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getTopic();

      // Lấy tổng số câu hỏi cho từng topic
      const topicsWithCount = await Promise.all(
        result.topics.map(async (item) => {
          try {
            const q = await getQuestionTopic(item._id);
            return { ...item, questionCount: q?.questions?.length || 0 };
          } catch {
            return { ...item, questionCount: 0 };
          }
        })
      );

      // Chỉ giữ topic có questionCount > 0
      setTopic(topicsWithCount.filter((t) => t.questionCount > 0));
    };
    fetchApi();
  }, []);

  // Mở dialog xác nhận
  const handleClick = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  // Nếu xác nhận -> sang trang làm bài
  const handleConfirm = () => {
    setOpenConfirm(false);
    if (selectedId) {
      router.push(`/Question?id=${selectedId}`);
    }
  };

  return (
    <>
      <section className="categories" id="categories">
        <div className="categories-container">
          <div className="section-header animate-on-scroll">
            <div className="section-badge">📚 Danh mục học tập</div>
            <h2 className="section-title">Khám phá các chủ đề</h2>
            <p className="section-subtitle">
              Từ công nghệ thông tin đến kinh doanh, chúng tôi có đầy đủ các chủ
              đề để bạn lựa chọn.
            </p>
          </div>
          <div className="categories-grid">
            {topic.map((item) => (
              <div
                className="category-card animate-on-scroll"
                key={item._id}
                onClick={() => handleClick(item._id)}
              >
                <h3 className="category-title">{item.title}</h3>
                <p className="category-count">
                  {item.questionCount}+ câu hỏi
                </p>
                <p className="category-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dialog xác nhận */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Xác nhận vào làm bài
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn bắt đầu làm bài thi cho chủ đề này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PageTopic;
