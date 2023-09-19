import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import productRoutes from "./routes/productRoute.js"
import cors from 'cors'


//configure env
dotenv.config();

//Database Config
connectDB();

//Rest Object
const app = express();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes);


//Port
const Port = process.env.PORT || 8080;

//Run Listen
app.listen(Port,()=>{
    console.log(`Server is running on ${Port}`);
});
