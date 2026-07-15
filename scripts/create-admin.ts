// scripts/create-admin.ts
// Rode uma vez com: npx tsx scripts/create-admin.ts
// (ou: npx ts-node scripts/create-admin.ts)
//
// Cria (ou atualiza a senha de) o primeiro usuário administrador,
// necessário para conseguir logar pela primeira vez no painel.

import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'admin@iae.com.br'; // troque pelo e-mail que você quer usar
    const plainPassword = 'troque-esta-senha'; // troque por uma senha forte

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword, status: 'Ativo', role: 'Administrador' },
        create: {
            name: 'Administrador',
            email,
            password: hashedPassword,
            role: 'Administrador',
            status: 'Ativo'
        }
    });

    console.log(`Usuário administrador pronto: ${admin.email}`);
    console.log(`Senha: ${plainPassword} (troque depois de logar!)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });