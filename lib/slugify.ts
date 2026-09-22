// Gera um slug amigável para URL a partir de um texto (ex: título de artigo).
// "Terras raras: formação da cadeia" -> "terras-raras-formacao-da-cadeia"
export function slugify(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // remove acentos
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

// Garante que o slug seja único entre os já existentes, adicionando um sufixo numérico se preciso.
export function uniqueSlug(base: string, existingSlugs: Set<string>): string {
    const slug = slugify(base) || 'artigo';
    if (!existingSlugs.has(slug)) return slug;

    let counter = 2;
    while (existingSlugs.has(`${slug}-${counter}`)) {
        counter++;
    }
    return `${slug}-${counter}`;
}
