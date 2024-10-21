import express from 'express';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello cycloEval');
});

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

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
