// scripts/apply-turso-migration.js
//
// Aplica a migracao "add_post_multiple_authors" direto no banco de producao (Turso),
// contornando a limitacao do prisma migrate deploy / db push, que nao entende URLs libsql://.
//
// Rode uma vez com (PowerShell):
//   $env:DATABASE_URL="libsql://SEU-BANCO.turso.io"; $env:TURSO_AUTH_TOKEN="SEU-TOKEN"; node scripts/apply-turso-migration.js
//
// Preserva todos os dados existentes: cada artigo mantem seu autor original,
// so muda a estrutura de "1 autor" para "varios autores".

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

    const existing = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='_PostAuthors'"
    );
    if (existing.rows.length > 0) {
        console.log('A tabela _PostAuthors ja existe. Migracao ja foi aplicada antes - nada a fazer.');
        return;
    }

    const before = await client.execute('SELECT COUNT(*) as c FROM Post');
    console.log('Artigos encontrados antes da migracao: ' + before.rows[0].c);

    const statements = [
        'CREATE TABLE "_PostAuthors" (' +
            '"A" INTEGER NOT NULL, ' +
            '"B" INTEGER NOT NULL, ' +
            'CONSTRAINT "_PostAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE, ' +
            'CONSTRAINT "_PostAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE' +
        ')',
        'INSERT INTO "_PostAuthors" ("A", "B") SELECT "id", "authorId" FROM "Post" WHERE "authorId" IS NOT NULL',
        'PRAGMA defer_foreign_keys=ON',
        'PRAGMA foreign_keys=OFF',
        'CREATE TABLE "new_Post" (' +
            '"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            '"title" TEXT NOT NULL, ' +
            '"content" TEXT, ' +
            '"category" TEXT NOT NULL, ' +
            '"status" TEXT NOT NULL DEFAULT \'Rascunho\', ' +
            '"imageUrl" TEXT, ' +
            '"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
            '"updatedAt" DATETIME NOT NULL' +
        ')',
        'INSERT INTO "new_Post" ("category", "content", "createdAt", "id", "imageUrl", "status", "title", "updatedAt") SELECT "category", "content", "createdAt", "id", "imageUrl", "status", "title", "updatedAt" FROM "Post"',
        'DROP TABLE "Post"',
        'ALTER TABLE "new_Post" RENAME TO "Post"',
        'PRAGMA foreign_keys=ON',
        'PRAGMA defer_foreign_keys=OFF',
        'CREATE UNIQUE INDEX "_PostAuthors_AB_unique" ON "_PostAuthors"("A", "B")',
        'CREATE INDEX "_PostAuthors_B_index" ON "_PostAuthors"("B")'
    ];

    for (let i = 0; i < statements.length; i++) {
        await client.execute(statements[i]);
        console.log('OK passo ' + (i + 1) + '/' + statements.length);
    }

    const after = await client.execute('SELECT COUNT(*) as c FROM Post');
    const authorsLinked = await client.execute('SELECT COUNT(*) as c FROM _PostAuthors');
    console.log('Artigos depois da migracao: ' + after.rows[0].c);
    console.log('Vinculos autor-artigo criados: ' + authorsLinked.rows[0].c);

    if (Number(before.rows[0].c) !== Number(after.rows[0].c)) {
        console.error('ATENCAO: a quantidade de artigos mudou! Verifique manualmente.');
        process.exit(1);
    }

    console.log('Migracao aplicada com sucesso. Nenhum dado foi perdido.');
}

main().catch((err) => {
    console.error('Erro ao aplicar a migracao:', err);
    process.exit(1);
});
