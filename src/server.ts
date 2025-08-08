import express, { Express } from "express";
import cors from "cors";
import knex from "knex";
import routes from "./routes/routes";

import "dotenv/config";

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});

const app: Express = express();
app.use(express.json());
app.use(cors());

routes(app, db);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});
