/**
 * Retorna true quando o ambiente NÃO suporta SQLite (Vercel, Edge, etc.)
 * Na Vercel, o sistema de arquivos é read-only e node:sqlite não funciona.
 */
export function isServerless(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV !== undefined ||
    process.env.NODE_ENV === "production" && !process.env.ALLOW_SQLITE
  );
}
