import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findFirst();
    res.json(users);
    console.log(users);
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'User already exists' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
