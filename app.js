import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import menuRouter from "./router/menuRouter.js";
import userRouter from "./router/userRouter.js";
import feedbackrouter from './router/feedbackrouter.js'
import orderRouter from './router/orderRouter.js'
import tableRouter from './router/tableRouter.js'
import bookingRouter from './router/bookingRouter.js'
import waiterRouter from './router/waiterRouter.js'
require('dotenv').config();

const app = express();
app.use(cors()); // Allow all origins temporarily

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/feedback", feedbackrouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/table", tableRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/waiter", waiterRouter);

connection();
app.use(errorMiddleware);

export default app;
