import { useEffect, useState } from "react";
import "./topic.css"
import EditTopic from "./EditTopic"
import { delTopic, getTopic } from '../../../services/topicService';
import { FaEllipsisV } from "react-icons/fa";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function ListTopic({ reLoad, onReload, setShowNotify, setMessage, setSeverity }) {

  const [topics, setTopics] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getTopic();
      setTopics(result.topics);
    }; fetchApi();
  }, [reLoad])

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleEdit = (item) => {
    setItemEdit(item);
    setShowFormEdit(true);
    onReload();
  };

  const handleDelete = async (id) => {
    // console.log("Xoá topic ID:", id);
    // Gọi API xoá
    const result = await delTopic(id);
    if (result.success) {
      setSeverity("success");
      setMessage(result.message);
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      onReload(Date.now());
      setOpenMenuIndex(null);
      return;
    } else {
      setSeverity("error");
      setMessage(result.message || "Đã xảy ra lỗi!");
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      return;
    }

  };

  return (
    <>
      {showFormEdit && <EditTopic onClose={() => setShowFormEdit(false)} item={itemEdit} onReload={onReload} setShowNotify={setShowNotify} setMessage={setMessage} setSeverity={setSeverity} />}
      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }} onClick={() => toggleMenu(null)}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Tên chủ đề</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Mô tả</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((item, i) => (
              <TableRow key={item._id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, }}>
                <TableCell component="th" scope="row">{item.title}</TableCell>
                <TableCell >{item.description}</TableCell>
                <TableCell align="center">
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: 'relative' }}>
                    <FaEllipsisV style={{ fontSize: "16px", cursor: "pointer", }}
                      onClick={(e) => { e.stopPropagation(); toggleMenu(i) }}
                    />
                    {openMenuIndex === i && (
                      <div className="action-menu">
                        <button onClick={() => handleEdit(item)}>Sửa</button>
                        <button onClick={() => handleDelete(item._id)}>Xoá</button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ListTopic;