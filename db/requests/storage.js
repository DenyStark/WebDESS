module.exports = {
  'add': `
      INSERT INTO "storage" ("title", "path")
      VALUES ($title, $path)
      RETURNING "item_id" AS "id";`,

  'update': `
      UPDATE "storage"
      SET "date" = NOW()
      WHERE "item_id" = $id;`,

  'get': `
      SELECT "title", "path", "date"
      FROM "storage"
      WHERE "item_id" = $id;`,

  'get-all': `
      SELECT "item_id" AS "id", "title", "date"
      FROM "storage";`,
};