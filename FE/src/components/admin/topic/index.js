"use client"
import { useState } from 'react';
import ListTopic from './ListTopic'
import AddTopicForm from './AddTopic'
function Topic() {
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [reload, setReload] = useState(Date.now());

  const [showNotify, setShowNotify] = useState(false);
  const [message, setMessage] = useState("!");
  const [severity, setSeverity] = useState("success"); // success | error
  return (
    <>
      <div className="topic-wrapper">
        {showNotify && (
          <div className={`notify notify--${severity}`}>
            {message}
          </div>
        )}
        <div className="topic-table">
          <div className="topic-table__header">
            <h2 className="topic-table__header-title">Chủ đề</h2>
            <button className="topic-table__header-btn" onClick={() => setShowFormAdd(true)}>
              <span>➕</span> Thêm Chủ đề
            </button>
          </div>
          {showFormAdd && <AddTopicForm onClose={() => setShowFormAdd(false)} onReload={() => setReload(Date.now())} setShowNotify={setShowNotify} setMessage={setMessage} setSeverity={setSeverity} />}

          <ListTopic reLoad={reload} onReload={() => setReload(Date.now())} setShowNotify={setShowNotify} setMessage={setMessage} setSeverity={setSeverity} />

        </div>
      </div>
    </>
  )
}

export default Topic;