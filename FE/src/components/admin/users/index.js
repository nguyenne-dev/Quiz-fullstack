// 'use client'
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import './style.css';
// import { useEffect, useState } from 'react';
// import { getAllUser } from '../../../services/authService';
// function Users() {
//   const [users, setUsers] = useState([]);
//   useEffect(() => {
//     const fetchApi = async () => {
//       const result = await getAllUser();
//       // console.log(result)
//       setUsers(result.data)
//     }; fetchApi();
//   }, [])

//   console.log(users)

//   return (
//     <div className='admin-wrapper'>
//       <div className="admin-table">
//         <div className="admin-table__header">
//           <h2 className="admin-table__header-title">Danh sách người dùng</h2>
//         </div>
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }}>Tên</TableCell>
//                 <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Ngày sinh</TableCell>
//                 <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Giới tính</TableCell>
//                 <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Email</TableCell>
//                 <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Vai trò</TableCell>
//                 <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Trạng thái</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {users.map((item) => (
//                 <TableRow
//                   key={item._id}
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                 >
//                   <TableCell component="th" scope="row">
//                     {item.fullname}
//                   </TableCell>
//                   <TableCell align="center">{item.dob.slice(0, 10)}</TableCell>
//                   <TableCell align="center">{item.gender}</TableCell>
//                   <TableCell align="center">{item.email}</TableCell>
//                   <TableCell align="center">{item.role}</TableCell>
//                   <TableCell align="center">{item.status}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   )
// }
// export default Users;

'use client'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import './style.css';
import { useEffect, useState } from 'react';
import { getAllUser, role, status } from '../../../services/authService';

function Users() {
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(Date.now());

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getAllUser();
      setUsers(result.data);
    };
    fetchApi();
  }, [reload]);

  // 🔹 Hàm update role
  const handleUpdateRole = async (userId, fullname, newRole) => {
    if (confirm(`Bạn có chắc muốn đổi vai trò của ${fullname} thành "${newRole}" không?`)) {
      // await updateUserRole(userId, newRole)
      const result = await role(userId, { role: newRole });
      if (result.success) {
        setReload(Date.now())
      }
    }
  };

  // 🔹 Hàm update status
  const handleUpdateStatus = async (userId, fullname, newStatus) => {
    if (confirm(`Bạn có chắc muốn đổi trạng thái của ${fullname} thành "${newStatus}" không?`)) {
      console.log("Update status:", { id: userId, newStatus });
      const result = await status(userId, { status: newStatus })
      if (result.success) {
        setReload(Date.now())
      }
    }
  };

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
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Vai trò</TableCell>
                <TableCell sx={{ fontSize: '20px', fontWeight: 'bold' }} align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((item) => (
                <TableRow key={item._id}>
                  <TableCell component="th" scope="row">
                    {item.fullname}
                  </TableCell>
                  <TableCell align="center">{item.dob?.slice(0, 10)}</TableCell>
                  <TableCell align="center">{item.gender}</TableCell>
                  <TableCell align="center">{item.email}</TableCell>

                  {/* Vai trò */}
                  <TableCell align="center" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    <Select
                      value={item.role || "user"} // mặc định user nếu không có
                      onChange={(e) => handleUpdateRole(item._id, item.fullname, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="ADMIN">Admin</MenuItem>
                      <MenuItem value="USER">User</MenuItem>
                    </Select>
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell align="center" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    <Select
                      value={item.status || "Không rõ"} // mặc định inactive nếu không có
                      onChange={(e) => handleUpdateStatus(item._id, item.fullname, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                      <MenuItem value="BANNED">Banned</MenuItem>
                    </Select>
                  </TableCell>
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
