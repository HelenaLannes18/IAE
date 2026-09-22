// scripts/apply-turso-user-bio-migration.js
//
// Aplica a migracao "add_user_bio" direto no banco de producao (Turso),
// contornando a limitacao do prisma migrate deploy / db push, que nao entende URLs libsql://.
//
// Rode uma vez com (PowerShell):
//   $env:DATABASE_URL="libsql://SEU-BANCO.turso.io"; $env:TURSO_AUTH_TOKEN="SEU-TOKEN"; node scripts/apply-turso-user-bio-migration.js
//
// Adiciona a coluna "bio" (nullable) na tabela User. Não afeta nenhum dado existente.

const { createClient } = require('@libsql/client');

async function main() {
    const url = process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !url.startsWith('libsql://')) {
        console.error('Defina DATABASE_URL (formato libsql://...) antes de rodar este script.');
        process.exit(1);
    }
    if (!authToken) {
        console.error('Defina TURSO_AUTH_TOKEN antes de rodar este script.');
        process.exit(1);
    }

    const client = createClient({ url, authToken });

    const columns = await client.execute('PRAGMA table_info("User")');
    const hasBio = columns.rows.some((row) => row.name === 'bio');

    if (hasBio) {
        console.log('A coluna "bio" já existe na tabela User. Migração já foi aplicada antes - nada a fazer.');
        return;
    }

    await client.execute('ALTER TABLE "User" ADD COLUMN "bio" TEXT');
    console.log('Coluna "bio" adicionada com sucesso na tabela User.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
