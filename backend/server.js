require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const { seedMenu } = require("./scripts/seedMenu");

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const initializeData = async () => {
if (process.env.AUTO_SEED === "true") {
  await seedMenu();
}
}
initializeData();


const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
