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
    name: "Pepperoni Feast",
    description: "Loaded with double pepperoni and extra cheese",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop",
    category: "pizza",
    isVegetarian: false,
    isSpicy: true,
    rating: 4.6,
    deliveryTime: 40
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
  },
  {
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in a rich tomato-butter gravy",
    price: 289,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop",
    category: "indian",
    isVegetarian: true,
    isSpicy: false,
    rating: 4.7,
    deliveryTime: 30
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a gooey molten center",
    price: 149,
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/chocolate-lava-cake-index-65c25056f21fb.jpg",
    category: "dessert",
    isVegetarian: true,
    isSpicy: false,
    rating: 4.8,
    deliveryTime: 20
  },
  {
    name: "Greek Salad",
    description: "Fresh cucumbers, tomatoes, olives, and feta cheese",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
    category: "salad",
    isVegetarian: true,
    isSpicy: false,
    rating: 4.3,
    deliveryTime: 15
  }
];

const seedMenu = async () => {
  const existingCount = await MenuItem.countDocuments();

  if (existingCount <=4) {
    console.log("🍔 Menu already exists. Skipping seeding.");
    return;
  }

  await MenuItem.insertMany(menuItems);
  console.log(`✅ Menu seeded successfully with ${menuItems.length} items`);
};

module.exports = seedMenu;
