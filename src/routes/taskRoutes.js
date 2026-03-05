import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);


// CREATE TASK
router.post("/", async (req, res) => {
  try {

    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      owner: req.user._id
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET USER TASKS
router.get("/", async (req, res) => {
  try {

    const tasks = await Task.find({ owner: req.user._id });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;