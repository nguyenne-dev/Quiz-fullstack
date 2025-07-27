
import { useState } from "react";
import { send_repass_email } from "../../../services/authService";
function FormForGot({ setShow }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    if (email === "") {
      setIsLoading(false)
      return alert("Vui lòng nhập email");
    }
    const result = await send_repass_email({ email });
    console.log(result)
    if (result.success) {
      setShow(false)
      alert(`OK: ${result.message}`);
      return;
    }
    alert(`Lỗi: ${result.message}`);
    setIsLoading(false)
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="forget-form">
        <div className="close-Show" onClick={() => setShow(false)}>x</div>
        <h2 className="form-title">Quên mật khẩu</h2>
        <div className="form-group">
          <label htmlFor="password">Nhập email đăng ký</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>
        <button type="submit" className="login-btn" disabled={isLoading}>{isLoading ? "Xin chờ . . ." : "Xác nhận"}</button>
      </form>
    </>
  )
}

export default FormForGot;