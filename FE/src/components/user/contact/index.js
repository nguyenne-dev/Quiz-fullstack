"use client"
import "./style.css";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Tin nhắn của bạn đã được gửi!");
  };

  return (
    <section id="contact" className="bg-white">
      <div className="contact-container">
        <div className="container">
          <div className="section-title ">
            <h2>Liên Hệ</h2>
            <p>Hãy liên hệ với tôi nếu có vấn đề cần trợ giúp</p>
          </div>

          <div className="contact-grid">
            {/* Contact Info */}
            <div>
              <div className="contact-info">
                <h3>Thông Tin Liên Hệ</h3>

                <div className="contact-item">
                  <div className="contact-icon contact-blue">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <p>Email</p>
                    <p>nguyenne.dev@gmail.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon contact-green">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <p>Điện thoại</p>
                    <p>+84 866 458 318</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon contact-gray">
                    <i className="fab fa-github"></i>
                  </div>
                  <div className="contact-details">
                    <p>GitHub</p>
                    <p>github.com/nnguyenne/</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  marginBottom: "24px",
                  color: "#1f2937",
                }}
              >
                Gửi Tin Nhắn
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Chủ đề</label>
                  <input type="text" placeholder="Chủ đề tin nhắn" required />
                </div>

                <div className="form-group">
                  <label>Tin nhắn</label>
                  <textarea
                    rows="5"
                    placeholder="Nội dung tin nhắn..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
