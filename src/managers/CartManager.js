const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor() {
    this.filepath = path.join(__dirname, "../db/carts.json");
  }

  async readCarts() {
    try {
      const data = await fs.readFile(this.filepath, "utf8");
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Error when reading carts:", err);
      return [];
    }
  }

  async writeCarts(carts) {
    try {
      await fs.writeFile(this.filepath, JSON.stringify(carts, null, 2));
    } catch (err) {
      console.error("Error when saving carts", err);
      throw err;
    }
  }
}

module.exports = CartManager;
