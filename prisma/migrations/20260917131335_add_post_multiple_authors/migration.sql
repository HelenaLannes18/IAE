-- CreateTable
CREATE TABLE "_PostAuthors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PostAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PostAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Preserva o autor original de cada artigo como o primeiro autor da nova relação N:N
INSERT INTO "_PostAuthors" ("A", "B") SELECT "id", "authorId" FROM "Post" WHERE "authorId" IS NOT NULL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Rascunho',
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Post" ("category", "content", "createdAt", "id", "imageUrl", "status", "title", "updatedAt") SELECT "category", "content", "createdAt", "id", "imageUrl", "status", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_PostAuthors_AB_unique" ON "_PostAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_PostAuthors_B_index" ON "_PostAuthors"("B");
