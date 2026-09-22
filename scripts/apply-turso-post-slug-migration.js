// scripts/apply-turso-post-slug-migration.js
//
// Aplica a migracao "add_post_slug" direto no banco de producao (Turso),
// contornando a limitacao do prisma migrate deploy / db push, que nao entende URLs libsql://.
//
// Rode uma vez com (PowerShell):
//   $env:DATABASE_URL="libsql://SEU-BANCO.turso.io"; $env:TURSO_AUTH_TOKEN="SEU-TOKEN"; node scripts/apply-turso-post-slug-migration.js
//
// Adiciona a coluna "slug" (unique, nullable) na tabela Post e gera um slug
// para cada artigo já existente, a partir do título. Não afeta nenhum outro dado.

const { createClient } = require('@libsql/client');

function slugify(text) {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

function uniqueSlug(base, existingSlugs) {
    const slug = slugify(base) || 'artigo';
    if (!existingSlugs.has(slug)) return slug;

    let counter = 2;
    while (existingSlugs.has(`${slug}-${counter}`)) {
        counter++;
    }
    return `${slug}-${counter}`;
}

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

    const columns = await client.execute('PRAGMA table_info("Post")');
    const hasSlug = columns.rows.some((row) => row.name === 'slug');

    if (!hasSlug) {
        await client.execute('ALTER TABLE "Post" ADD COLUMN "slug" TEXT');
        console.log('Coluna "slug" adicionada na tabela Post.');
    } else {
        console.log('Coluna "slug" já existe na tabela Post.');
    }

    const indexes = await client.execute('PRAGMA index_list("Post")');
    const hasUniqueIndex = indexes.rows.some((row) => row.name === 'Post_slug_key');
    if (!hasUniqueIndex) {
        await client.execute('CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug")');
        console.log('Índice único "Post_slug_key" criado.');
    } else {
        console.log('Índice único "Post_slug_key" já existe.');
    }

    const posts = await client.execute('SELECT id, title, slug FROM "Post" ORDER BY id ASC');
    const existingSlugs = new Set(posts.rows.map((p) => p.slug).filter(Boolean));

    let updated = 0;
    for (const post of posts.rows) {
        if (post.slug) continue;
        const slug = uniqueSlug(post.title, existingSlugs);
        existingSlugs.add(slug);
        await client.execute({
            sql: 'UPDATE "Post" SET slug = ? WHERE id = ?',
            args: [slug, post.id]
        });
        console.log(`Post #${post.id} "${post.title}" -> slug "${slug}"`);
        updated++;
    }

    console.log(`Concluído. ${updated} artigo(s) receberam slug novo.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
