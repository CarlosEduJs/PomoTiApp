import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
  taskId: { type: String, required: true },
  taskName: { type: String, required: true },
  taskDate: { type: Date, required: true },
  taskPriority: { type: String, default: "Medium" },
  completed: { type: Boolean, default: false },
});

const cycleSchema = new Schema({
  cycleName: { type: String, required: true },
  cycleId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  cycleType: { type: String, default: "Pomodoro" },
  tasks: [taskSchema],
});

const userSchema = new Schema({
  userId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stats: {
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    incompleteTasks: { type: Number, default: 0 },
    averageTaskPriority: { type: String, default: "Medium" },
    upcomingTasks: [taskSchema], // Defina isso como array de tasks
    totalCycles: { type: Number, default: 0 },
    completedCycles: { type: Number, default: 0 },
    incompleteCycles: { type: Number, default: 0 },
    cyclesInProgress: { type: Number, default: 0 },
    averageTasksPerCycle: { type: Number, default: 0 },
    taskCompletionPercentage: { type: Number, default: 0 },
    cycleCompletionPercentage: { type: Number, default: 0 },
    avgTaskCompletionTime: { type: Number, default: 0 }, // Em milissegundos
    avgCycleCompletionTime: { type: Number, default: 0 }, // Em milissegundos
  },
  cycles: [cycleSchema],
  twoFactorSecret: { type: String, unique: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
