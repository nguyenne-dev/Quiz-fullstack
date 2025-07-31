import React, { useEffect, useState } from 'react';
import { deleteQuestion, getQuestion } from "../../../services/questionService";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Box, Typography, Menu, MenuItem,
  Dialog, DialogTitle, DialogActions, Button
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert as MoreVertIcon } from '@mui/icons-material';
import EditQuestion from './EditQuestion';

export default function ListQuestion({ reLoad, onReload, setShowNotify, setMessage, setSeverity }) {
  const [openMenu, setOpenMenu] = useState(null); // { anchorEl, id }
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState({});

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getQuestion();
      setQuestions(result.questions);
    };
    fetchApi();
  }, [reLoad]);

  const handleEdit = (id) => {
    console.log("Sửa câu hỏi:", id);
    // TODO: mở form sửa
  };

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
              <TableCell />
              <TableCell>Câu hỏi</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell align="right">Tùy chọn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q) => (
              <React.Fragment key={q._id}>
                <TableRow hover>
                  <TableCell sx={{ maxWidth: "30px" }}>
                    <IconButton onClick={() => setOpenRowIndex(openRowIndex === q._id ? null : q._id)}>
                      {openRowIndex === q._id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{q.question}</TableCell>
                  <TableCell>{q.topicId.title}</TableCell>
                  <TableCell align="right">
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
                        <Typography variant="subtitle1">Các đáp án</Typography>
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
