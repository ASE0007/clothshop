const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const products = [
  // Tops
  { name: "Silk Blouse", price: 49.99, discount: 0, category: "Tops", image: "/images/silk-blouse.jpg", stock: 24, stockLimit: 50 },
  { name: "Cotton T-Shirt", price: 19.99, discount: 10, category: "Tops", image: "/images/cotton-tshirt.jpg", stock: 60, stockLimit: 100 },
  { name: "Knit Sweater", price: 59.99, discount: 0, category: "Tops", image: "/images/knit-sweater.jpg", stock: 18, stockLimit: 40 },
  { name: "Denim Jacket", price: 79.99, discount: 15, category: "Tops", image: "/images/denim-jacket.jpg", stock: 12, stockLimit: 30 },
  { name: "Crop Top", price: 14.99, discount: 0, category: "Tops", image: "/images/crop-top.jpg", stock: 40, stockLimit: 60 },
  { name: "Polo Shirt", price: 34.99, discount: 5, category: "Tops", image: "/images/polo-shirt.jpg", stock: 22, stockLimit: 35 },
  { name: "Cardigan", price: 44.99, discount: 0, category: "Tops", image: "/images/cardigan.jpg", stock: 15, stockLimit: 25 },
  { name: "Hoodie", price: 39.99, discount: 20, category: "Tops", image: "/images/hoodie.jpg", stock: 33, stockLimit: 50 },
  // Dresses
  { name: "Summer Dress", price: 64.99, discount: 0, category: "Dresses", image: "/images/summer-dress.jpg", stock: 20, stockLimit: 35 },
  { name: "Cocktail Dress", price: 89.99, discount: 10, category: "Dresses", image: "/images/cocktail-dress.jpg", stock: 9, stockLimit: 20 },
  { name: "Maxi Dress", price: 74.99, discount: 0, category: "Dresses", image: "/images/maxi-dress.jpg", stock: 14, stockLimit: 25 },
  { name: "Midi Dress", price: 69.99, discount: 5, category: "Dresses", image: "/images/midi-dress.jpg", stock: 11, stockLimit: 20 },
  { name: "Wrap Dress", price: 79.99, discount: 0, category: "Dresses", image: "/images/wrap-dress.jpg", stock: 16, stockLimit: 30 },
  // Bottoms
  { name: "Jeans", price: 54.99, discount: 0, category: "Bottoms", image: "/images/jeans.jpg", stock: 30, stockLimit: 50 },
  { name: "Leather Pants", price: 89.99, discount: 10, category: "Bottoms", image: "/images/leather-pants.jpg", stock: 8, stockLimit: 15 },
  { name: "Skirt", price: 39.99, discount: 0, category: "Bottoms", image: "/images/skirt.jpg", stock: 25, stockLimit: 40 },
  { name: "Shorts", price: 29.99, discount: 5, category: "Bottoms", image: "/images/shorts.jpg", stock: 35, stockLimit: 55 },
  { name: "Trousers", price: 59.99, discount: 0, category: "Bottoms", image: "/images/trousers.jpg", stock: 19, stockLimit: 30 },
  // Outerwear
  { name: "Trench Coat", price: 119.99, discount: 10, category: "Outerwear", image: "/images/trench-coat.jpg", stock: 7, stockLimit: 12 },
  { name: "Puffer Jacket", price: 99.99, discount: 0, category: "Outerwear", image: "/images/puffer-jacket.jpg", stock: 10, stockLimit: 18 },
  { name: "Blazer", price: 84.99, discount: 5, category: "Outerwear", image: "/images/blazer.jpg", stock: 13, stockLimit: 22 },
  // Shoes
  { name: "Heels", price: 69.99, discount: 0, category: "Shoes", image: "/images/heels.jpg", stock: 28, stockLimit: 45 },
  { name: "Sneakers", price: 54.99, discount: 10, category: "Shoes", image: "/images/sneakers.jpg", stock: 45, stockLimit: 70 },
  { name: "Boots", price: 89.99, discount: 0, category: "Shoes", image: "/images/boots.jpg", stock: 17, stockLimit: 30 },
  { name: "Sandals", price: 34.99, discount: 5, category: "Shoes", image: "/images/sandals.jpg", stock: 38, stockLimit: 60 },
  // Accessories
  { name: "Handbag", price: 79.99, discount: 0, category: "Accessories", image: "/images/handbag.jpg", stock: 21, stockLimit: 35 },
  { name: "Scarf", price: 24.99, discount: 0, category: "Accessories", image: "/images/scarf.jpg", stock: 50, stockLimit: 80 },
  { name: "Hat", price: 19.99, discount: 10, category: "Accessories", image: "/images/hat.jpg", stock: 42, stockLimit: 70 },
  { name: "Belt", price: 29.99, discount: 0, category: "Accessories", image: "/images/belt.jpg", stock: 36, stockLimit: 55 },
  // Sleepwear
  { name: "Lingerie Set", price: 34.99, discount: 0, category: "Sleepwear", image: "/images/lingerie.jpg", stock: 27, stockLimit: 40 },
  { name: "Pajamas", price: 39.99, discount: 5, category: "Sleepwear", image: "/images/pajamas.jpg", stock: 23, stockLimit: 35 },
];

async function main() {
  await prisma.product.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => prisma.$disconnect());