import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import connection from "./db.js";
import userRoutes from "./routes/reg.js";
import authRoutes from "./routes/login.js";
import forgotpswd from "./routes/forgotpswd.js";
import resetpswd from "./routes/resetpswd.js";
import Todo_add from "./routes/todo_add.js";
import Todo_delete from "./routes/todo_delete.js";
import Todo_get from "./routes/todo_get.js";
import Todo_update from "./routes/todo_update.js";
import Todo_priority from "./routes/todo_getpriority.js";
import Todo_personal from "./routes/todo_getorg.js";
import Todo_work from "./routes/todo_work.js";
import Chart_data from "./routes/chartdata.js";
import Kanban from "./routes/kanban.js";
import Notifications from "./routes/notis.js";
import bodyParser from "body-parser";
import collaboratorRoutes from "./routes/collaborators.js";
import groupRoutes from "./routes/groups.js";
import Assign from "./routes/assign.js";
import Users from "./routes/getusers.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new SocketIoServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: "http://localhost:5173"
}));

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "1000mb" }));

// Database connection
connection();

// Routes
app.use("/api/reg", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/forgot-password", forgotpswd);
app.use("/api/reset-password", resetpswd);
app.use("/api/addtodo", Todo_add);
app.use("/api/updatetodo", Todo_update);
app.use("/api/gettodo", Todo_get);
app.use("/api/deletetodo", Todo_delete);
app.use("/api/todopriority", Todo_priority);
app.use("/api/todopersonal", Todo_personal);
app.use("/api/todowork", Todo_work);
app.use("/api/chart_data", Chart_data);
app.use("/api/kanban", Kanban);
app.use("/api/notifications", Notifications);
app.use("/api/collaborators", collaboratorRoutes);
app.use("/api", groupRoutes);
app.use("/api/assignTask", Assign);
app.use("/api/users", Users);

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Define port
const PORT = process.env.PORT || 3001;

// Start the server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
