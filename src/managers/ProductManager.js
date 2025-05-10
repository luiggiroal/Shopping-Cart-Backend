const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  // static lastID = 0;
  constructor() {
    this.filepath = path.join(__dirname, "../db/products.json");
  }

  async readProducts() {
    try {
      const data = await fs.readFile(this.filepath, "utf8");
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Error when reading products:", err);
      return [];
    }
  }

  async writeProducts(products) {
    try {
      await fs.writeFile(this.filepath, JSON.stringify(products, null, 2));
    } catch (err) {
      console.error("Error when saving products", err);
      throw err;
    }
  }
}

module.exports = ProductManager;
