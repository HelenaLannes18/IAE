import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const isLoginPage = request.nextUrl.pathname === '/admin/login';
    const token = request.cookies.get('admin_session')?.value;

    const session = token ? await verifySessionToken(token) : null;

    // Não logado tentando acessar qualquer página /admin (exceto o login) -> manda pro login
    if (!session && !isLoginPage) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Já logado tentando acessar a página de login -> manda pro dashboard
    if (session && isLoginPage) {
        const dashboardUrl = new URL('/admin', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

// Roda apenas nas rotas administrativas
export const config = {
    matcher: ['/admin/:path*']
};
