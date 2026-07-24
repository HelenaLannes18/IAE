// Caminho: app/api/enviar-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicialize com a sua chave (coloque isso no arquivo .env.local)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Desestruturando os dados enviados pelo formulário
        const { nome, email, telefone, situacao, programa, tipoAcao } = data;

        const { data: emailResponse, error } = await resend.emails.send({
            from: 'Seu Site <helena.lannes.salles@hotmail.com>', // No modo produção, use um e-mail do seu domínio
            to: ['helena.lannes.salles@hotmail.com'], // Para onde o e-mail da empresa vai
            subject: `Novo Lead: ${tipoAcao} - ${programa}`,
            html: `
                <h2>Nova solicitação recebida pelo site!</h2>
                <p><strong>Programa:</strong> ${programa}</p>
                <p><strong>Ação:</strong> ${tipoAcao}</p>
                <hr />
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Situação:</strong> ${situacao}</p>
            `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}