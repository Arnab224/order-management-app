require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const seedMenu = require("./scripts/seedMenu");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    if (process.env.AUTO_SEED === "true") {
      await seedMenu();
    }

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);
    });

    app.set("io", io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server startup failed", err);
    process.exit(1);
  }
};

startServer();
