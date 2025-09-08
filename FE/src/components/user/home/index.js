"use client"
import { useEffect } from "react";
import "./style.css";
import PageTopic from "../topic";
export default function HomePage() {
  useEffect(() => {
    // Observer để animate khi scroll
    const homeObserverOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const homeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, homeObserverOptions);

    document.querySelectorAll(".home-feature-card, .home-language-card").forEach((card) => {
      card.style.transition = "all 0.6s ease";
      homeObserver.observe(card);
    });

    // Smooth scroll
    const anchors = document.querySelectorAll('.home-page a[href^="#"]');
    const handleClick = (e) => {
      e.preventDefault();

    };
    anchors.forEach((anchor) => anchor.addEventListener("click", handleClick));

    // cleanup
    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener("click", handleClick));
      homeObserver.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      {/* Home Hero Section */}
      <section className="home-hero">
        <div className="home-container">
          <div className="home-hero__content">
            <div className="home-hero__text">
              <h1 className="home-hero__title">
                Nâng cao kỹ năng{" "}
                <span className="home-hero__title--highlight">lập trình</span> của bạn
              </h1>
              <p className="home-hero__description">
                Hàng nghìn câu hỏi trắc nghiệm từ cơ bản đến nâng cao về JavaScript, Python,
                Java, C++, và nhiều ngôn ngữ khác. Kiểm tra kiến thức và cải thiện kỹ năng
                coding mỗi ngày!
              </p>
              <div className="home-hero__buttons">
                <a href="topic" className="home-button home-button--primary">
                  🚀 Bắt đầu ngay
                </a>
                <a href="#" className="home-button home-button--outline">
                  📊 Xem demo
                </a>
              </div>
            </div>

            <div className="home-hero__demo">
              <div className="home-code-demo">
                <div className="home-code-demo__header">
                  <div className="home-code-demo__dots">
                    <div className="home-code-demo__dot home-code-demo__dot--red"></div>
                    <div className="home-code-demo__dot home-code-demo__dot--yellow"></div>
                    <div className="home-code-demo__dot home-code-demo__dot--green"></div>
                  </div>
                  <span className="home-code-demo__filename">quiz.js</span>
                </div>
                <div className="home-code-demo__content">
                  <div className="home-code-demo__line">
                    <span className="home-code-demo__keyword">function</span>{" "}
                    <span className="home-code-demo__function">checkAnswer</span>() {"{"}
                  </div>
                  <div className="home-code-demo__line home-code-demo__line--indent-1">
                    <span className="home-code-demo__keyword">if</span> (answer === correct) {"{"}
                  </div>
                  <div className="home-code-demo__line home-code-demo__line--indent-2">
                    <span className="home-code-demo__function">score</span>++;
                  </div>
                  <div className="home-code-demo__line home-code-demo__line--indent-1">{"}"}</div>
                  <div className="home-code-demo__line home-code-demo__comment">
                    // Bạn có thể làm được! 💪
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="home-container">
          <div className="home-features__header">
            <h2 className="home-features__title">Tại sao chọn CodeQuiz?</h2>
            <p className="home-features__subtitle">
              Chúng tôi cung cấp trải nghiệm học tập tốt nhất với các tính năng được thiết kế
              đặc biệt cho lập trình viên
            </p>
          </div>

          <div className="home-features__grid">
            <div className="home-feature-card">
              <div className="home-feature-card__icon">🎯</div>
              <h3 className="home-feature-card__title">Câu hỏi chất lượng cao</h3>
              <p className="home-feature-card__description">
                Rất nhiều câu hỏi được biên soạn bởi các chuyên gia, từ cơ bản đến nâng cao, phù hợp với mọi trình độ.
              </p>
            </div>

            <div className="home-feature-card home-feature-card--variant-2">
              <div className="home-feature-card__icon home-feature-card__icon--variant-2">📈</div>
              <h3 className="home-feature-card__title">Theo dõi tiến độ</h3>
              <p className="home-feature-card__description">
                Thống kê chi tiết về điểm số, thời gian làm bài và các chủ đề cần cải thiện để bạn học hiệu quả hơn.
              </p>
            </div>

            <div className="home-feature-card home-feature-card--variant-3">
              <div className="home-feature-card__icon home-feature-card__icon--variant-3">🏆</div>
              <h3 className="home-feature-card__title">Thử thách hàng ngày</h3>
              <p className="home-feature-card__description">
                Tham gia các cuộc thi, thử thách coding và xếp hạng với cộng đồng lập trình viên trên toàn quốc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Languages */}


      <section className="home-languages">
        <PageTopic />
        {/* <div className="home-container">
          <div className="home-languages__header">
            <h2 className="home-languages__title">Ngôn ngữ lập trình</h2>
            <p className="home-languages__subtitle">Luyện tập với các ngôn ngữ phổ biến nhất</p>
          </div>

          <div className="home-languages__grid">
            {[
              { icon: "🟨", name: "JavaScript", count: "+ câu hỏi" },
              { icon: "🐍", name: "Python", count: "+ câu hỏi" },
              { icon: "☕", name: "Java", count: "+ câu hỏi" },
              { icon: "⚡", name: "C++", count: "+ câu hỏi" },
              { icon: "🔷", name: "C#", count: "+ câu hỏi" },
              { icon: "🌐", name: "HTML/CSS", count: "+ câu hỏi" },
            ].map((lang, i) => (
              <div key={i} className="home-language-card">
                <div className="home-language-card__icon">{lang.icon}</div>
                <h4 className="home-language-card__name">{lang.name}</h4>
                <p className="home-language-card__count">{lang.count}</p>
              </div>
            ))}
          </div>
        </div> */}
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-container">
          <h2 className="home-cta__title">Sẵn sàng thử thách bản thân?</h2>
          <p className="home-cta__description">
            Tham gia cùng hơn 50,000+ lập trình viên đang nâng cao kỹ năng mỗi ngày tại CodeQuiz
          </p>
          <a href="/topic" className="home-button home-button--primary home-button--large">
            🎯 Làm bài thi đầu tiên
          </a>
          <div className="home-cta__features">
            <div className="home-cta__feature">
              <span>✅</span>
              <span>Miễn phí hoàn toàn</span>
            </div>
            <div className="home-cta__feature">
              <span>⚡</span>
              <span>Kết quả tức thì</span>
            </div>
            <div className="home-cta__feature">
              <span>🏅</span>
              <span>Chứng chỉ hoàn thành</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
