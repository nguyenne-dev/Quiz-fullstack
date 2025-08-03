"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { verify } from "@/services/authService";
import "./verify.css"
import { verify } from "../../../../services/authService";

export default function VerifyPage() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Đang xác minh");

  useEffect(() => {
    if (token) {
      const fetchApi = async () => {
        const result = await verify(token);
        console.log(result.message)
        if (!result.user) {
          setStatus(`❌ Xác minh thất bại ${result.message}`);
        } else {
          setStatus(`✅ Xác minh thành công ${result.message}`);
          // alert(`✅ Xác minh thành công ${result.message}`)
          // router.push("/")
        }
      };
      fetchApi();
    } else {
      setStatus("📩 Mã xác thực đã được gửi tới email của bạn. Vui lòng kiểm tra email để xác minh tài khoản!")
    }
  }, [token]);


  return (
    <>
      <div className="verify-container">
        <div className="verify-card">
          {/* Trạng thái xác thực */}
          <div className="verify-status-box">
            <h2 className="verify-status">{status}</h2>
          </div>

          {/* Điều hướng */}
          <div className="verify-actions-box">
            <h3 className="verify-actions-title">Thực hiện tiếp:</h3>
            <div className="verify-actions">
              <a href="https://gmail.com" className="verify-link">📩 Kiểm tra email</a>
              <a href="/" className="verify-link">🏠 Về trang chủ</a>
              <a href="/login" className="verify-link">🔐 Đăng nhập</a>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}