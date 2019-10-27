CREATE TABLE "storage" (
  "item_id" SERIAL      NOT NULL,
  "title"   VARCHAR(50) NOT NULL,
  "path"    VARCHAR(50) NOT NULL,
  "date"    TIME        WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),

  PRIMARY KEY("item_id"),
  UNIQUE("title"),
  UNIQUE("path")
);
