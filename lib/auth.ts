import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'dev-secret-troque-isso-em-producao'
);

export interface SessionPayload {
    userId: number;
    email: string;
    name: string;
    role: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

// Lê a sessão do admin a partir do cookie da requisição atual.
// Use no início de qualquer rota de API que só deve ser acessível pelo painel administrativo.
export async function getAdminSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return null;
    return verifySessionToken(token);
}
