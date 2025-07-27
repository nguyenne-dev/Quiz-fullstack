import { FaUser, FaLock } from "react-icons/fa";
function SidebarProfile({ profilePage, setProfilePage }) {
  return (
    <>
      <div className="sidebar-profile">
        <h2 className="sidebar-title">Menu</h2>
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${profilePage === "info" ? "active" : ""}`} onClick={() => { setProfilePage("info") }}><FaUser style={{ fontSize:"16px" }} />Thông tin cá nhân</li>
          <li className={`sidebar-item ${profilePage === "changePass" ? "active" : ""}`} onClick={() => { setProfilePage("changePass") }}><FaLock style={{ fontSize:"16px" }} />Đổi mật khẩu</li>

          <li title="Thông tin cá nhân" className={`sidebar-item-fold ${profilePage === "info" ? "active" : ""}`} onClick={() => { setProfilePage("info") }}><FaUser style={{ fontSize:"16px" }} /></li>
          <li title="Đổi mật khẩu" className={`sidebar-item-fold ${profilePage === "changePass" ? "active" : ""}`} onClick={() => { setProfilePage("changePass") }}><FaLock style={{ fontSize:"16px" }} /></li>
        </ul>
      </div>
    </>
  )
}

export default SidebarProfile;