import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/api", userRoutes);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error.message);
  process.exit(1);
});

app.listen(port, () => {
  console.log("Rodando a api!");
});
