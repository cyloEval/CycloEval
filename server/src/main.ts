import express from "express";
import { PrismaClient } from "@prisma/client";


const PORT: number = parseInt(process.env.PORT || "3000");



const HOST = process.env.HOST || "localhost";

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
  const users = await getusers()
  .then((users) => res.json(users))
  .then(() => prisma.$disconnect())
  .catch((error) => res.json({ error: error.message }));

});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
