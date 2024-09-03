import User from "../../models/modelUser.js";

const calculateStatistics = (user) => {
  const totalTasks = user.cycles.reduce((acc, cycle) => acc + cycle.tasks.length, 0);
  const completedTasks = user.cycles.reduce((acc, cycle) => acc + cycle.tasks.filter(task => task.completed).length, 0);
  const incompleteTasks = totalTasks - completedTasks;

  const totalCycles = user.cycles.length;
  const completedCycles = user.cycles.filter(cycle => cycle.completed).length;
  const incompleteCycles = totalCycles - completedCycles;
  const cyclesInProgress = user.cycles.filter(cycle => !cycle.completed).length;

  const averageTasksPerCycle = totalCycles ? totalTasks / totalCycles : 0;
  
  const taskCompletionPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  const cycleCompletionPercentage = totalCycles ? (completedCycles / totalCycles) * 100 : 0;

  // Exemplo de cálculo de prioridade média (assumindo que "High" = 3, "Medium" = 2, "Low" = 1)
  const priorityScores = { Low: 1, Medium: 2, High: 3 };
  const totalPriorityScore = user.cycles.reduce((acc, cycle) => {
    return acc + cycle.tasks.reduce((acc, task) => acc + priorityScores[task.taskPriority], 0);
  }, 0);
  const averageTaskPriority = totalTasks ? totalPriorityScore / totalTasks : 2; // Média normalizada

  const calculateAverageTime = (items) => {
    if (items.length === 0) return 0;
    const totalTime = items.reduce((acc, item) => acc + (new Date(item.completedDate) - new Date(item.createdDate)), 0);
    return totalTime / items.length; // Em milissegundos
  };

  const avgTaskCompletionTime = calculateAverageTime(user.cycles.flatMap(cycle => cycle.tasks.filter(task => task.completed)));
  const avgCycleCompletionTime = calculateAverageTime(user.cycles.filter(cycle => cycle.completed));

  return {
    totalTasks,
    completedTasks,
    incompleteTasks,
    averageTaskPriority,
    totalCycles,
    completedCycles,
    incompleteCycles,
    cyclesInProgress,
    averageTasksPerCycle,
    taskCompletionPercentage,
    cycleCompletionPercentage,
    avgTaskCompletionTime,
    avgCycleCompletionTime,
  };
};

export const updateUserStatistics = async (userId) => {
  try {
    // Encontre o usuário pelo ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Calcule as novas estatísticas
    const newStats = calculateStatistics(user);

    // Atualize o documento do usuário com as novas estatísticas
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        "stats.totalTasks": newStats.totalTasks,
        "stats.completedTasks": newStats.completedTasks,
        "stats.incompleteTasks": newStats.incompleteTasks,
        "stats.averageTaskPriority": newStats.averageTaskPriority,
        "stats.totalCycles": newStats.totalCycles,
        "stats.completedCycles": newStats.completedCycles,
        "stats.incompleteCycles": newStats.incompleteCycles,
        "stats.cyclesInProgress": newStats.cyclesInProgress,
        "stats.averageTasksPerCycle": newStats.averageTasksPerCycle,
        "stats.taskCompletionPercentage": newStats.taskCompletionPercentage,
        "stats.cycleCompletionPercentage": newStats.cycleCompletionPercentage,
        "stats.avgTaskCompletionTime": newStats.avgTaskCompletionTime,
        "stats.avgCycleCompletionTime": newStats.avgCycleCompletionTime,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user statistics");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user statistics:", error);
    throw error;
  }
};
