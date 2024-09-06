// routes/userRoutes.js

import express from "express";

import { authenticate } from "../middleware/authenticate.js";

//Importando funções - Criando, obtendo e atualizando o usuario

import { createUser } from "../controllers/userCreate.js";
import { getAllUsers } from "../controllers/getAllUsers.js";

import { updateProfile } from "../controllers/updatesOfUser/updateProfile.js";

//Importando funções - Criando ciclos e tarefas
import { createCycles } from "../controllers/createInforsForUser/createCycles.js";
import { createTasks } from "../controllers/createInforsForUser/createTask.js";

//Importando funções - Atualizando Ciclos, tarefas e estatisticas

import { updateCycle } from "../controllers/updatesOfUser/updateCycles.js";
import { updateTask } from "../controllers/updatesOfUser/updatesTasks.js";
import { updateUserStatistics } from "../controllers/updatesOfUser/updateStates.js";

//Importando funções - Obtendo Ciclos, tarefas

import { getSingleCycle } from "../controllers/getInforUsers/getCycle.js";
import { getAllCycles } from "../controllers/getInforUsers/getCycles.js";

import { getSingleTaskInCycle } from "../controllers/getInforUsers/getTaskOfCycle.js";
import { getAllTasksInCycle } from "../controllers/getInforUsers/getTasksOfCycle.js";

//Importando funções - Deletando usuario, Deletando ciclos, Deletando tarefas

import { deleteUser } from "../controllers/deleteUser.js";
import { deleteCycle } from "../controllers/deleteInforsForUser/deleteCycles.js";
import { deleteTask } from "../controllers/deleteInforsForUser/deleteTask.js";

//Importando função - Logando o usuario, resetando senha

import { login } from "../controllers/userLogin.js";
import { verify2FA } from "../controllers/userLogin.js";
import { sendLinkPassword, resetPasswordReset, verifyToken } from "../controllers/userResetPassword.js"

const router = express.Router();

// User Routes

router.post("/users", createUser);

router.get("/users", authenticate, getAllUsers);

router.put("/users/:id", authenticate, updateProfile);

router.delete("/users/:id", authenticate, deleteUser);

//Cycles routes
router.post("/users/:id/cycles", authenticate, createCycles);

router.put("/users/:id/cycles/:cycleId", authenticate, updateCycle);

router.get("/users/:id/cycles", authenticate, getAllCycles);
router.get("/users/:id/cycles/:cycleId", authenticate, getSingleCycle);

router.delete("/users/:id/cycles/:cycleId", authenticate, deleteCycle);

//Tasks Routes
router.post("/users/:id/cycles/:cycleId/tasks", authenticate, createTasks);

router.put(
  "/users/:id/cycles/:cycleId/tasks/:taskId",
  authenticate,
  updateTask
);

router.get(
  "/users/:id/cycles/:cycleId/tasks",
  authenticate,
  getAllTasksInCycle
);
router.get(
  "/users/:id/cycles/:cycleId/tasks/:taskId",
  authenticate,
  getSingleTaskInCycle
);

router.delete(
  "/users/:id/cycles/:cycleId/tasks/:taskId",
  authenticate,
  deleteTask
);

//States
router.put("/users/:id", authenticate, updateUserStatistics);

//Login

router.post("/users/login", login);
router.post("/users/verify2FA", verify2FA);

router.post('/users/login/reset-password', sendLinkPassword);  // Solicitar o reset
router.post('/users/login/reset-password/:id/:token', resetPasswordReset);

router.get('/users/login/reset-password/:id/:token', verifyToken)

export default router;
