import User from "../../models/modelUser.js";
import { updateUserStatistics } from "../updatesOfUser/updateStates.js";

function generateId(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
}

export const createTasks = async (req, res) => {
  try {
    const { id, cycleId } = req.params;
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res
        .status(400)
        .json({ error: "No tasks provided or tasks are not an array" });
    }

    const processedTasks = tasks.map((task) => ({
      taskId: generateId(10),
      taskName: task.taskName,
      taskDate: new Date(task.taskDate),
      taskPriority: task.taskPriority || "Medium",
      completed: task.completed || false,
    }));

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, "cycles.cycleId": cycleId },
      { $push: { "cycles.$.tasks": { $each: processedTasks } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or cycle not found" });
    }

    await updateUserStatistics(id);

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("Error creating tasks:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
