import express, { json } from "express";
import "express-async-errors";
import cors from 'cors';
import chalk from 'chalk';
import router from "./routes/index.js"
import { errorHandlingMiddleware } from "./middlewares/errorHandler.js"
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(json());
app.use(cors());
app.use(router)
app.use(errorHandlingMiddleware)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(chalk.green.bold(`\nServer running on port ${port}...`));
});


export default app;