require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors({
  origin: "http://localhost:5173", // Vite 기본 포트
  credentials: true
}));
app.use(express.json());

// 라우트
app.use("/auth", authRoutes);

// 헬스 체크
app.get("/", (req, res) => {
  res.json({ message: "냉참 API 서버" });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
