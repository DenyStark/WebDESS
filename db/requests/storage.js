module.exports = {
  'add': `
      INSERT INTO "storage" ("title", "path")
      VALUES ($title, $path)
      RETURNING "item_id" AS "id";`,
};
