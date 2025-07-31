import {
  Box, Button, CircularProgress, FormControl, IconButton,
  InputLabel, MenuItem, Select, TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { getTopic } from "../../../services/topicService";
import { patchQuestion } from "../../../services/questionService";

function EditQuestion({ item, onClose, onReload, setShowNotify, setMessage, setSeverity }) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [topics, setTopics] = useState([]);

  // console.log(item)
  const [dataQuestion, setDataQuestion] = useState({
    topicId: "",
    question: "",
    answers: [
      { key: "A", text: "" },
      { key: "B", text: "" }
    ],
    correctAnswer: ""
  });

  // Set dữ liệu vào form khi mở
  useEffect(() => {
    if (item) {
      setDataQuestion({
        topicId: item.topicId._id || "",
        question: item.question || "",
        answers: item.answers || [
          { key: "A", text: "" },
          { key: "B", text: "" }
        ],
        correctAnswer: item.correctAnswer || ""
      });
    }
  }, [item]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getTopic();
      setTopics(result.topics);
    };
    fetchApi();
  }, []);

  const handleAddAnswer = () => {
    const alphabet = "ABCD";
    const nextKey = alphabet[dataQuestion.answers.length];
    setDataQuestion({
      ...dataQuestion,
      answers: [...dataQuestion.answers, { key: nextKey, text: "" }]
    });
  };

  const handleRemoveAnswer = (index) => {
    const updated = [...dataQuestion.answers];
    updated.splice(index, 1);

    const alphabet = "ABCD";
    const rekeyed = updated.map((ans, i) => ({
      ...ans,
      key: alphabet[i],
    }));

    setDataQuestion((prev) => {
      const correctStillValid = rekeyed.find(ans => ans.key === prev.correctAnswer);
      return {
        ...prev,
        answers: rekeyed,
        correctAnswer: correctStillValid ? prev.correctAnswer : "",
      };
    });
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...dataQuestion.answers];
    updatedAnswers[index].text = value;
    setDataQuestion({ ...dataQuestion, answers: updatedAnswers });
  };

  // const handleSubmit = async () => {
  //   // setBtnLoading(true);

  //   const { question, topicId, answers, correctAnswer } = dataQuestion;
  //   // 1. Câu hỏi rỗng
  //   if (!question.trim()) {
  //     setSeverity("error");
  //     setMessage("Vui lòng nhập nội dung câu hỏi!");
  //     setShowNotify(true);
  //     setTimeout(() => {
  //       setShowNotify(false);
  //     }, 3000);
  //     return;
  //   }

  //   // 2. Chưa chọn chủ đề
  //   if (!topicId) {
  //     setSeverity("error");
  //     setMessage("Vui lòng chọn chủ đề cho câu hỏi!");
  //     setShowNotify(true);
  //     setTimeout(() => {
  //       setShowNotify(false);
  //     }, 3000);
  //     return;
  //   }

  //   // 3. Các đáp án không được rỗng
  //   for (let i = 0; i < answers.length; i++) {
  //     if (!answers[i].text.trim()) {
  //       setSeverity("error");
  //       setMessage(`Đáp án ${answers[i].key} không được để trống, xóa nếu không cần thiết\n(ít nhất phải có 2 đáp án)!`);
  //       setShowNotify(true);
  //       setTimeout(() => {
  //         setShowNotify(false);
  //       }, 3000);
  //       return;
  //     }
  //   }

  //   // 4. Chưa chọn đáp án đúng
  //   if (!correctAnswer) {
  //     setSeverity("error");
  //     setMessage("Vui lòng chọn đáp án đúng!");
  //     setShowNotify(true);
  //     setTimeout(() => {
  //       setShowNotify(false);
  //     }, 3000);
  //     return;
  //   }

  //   // Gọi API sửa
  //   const result = await patchQuestion(item._id, dataQuestion);

  //   if (result.success) {
  //     setSeverity("success");
  //     setMessage(result.message);
  //     setShowNotify(true);
  //     setTimeout(() => {
  //       setShowNotify(false);
  //     }, 3000);
  //     onReload();
  //     onClose();
  //     setBtnLoading(false);
  //     return;
  //   } else {
  //     setSeverity("error");
  //     setMessage(result.message);
  //     setShowNotify(true);
  //     setTimeout(() => {
  //       setShowNotify(false);
  //     }, 3000);
  //     setBtnLoading(false);
  //     return;
  //   }
  // };
  const handleSubmit = async () => {
    try {
      setBtnLoading(true);

      const { question, topicId, answers, correctAnswer } = dataQuestion;

      // 1. Câu hỏi rỗng
      if (!question.trim()) {
        throw new Error("Vui lòng nhập nội dung câu hỏi!");
      }

      // 2. Chưa chọn chủ đề
      if (!topicId) {
        throw new Error("Vui lòng chọn chủ đề cho câu hỏi!");
      }

      // 3. Các đáp án không được rỗng
      for (let i = 0; i < answers.length; i++) {
        if (!answers[i].text.trim()) {
          throw new Error(`Đáp án ${answers[i].key} không được để trống, xóa nếu không cần thiết\n(ít nhất phải có 2 đáp án)!`);
        }
      }

      // 4. Chưa chọn đáp án đúng
      if (!correctAnswer) {
        throw new Error("Vui lòng chọn đáp án đúng!");
      }

      // Xử lý bỏ _id trong answers (nếu cần)
      const cleanAnswers = answers.map(({ key, text }) => ({ key, text }));
      const cleanData = { ...dataQuestion, answers: cleanAnswers };

      // Gọi API sửa
      const result = await patchQuestion(item._id, cleanData);

      if (!result.success) {
        throw new Error(result.message || "Cập nhật thất bại!");
      }

      // Nếu thành công
      setSeverity("success");
      setMessage(result.message);
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      onReload();
      onClose();
    } catch (error) {
      setSeverity("error");
      setMessage(error.message || "Có lỗi xảy ra!");
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="form-container">
        <h2 className="form-title">Sửa câu hỏi</h2>

        <TextField
          sx={{ width: '100%', my: 1 }}
          label="Câu hỏi"
          variant="outlined"
          value={dataQuestion.question}
          onChange={(e) => setDataQuestion({ ...dataQuestion, question: e.target.value })}
        />

        <FormControl fullWidth sx={{ my: 1, mb: 2 }}>
          <InputLabel>Chủ đề</InputLabel>
          <Select
            value={topics.find((t) => t._id === dataQuestion.topicId) ? dataQuestion.topicId : ""} // Tìm nếu có topicId này trong data thì hiển thị text không thì chưa chọn ""
            label="Chủ đề"
            onChange={(e) => setDataQuestion({ ...dataQuestion, topicId: e.target.value })}
          >
            {topics.map((item) => (
              <MenuItem key={item._id} value={item._id}>{item.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {dataQuestion.answers.map((answer, index) => (
          <Box key={answer.key} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <TextField
              sx={{ flex: 1, mr: 1 }}
              label={`Đáp án ${answer.key}`}
              variant="outlined"
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveAnswer(index)}
              disabled={dataQuestion.answers.length <= 2}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button variant="outlined" onClick={handleAddAnswer} disabled={dataQuestion.answers.length >= 4}>
          Thêm đáp án
        </Button>

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Đáp án đúng</InputLabel>
          <Select
            value={dataQuestion.correctAnswer}
            label="Đáp án đúng"
            onChange={(e) => setDataQuestion({ ...dataQuestion, correctAnswer: e.target.value })}
          >
            {dataQuestion.answers.map((answer) => (
              <MenuItem key={answer.key} value={answer.key}>{answer.key}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="form-buttons">
          <button className="btn cancel-btn" onClick={onClose}>✖ Hủy bỏ</button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={btnLoading}
            sx={{
              padding: '8px 16px',
              width: '150px',
              fontSize: '14px',
              borderRadius: '8px',
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': { backgroundColor: '#333' },
            }}
          >
            {btnLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : '✔ Cập nhật'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditQuestion;