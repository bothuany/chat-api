const express = require("express");
const cors = require("cors");
const applicationRoute = require("./routes/applicationRoute");
const chatRoute = require("./routes/chatRoute");
const userRoute = require("./routes/userRoute");
const messageRoutes = require("./routes/messageRoute");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const app = express();

const connectDB = require("./config/db");
const path = require("path");
require("dotenv").config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/applications", applicationRoute);
app.use("/chats", chatRoute);
app.use("/messages", messageRoutes);
app.use("/users", userRoute);
//----------Deployment----------//
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "index.html"));
  });
}

//----------Deployment----------//

app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("leave chat", (room) => {
    socket.leave(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;

    if (!chat.users) return console.log("chat.users is undefined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit("message received", newMessage);
    });
  });

  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
