import express from "express";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const prisma = new PrismaClient();

const getusers = async () => {
  const users = await prisma.user.findFirst();
  return users;
};

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from CycloEval API");
});

app.get("/users", async (req, res) => {
  const users = await getusers().then((users) => res.json(users));

});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
