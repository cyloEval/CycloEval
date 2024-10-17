import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
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
        res.status(400).json({ error: 'User already exists' });
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
