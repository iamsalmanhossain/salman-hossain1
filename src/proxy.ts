import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // ১. ইউজার কোন পাথ বা লিংকে যেতে চাচ্ছে তা বের করা
  const path = request.nextUrl.pathname;

  // ২. কোন কোন রাউটগুলো প্রোটেক্টেড (লগইন ছাড়া যাওয়া যাবে না) তা ঠিক করা
  // যেমন: /dashboard বা /admin দিয়ে শুরু হওয়া যেকোনো পেজ
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/admin');
  
  // পাবলিক রাউট (যেগুলোতে লগইন থাকা অবস্থায় গেলে ড্যাশবোর্ডে পাঠিয়ে দেবে)
  const isPublicRoute = path === '/login' || path === '/register';

  // ৩. কুকি থেকে ইউজারের টোকেন বা অথরাইজেশন চেক করা 
  // (আপনার প্রজেক্টে কুকির নাম 'token', 'session' বা অন্য কিছু হতে পারে)
  const token = request.cookies.get('token')?.value || '';

  // ৪. যদি প্রোটেক্টেড রাউটে যায় এবং টোকেন না থাকে, তবে লগইন পেজে রিডাইরেক্ট করা
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ৫. যদি ইউজার লগইন করা থাকে (টোকেন আছে) এবং সে লগইন পেজে যায়, 
  // তাহলে তাকে ড্যাশবোর্ডে পাঠিয়ে দেওয়া
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ৬. বাকি সব রিকোয়েস্ট স্বাভাবিকভাবে চলতে দেওয়া
  return NextResponse.next();
}

// কোন কোন পাথের জন্য এই মিডলওয়্যার কাজ করবে তা matcher-এ বলে দেওয়া
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g. .svg, .png, .jpg, .jpeg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
