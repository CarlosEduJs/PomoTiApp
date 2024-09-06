import User from "../models/modelUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { send2FACodeByEmail } from "../speakease/skSettings.js";
import dotenv from "dotenv";

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const newTwoFactorCode = await send2FACodeByEmail(user);

    // Atualiza o usuário com o novo código
    user.twoFactorSecret = newTwoFactorCode;
    await user.save();

    return res.status(200).json({
      message: "Código enviado para o seu email, por favor verifique!",
      _id: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Erro no servidor" });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if(user.twoFactorSecret !== code) {
      return res.status(401).json({ message: "Código 2FA inválido" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT, {
      expiresIn: "48h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 48 * 60 * 60 * 1000, // 48 horas
    });

    res.status(200).json({ message: "Verificação 2FA bem-sucedida", token });
  } catch (error) {
    console.error("Erro na verificação 2FA:", error);
    res.status(500).json({ error: "Erro ao verificar código 2FA" });
  }
};


