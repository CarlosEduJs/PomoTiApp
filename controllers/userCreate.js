import User from "../models/modelUser.js";
import bcrypt from "bcryptjs";

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

export const createUser = async (req, res) => {
  try {
    const { name, email, password, cycles, stats } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    const processedCycles = cycles.map((cycle) => ({
      cycleName: cycle.cycleName,
      cycleId: generateId(),
      cycleType: cycle.type || "Pomodoro",
      completed: cycle.completed || false,
      tasks: cycle.tasks.map((task) => ({
        taskId: generateId(),
        taskName: task.taskName,
        taskDate: new Date(task.taskDate),
        taskPriority: task.taskPriority || "Medium",
        completed: task.completed || false,
      })),
    }));

    const processedStats = {
      totalTasks: stats.totalTasks || 0,
      completedTasks: stats.completedTasks || 0,
      incompleteTasks: stats.incompleteTasks || 0,
      averageTaskPriority: stats.averageTaskPriority || "Medium",
      upcomingTasks:
        stats.upcomingTasks.map((task) => ({
          taskId: generateId(),
          taskName: task.taskName,
          taskDate: new Date(task.taskDate),
          taskPriority: task.taskPriority || "Medium",
          completed: task.completed || false,
        })) || [],
      totalCycles: stats.totalCycles || 0,
      completedCycles: stats.completedCycles || 0,
      incompleteCycles: stats.incompleteCycles || 0,
      cyclesInProgress: stats.cyclesInProgress || 0,
      averageTasksPerCycle: stats.averageTasksPerCycle || 0,
      taskCompletionPercentage: stats.taskCompletionPercentage || 0,
      cycleCompletionPercentage: stats.cycleCompletionPercentage || 0,
      avgTaskCompletionTime: stats.avgTaskCompletionTime || 0,
      avgCycleCompletionTime: stats.avgCycleCompletionTime || 0,
    };

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      cycles: processedCycles,
      stats: processedStats,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
