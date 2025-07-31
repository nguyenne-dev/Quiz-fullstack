"use client"
import "./style.css"
import ListQuestion from "./ListQuestion"
import AddQuestion from "./AddQuestion"
import { useState } from "react";
function Question() {
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [reload, setReload] = useState(Date.now());

  const [showNotify, setShowNotify] = useState(false);
  const [message, setMessage] = useState("!");
  const [severity, setSeverity] = useState("success"); // success | error
  return (
    <div className="admin-wrapper">
      {showNotify && (
        <div className={`notify notify--${severity}`}>
          {message}
        </div>
      )}
      <div className="admin-table">
        <div className="admin-table__header">
          <h2 className="admin-table__header-title">Câu hỏi</h2>
          <button className="admin-table__header-btn" onClick={() => setShowFormAdd(true)}>
            <span>➕</span> Thêm Câu Hỏi
          </button>
        </div>
        <ListQuestion reLoad={reload} onReload={() => setReload(Date.now())} setShowNotify={setShowNotify} setMessage={setMessage} setSeverity={setSeverity} />
        {showFormAdd && <AddQuestion onClose={() => setShowFormAdd(false)} onReload={() => setReload(Date.now())} setShowNotify={setShowNotify} setMessage={setMessage} setSeverity={setSeverity} />}
      </div>
    </div>
  )
}

export default Question;