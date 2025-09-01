import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const _id = request.cookies.get('_id')?.value;
  const pathname = request.nextUrl.pathname;

  // Các route yêu cầu đăng nhập
const protectedRoutes = ['/profile', '/admin', '/Question', '/submissions'];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Nếu chưa đăng nhập
    if (!token || !_id) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Gửi request lên server để xác thực token
    try {
      const res = await fetch('http://localhost:3002/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, _id })
      });

      const result = await res.json();

      if (!result.success) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        // Tạo response: Xóa cookie, chuyển về trang đăng nhập
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('token');
        response.cookies.delete('_id');
        return response;
      }

      // Nếu đang vào /admin mà không phải ADMIN thì chuyển về /
      if (pathname.startsWith('/admin') && result.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      console.error('Middleware error:', err);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Cho phép tiếp tục
  return NextResponse.next();
}

// Các route áp dụng middleware
export const config = {
  matcher: ['/profile/:path*', '/Question/:path*', '/submissions/:path*', '/admin/:path*'],
};
