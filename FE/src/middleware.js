// import { NextResponse } from 'next/server';

// export async function middleware(request) {
//   const token = request.cookies.get('token')?.value;
//   const _id = request.cookies.get('_id')?.value;
//   const pathname = request.nextUrl.pathname;

//   const protectedRoutes = ['/profile'];

//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (isProtected) {
//     if (!token || !_id) {
//       const loginUrl = new URL('/login', request.url);
//       loginUrl.searchParams.set('redirect', pathname);
//       return NextResponse.redirect(loginUrl);
//     }

//     // Gọi API để kiểm tra token từ server
//     try {
//       const res = await fetch(`http://localhost:3002/auth/check`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token, _id })
//       });

//       const result = await res.json();

//       if (!result.success) {
//         const loginUrl = new URL('/login', request.url);
//         loginUrl.searchParams.set('redirect', pathname);
//         return NextResponse.redirect(loginUrl);
//       }
//     } catch (err) {
//       console.error("Middleware check error:", err);
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/profile/:path*']
// };

/*

*/

import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const _id = request.cookies.get('_id')?.value;
  const pathname = request.nextUrl.pathname;

  // Các route yêu cầu đăng nhập
  const protectedRoutes = ['/profile', '/admin'];

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
        return NextResponse.redirect(loginUrl);
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
  matcher: ['/profile/:path*', '/admin/:path*'],
};