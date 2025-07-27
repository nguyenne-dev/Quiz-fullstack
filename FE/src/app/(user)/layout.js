export default function LayoutUser({ children }) {
  return (
    <>
      <header>header</header>
      <main>
        <h1>🎯 Đây là layout riêng cho phần người dùng</h1>
        {children}
      </main>
      <footer>footer</footer>
    </>
  );
}
