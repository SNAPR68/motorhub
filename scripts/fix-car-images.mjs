/**
 * Fix car catalog images in the database
 * Updates NewCarModel records to use local /public/cars/ images
 * instead of generic Unsplash stock photos
 */

import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL });

const IMAGE_MAP = {
  brezza: "/cars/brezza.jpg",
  swift: "/cars/swift.jpg",
  ertiga: "/cars/ertiga.jpg",
  creta: "/cars/creta.jpg",
  i20: "/cars/i20.jpg",
  nexon: "/cars/nexon.jpg",
  "nexon-ev": "/cars/nexon-ev.jpg",
  punch: "/cars/punch.jpg",
  xuv700: "/cars/xuv700.jpg",
  thar: "/cars/thar.jpg",
  city: "/cars/sedan.jpg",
  fortuner: "/cars/fortuner.jpg",
  hyryder: "/cars/hyryder.jpg",
  seltos: "/cars/seltos.jpg",
  sonet: "/cars/sonet.jpg",
  hector: "/cars/hector.jpg",
};

async function main() {
  await client.connect();
  console.log("Connected to database\n");

  // Check table name
  const tables = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%car%' OR table_name LIKE '%model%'`
  );
  console.log("Tables found:", tables.rows.map((r) => r.table_name).join(", "));

  // Find the new car model table
  const modelTable = tables.rows.find(
    (r) => r.table_name === "new_car_models" || r.table_name === "NewCarModel"
  );

  if (!modelTable) {
    console.log("\nLooking for any table with 'model' or 'car'...");
    const allTables = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    console.log("All tables:", allTables.rows.map((r) => r.table_name).join(", "));
    await client.end();
    return;
  }

  const tableName = modelTable.table_name;
  console.log(`\nUsing table: ${tableName}`);

  // Get current records
  const models = await client.query(`SELECT id, slug, name, image, gallery FROM ${tableName}`);
  console.log(`Found ${models.rows.length} models\n`);

  let updated = 0;
  for (const model of models.rows) {
    const localImage = IMAGE_MAP[model.slug];
    if (!localImage) {
      console.log(`  ? ${model.name} (slug: ${model.slug}) -- no local image mapped, skipping`);
      continue;
    }

    const needsUpdate =
      model.image !== localImage ||
      !model.gallery ||
      model.gallery.length !== 1 ||
      model.gallery[0] !== localImage;

    if (needsUpdate) {
      await client.query(
        `UPDATE ${tableName} SET image = $1, gallery = $2 WHERE id = $3`,
        [localImage, [localImage], model.id]
      );
      console.log(`  Updated: ${model.name} -- ${model.image} -> ${localImage}`);
      updated++;
    } else {
      console.log(`  OK: ${model.name} -- already correct`);
    }
  }

  console.log(`\nDone. Updated ${updated} of ${models.rows.length} models.`);
  await client.end();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
