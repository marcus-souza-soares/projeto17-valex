import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(json());
app.use(cors());


app.use(errorHandler)


const port = 5000;

app.listen(port, () => {
  console.log(chalk.green.bold(`\nServer running on port ${port}...`));
});


export default app;