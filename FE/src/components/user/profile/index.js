import FormProfile from "./FormProfile"
import SidebarProfile from "./SiderProfile"
import ChangePassword from "./ChangePassword"
import './Profile.css';
import { useState } from "react";

function PageProfile() {
  const [profilePage, setProfilePage] = useState("info")
  return (
    <>
      <div className="profile-wrapper">
        <SidebarProfile profilePage={profilePage} setProfilePage={setProfilePage} />
        {profilePage === "info" &&
          <FormProfile />
        }
        {profilePage === "changePass" &&
          <ChangePassword />
        }
      </div>
    </>
  )
}

export default PageProfile;