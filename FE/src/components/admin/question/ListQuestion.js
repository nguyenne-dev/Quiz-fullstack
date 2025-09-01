import React, { useEffect, useState } from 'react';
import { deleteQuestion, getQuestion, getQuestionTopic } from "../../../services/questionService";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Box, Typography, Menu, MenuItem,
  Dialog, DialogTitle, DialogActions, Button,
  TextField
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert as MoreVertIcon } from '@mui/icons-material';
import EditQuestion from './EditQuestion';
import { getTopic } from '../../../services/topicService';

export default function ListQuestion({ reLoad, onReload, setShowNotify, setMessage, setSeverity }) {
  const [openMenu, setOpenMenu] = useState(null); // { anchorEl, id }
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState({});

  const [topics, setTopics] = useState(null);
  const [selectTopic, setSelectTopic] = useState("ALL");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);



  const handleChange = (event) => {
    setSelectTopic(event.target.value);
    // console.log(event.target.value)
  };

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getTopic();
      // console.log(result);
      setTopics(result.topics);
    }; fetchApi();
  }, [])


  useEffect(() => {
    const fetchApi = async () => {
      if (selectTopic === "ALL") {
        const result = await getQuestion();
        setQuestions(result.questions);
      }
      else {
        const result = await getQuestionTopic(selectTopic);
        setQuestions(result.questions);
      }
    };
    fetchApi();
  }, [reLoad, selectTopic]);

  const handleDelete = (id) => {
    // console.log("Xoá câu hỏi:", id);
    // Xác nhận và xoá
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteQuestion(confirmDeleteId);
      // console.log("Kết quả xoá:", result);
      setConfirmDeleteId(null);

      if (result?.success) {
        setShowNotify(true);
        setMessage(result?.message);
        setSeverity("success");

        setTimeout(() => {
          setShowNotify(false);
        }, 3000);

        onReload();
      } else {
        setShowNotify(true);
        setMessage(result?.message);
        setSeverity("error");

        setTimeout(() => {
          setShowNotify(false);
        }, 3000);
      }
    } catch (error) {
      setShowNotify(true);
      setMessage("Xoá thất bại!");
      setSeverity("error");

      setTimeout(() => {
        setShowNotify(false);
      }, 3000);
    }
  };


  return (
    <>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-select-topic"
            select
            label="Chủ đề"
            value={selectTopic}
            onChange={handleChange}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            {topics?.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Box>



      {showFormEdit && <EditQuestion onClose={() => setShowFormEdit(false)} item={itemEdit} onReload={() => onReload()} setShowNotify={setShowNotify} setMessage={setMessage} setSeverity={setSeverity} />}
      <Dialog open={confirmDeleteId ? true : false} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Bạn có chắc chắn muốn xoá câu hỏi này?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)} color="inherit">Huỷ</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '30px' }} />
              <TableCell sx={{ fontWeight: 'bold', fontSize: '20px' }}>Câu hỏi</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '20px' }}>Chủ đề</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '20px', width: '30px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions?.map((q) => (
              <React.Fragment key={q._id}>
                <TableRow hover>
                  <TableCell sx={{ width: '30px' }}>
                    <IconButton onClick={() => setOpenRowIndex(openRowIndex === q._id ? null : q._id)}>
                      {openRowIndex === q._id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{q.question}</TableCell>
                  <TableCell>{q.topicId.title}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(event) => { setItemEdit(q); setOpenMenu({ anchorEl: event.currentTarget, id: q._id }); }} >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Dòng chi tiết câu hỏi (đáp án) */}
                <TableRow>
                  <TableCell colSpan={4} sx={{ p: 0, paddingLeft: '10%' }}>
                    <Collapse in={openRowIndex === q._id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>Các đáp án</Typography>
                        <ul>
                          {q.answers.map((a) => (
                            <li key={a.key}>
                              <strong>{a.key}:</strong> {a.text}
                            </li>
                          ))}
                        </ul>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          ✅ Đáp án đúng: <strong>{q.correctAnswer}</strong>
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu tuỳ chọn sửa/xoá */}
      <Menu anchorEl={openMenu?.anchorEl} open={Boolean(openMenu)} onClose={() => setOpenMenu(null)} >
        <MenuItem onClick={() => { setShowFormEdit(true); setOpenMenu(null); }}>
          Sửa
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(openMenu.id); setOpenMenu(null); }}>
          Xoá
        </MenuItem>
      </Menu>
    </>
  );
}
