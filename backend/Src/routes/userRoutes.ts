
import { Router, Request, Response } from "express";
const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }
    // Dummy login example — replace with your real user lookup & password check
    if (email === "test@example.com" && password === "test1234") {
      const user = { email };
      const token = "sample-login-token";
      return res.status(200).json({ user, token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err: any) {
    console.error("❌ Backend Login Error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;

