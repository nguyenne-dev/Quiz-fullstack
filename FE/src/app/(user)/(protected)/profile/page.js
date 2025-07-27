// "use client"
// import { useEffect, useState } from 'react';
// import './Profile.css';
// import { getMe, updateInfo } from '../../../../services/authService';

// function Profile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [showNotify, setShowNotify] = useState(false);
//   const [message, setMessage] = useState("!");
//   const [severity, setSeverity] = useState("success"); // success | error

//   const [formData, setFormData] = useState({});


//   useEffect(() => {
//     const fetchUser = async () => {
//       const user = await getMe(); // gọi toàn bộ user
//       // setFormData(user)
//       setFormData({
//         id: user._id || "",
//         fullname: user.fullname || "",
//         email: user.email || "",
//         gender: user.gender || "male",
//         dob: user.dob ? user.dob.substring(0, 10) : "", // cắt yyyy-mm-dd
//       });
//     };

//     fetchUser();
//   }, [isEditing]);

//   // console.log(formData)

//   //Xác nhận cập nhật thông tin
//   const handleSubmit = () => {
//     // Kiểm tra 2 mật khẩu đã nhập chưa
//     if (formData.fullname === "" || formData.email === "" || formData.dob === "" || formData.gender === "") {
//       setSeverity("error");
//       setMessage("Vui lòng thông tin đầy đủ để cập nhật!");
//       setShowNotify(true);
//       setTimeout(() => setShowNotify(false), 3000);
//       return;
//     }

//     // Gội API đổi thông tin
//     console.log(formData)
//     const fetchApi = async () => {
//       const result = await updateInfo(formData)
//       // const result = true;
//       if (result.success) {
//         setFormData(result);
//         setSeverity("success");
//         setMessage("Cập nhật thành công!");
//         setShowNotify(true);
//       } else {
//         setSeverity("error");
//         setMessage("Cập nhật thất bại!");
//         setShowNotify(true);
//       }
//       setTimeout(() => setShowNotify(false), 3000);
//     }; fetchApi();
//     setIsEditing(false);
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value?.trim() || ""
//     }));
//   };

//   return (
//     <div className="profile-wrapper">
//       <div className="profile">
//         {showNotify && (
//           <div className={`profile__notify profile__notify--${severity}`}>
//             {message}
//           </div>
//         )}

//         <h2 className="profile__title">Thông tin người dùng</h2>

//         <div className="profile__form">
//           <div className="profile__group">
//             <label className="profile__label">Họ tên</label>
//             <input
//               name="fullname"
//               value={formData.fullname || ""}
//               onChange={handleChange}
//               readOnly={!isEditing}
//               className="profile__input"
//             />
//           </div>

//           <div className="profile__group">
//             <label className="profile__label">Địa chỉ email</label>
//             <input
//               name="email"
//               value={formData.email || ""}
//               readOnly={true}
//               className="profile__input"
//             />
//           </div>

//           <div className="profile__group">
//             <label className="profile__label">Giới tính</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="profile__input"
//             >
//               <option value="male">Nam</option>
//               <option value="female">Nữ</option>
//               <option value="other">Khác</option>
//             </select>
//           </div>

//           <div className="profile__group">
//             <label className="profile__label">Ngày sinh</label>
//             <input
//               type="date"
//               name="dob"
//               value={formData.dob || ""}
//               onChange={handleChange}
//               readOnly={!isEditing}
//               className="profile__input"
//             />
//           </div>

//           {!isEditing && (
//             <button className="profile__button profile__button--edit" onClick={() => { setIsEditing(true); }}>
//               Edit Profile
//             </button>
//           )}
//           {isEditing && (
//             <div className='profile__button--groupEdit'>
//               <button className="profile__button profile__button--exit" onClick={() => setIsEditing(false)}>
//                 Cancel
//               </button>
//               <button className="profile__button profile__button--save" onClick={handleSubmit}>
//                 Save Changes
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;
"use client"
import PageProfile from "../../../../components/user/profile/index"
function Profile() {
  return (
    <>
      Profile
      <PageProfile />
    </>
  )
}

export default Profile;