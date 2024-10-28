import express, { Request, Response } from 'express';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { parseJSONData, processSensorData, detectShocks } from './dataProcessing';


const PORT: number = parseInt(process.env.PORT || "3000");
const HOST = process.env.HOST || "localhost";

const app = express();
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello from CycloEval API");
});

const getusers = async () => {
  const users = await prisma.user.findFirst();
  return users;
};

app.use(express.json());


app.get("/users", async (req, res) => {
  const users = await getusers()
    .then((users) => res.json(users))
    .then(() => prisma.$disconnect())
    .catch((error) => res.json({ error: error.message }));

});

app.post('/process-data', async (req: Request, res: Response) => {
  try {
    // Load JSON data
    const data = JSON.parse(fs.readFileSync(req.body.filePath, 'utf-8'));

    // Parse and process the data
    const sensorData = parseJSONData(data);
    const mergedData = processSensorData(sensorData);
    const detectedShocks = detectShocks(mergedData);

    // Save detected shocks to the database
    const savedShocks = await Promise.all(
      detectedShocks.map(async (shock) => {
        return prisma.detectedShock.create({
          data: {
            timestamp: new Date(shock.time),
            zAccel: shock.zAccel,
            coordinate: {
              create: {
                latitude: shock.latitude,
                longitude: shock.longitude,
                altitude: shock.altitude
              }
            },
            user: {
              connect: { userId: req.body.userId }
            }
          }
        });
      })
    );

    res.json({ message: 'Data processed and shocks saved successfully', savedShocks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process data' });
  }
});


app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
