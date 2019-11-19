module.exports = {
  'add': `
      INSERT INTO "storage" ("title", "path")
      VALUES ($title, $path)
      RETURNING "item_id" AS "id";`,

  'update': `
      UPDATE "storage"
      SET "date" = NOW()
      WHERE "title" = $title;`,

  'delete': `
      DELETE FROM "storage"
      WHERE "title" = $title;`,

  'get': `
      SELECT "path", "date"
      FROM "storage"
      WHERE "title" = $title;`,

  'get-all': `
      SELECT "title", "date"
      FROM "storage"
      ORDER BY "date" DESC;`,
};
