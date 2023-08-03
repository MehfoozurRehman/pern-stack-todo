import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.post("/todo", async (req, res) => {
  const { title, description } = req.body;
  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
      },
    });
    res.json(todo);
  } catch (err) {
    res.json(err);
  }
});

app.get("/todo", async (req, res) => {
  try {
    const todo = await prisma.todo.findMany();
    res.json(todo);
  } catch (err) {
    res.json(err);
  }
});

app.get("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.json(todo);
  } catch (err) {
    res.json(err);
  }
});

app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const todo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
      },
    });
    res.json(todo);
  } catch (err) {
    res.json(err);
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
