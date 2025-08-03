'use client'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './style.css';
import { useEffect, useState } from 'react';
import { getAllUser } from '../../../services/authService';
function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getAllUser();
      // console.log(result)
      setUsers(result.data)
    }; fetchApi();
  }, [])

  // console.log(users)

  const rows = [
    { "name": "Người dùng A", "dob": '01/01/2000', "email": "Email", "gender": 'Nam', "status": 'ACTIVE' }
  ];
  return (
    <div className='admin-wrapper'>
      <div className="admin-table">
        <div className="admin-table__header">
          <h2 className="admin-table__header-title">Danh sách người dùng</h2>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }}>Tên</TableCell>
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Ngày sinh</TableCell>
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Giới tính</TableCell>
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Email</TableCell>
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((item) => (
                <TableRow
                  key={item._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.fullname}
                  </TableCell>
                  <TableCell align="center">{item.dob.slice(0, 10)}</TableCell>
                  <TableCell align="center">{item.gender}</TableCell>
                  <TableCell align="center">{item.email}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}
export default Users;