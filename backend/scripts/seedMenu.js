const MenuItem = require("../models/MenuItem");

const menuItems = [
  {
    name: "Classic Cheese Burger",
    description: "Juicy beef patty with cheddar, lettuce, tomato, and special sauce",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    category: "burger",
    isVegetarian: false,
    isSpicy: false,
    rating: 4.5,
    deliveryTime: 25
  },
  {
    name: "Spicy Paneer Burger",
    description: "Crispy paneer patty with spicy mayo and jalapenos",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
    category: "burger",
    isVegetarian: true,
    isSpicy: true,
    rating: 4.2,
    deliveryTime: 30
  },
  {
    name: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella, and fresh basil",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    category: "pizza",
    isVegetarian: true,
    isSpicy: false,
    rating: 4.8,
    deliveryTime: 45
  },
  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken and spices",
    price: 349,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
    category: "biryani",
    isVegetarian: false,
    isSpicy: true,
    rating: 4.9,
    deliveryTime: 35
  }
];

const seedMenu = async () => {
  const count = await MenuItem.countDocuments();

  if (count > 0) {
    console.log("🍔 Menu already exists. Skipping seeding.");
    return;
  }

  await MenuItem.insertMany(menuItems);
  console.log(`✅ Seeded ${menuItems.length} menu items`);
};

module.exports = seedMenu;
