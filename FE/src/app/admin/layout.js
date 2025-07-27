"use client";
import Link from "next/link";
import { FaBars, FaTimes, FaTachometerAlt, FaBookOpen, FaQuestionCircle, FaCheckCircle, FaUserFriends } from "react-icons/fa";
import { usePathname } from "next/navigation";
import "./layout.css";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { href: "/admin", label: "Tổng quan", icon: <FaTachometerAlt /> },
    { href: "/admin/topic", label: "Chủ đề", icon: <FaBookOpen /> },
    { href: "/admin/question", label: "Câu hỏi", icon: <FaQuestionCircle /> },
    { href: "/admin/answer", label: "Câu trả lời", icon: <FaCheckCircle /> },
    { href: "/admin/user", label: "Người dùng", icon: <FaUserFriends /> },
  ];
  
  const title = navItems.find((item) => item.href === pathname)?.label || "";
  return (
    <>
      <div className="layout__admin">
        <aside className={isSidebarOpen ? "sidebar" : "sidebar collapsed"}>
          <img className="sidebar__logo" src="https://i.pravatar.cc/" alt="logo" />
          <ul className="sidebar__list">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    title={item.label}
                    href={item.href}
                    className={`flex items-center gap-2 ${isActive ? "sidebar__active" : ""}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {isSidebarOpen ? item.label : ""}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="admin-main">
          <header>
            <div className="header-left">
              <div className="header__opensidebar" onClick={() => { setIsSidebarOpen(!isSidebarOpen) }}>{isSidebarOpen ? <FaTimes /> : <FaBars />}</div>
              <div>{title}</div>
            </div>
            <div className="header__profile">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <div>Tên người dùng</div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </>
  );
}