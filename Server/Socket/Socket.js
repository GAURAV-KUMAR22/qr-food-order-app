export default function socketIo(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Admin joins admin room
    socket.on("join-admin", () => {
      socket.join("admin-room");
      console.log(`Socket ${socket.id} joined admin-room`);
    });

    // Notify admins about a new order
    socket.on("order-placed", () => {
      io.to("admin-room").emit("placed-order", () => {
        console.log("admin in the room");
      });
      console.log(`Order placed`);
    });

    // Notify admins about order status update
    socket.on("order-updated", () => {
      io.to("admin-room").emit("order-updated-status");
      console.log(`Order updated:`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
