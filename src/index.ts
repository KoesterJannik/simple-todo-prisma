import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get("/", async (req, res) => {
  const allTodos = await prisma.todo.findMany();
  res.json(allTodos);
});
app.post("/todos", async (req, res) => {
  console.log(req.body);
  if (!req.body.title)
    return res.status(400).json({ message: "Title is required" });
  const newTodo = await prisma.todo.create({
    data: {
      title: req.body.title,
    },
  });
  return res.status(201).json(newTodo);
});

app.delete("/todos/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "Id is required" });
  try {
    await prisma.todo.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Todo not found" });
  }
});

app.patch("/todos/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "Id is required" });
  try {
    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        title: req.body.title,
      },
    });
    return res.status(200).json(updatedTodo);
  } catch (error) {
    return res.status(404).json({ message: "Todo not found" });
  }
});

app.get("/todos/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "Id is required" });

  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(404).json({ message: "Todo not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
