import User from "../models/modelUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { send2FACodeByEmail } from "../speakease/skSettings.js";
import { verifyCode } from "../speakease/skSettings.js";
import dotenv from "dotenv";

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

    const code = await send2FACodeByEmail(user.email);
    user.twoFactorCode = code;
    await user.save();

    return res.status(200).json({
      message: "Código enviado para o seu email, por favor verifique!",
      _id: user._id 
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Erro no servidor"});
  }
};

export const verify2FA = async (req, res) => {
  const { id, code } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(204).json({ message: "Usuario não encontrado!" });
    }

    const isValid = verifyCode(code);
    if (!isValid) {
      return res.status(401).json({
        message:
          "Codigo Inválido, por favor verifique o codigo e tente novamente",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT, {
      expiresIn: "48h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 48 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login Sucedido!" });
  } catch (error) {
    console.error("Erro na verificação", error);
    return res.status(500).json({ error: "Erro no servidor!" });
  }
};
