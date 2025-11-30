import { sequelize } from "./config/db";
import Location from "./models/Location";
import Inventory from "./models/Inventory";

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const locationsData = [
      "მთავარი ოფისი",
      "კავეა გალერია",
      "კავეა თბილისი მოლი",
      "კავეა ისთ ფოინთი",
      "კავეა სითი მოლი",
    ];

    const locationInstances = [];
    for (const name of locationsData) {
      const loc = await Location.create({ name });
      locationInstances.push(loc);
    }

    const BATCH_SIZE = 10000;
    const TOTAL_PRODUCTS = 500000;

    for (
      let batchStart = 1;
      batchStart <= TOTAL_PRODUCTS;
      batchStart += BATCH_SIZE
    ) {
      const products = [];
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, TOTAL_PRODUCTS);

      for (let i = batchStart; i <= batchEnd; i++) {
        const randomLoc =
          locationInstances[
            Math.floor(Math.random() * locationInstances.length)
          ];

        products.push({
          name: `Product ${i}`,
          price: parseFloat((Math.random() * 100 + 1).toFixed(2)),
          locationId: randomLoc?.id,
        });
      }

      await Inventory.bulkCreate(products);
    }

    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}

seed();
