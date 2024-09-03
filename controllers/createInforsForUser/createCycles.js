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

export const createCycles = async (req, res) => {
  try {
    const { id } = req.params;
    const { cycles } = req.body;

    const processedCycles = cycles.map((cycle) => ({
      cycleName: cycle.name,
      cycleType: cycle.type || "Pomodoro",
      cycleId: generateId(10),
      completed: cycle.completed || false,
      tasks: cycle.tasks.map((task) => ({
        taskName: task.name,
        taskId: generateId(10),
        completed: task.completedTask || false,
        taskDate: new Date(task.taskDate),
        taskPriority: task.taskPriority || "Medium",
      })),
    }));

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { cycles: { $each: processedCycles } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await updateUserStatistics(id);

    res.status(200).json({ updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro no servidor", details: error.message });
  }
};
