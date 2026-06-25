import { io } from "socket.io-client";

<<<<<<< HEAD
export const socket = io("http://localhost:4000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});
=======
export const socket = io("http://localhost:4000");
>>>>>>> 2dd4ce805b7aad3bc55bbf21d9d39ac546ff058b
