const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /auth/google
 *
 * 클라이언트에서 받은 Google ID Token을 검증하고
 * 우리 서비스용 JWT를 발급합니다.
 *
 * Spring으로 치면:
 * @PostMapping("/auth/google")
 * public ResponseEntity<TokenResponse> googleLogin(@RequestBody GoogleLoginRequest request)
 */
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID Token이 필요합니다" });
    }

    // 1. Google ID Token 검증 (Spring의 GoogleIdTokenVerifier와 동일)
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    // 2. 토큰에서 사용자 정보 추출
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // 3. DB에서 사용자 조회 또는 생성 (현재는 DB 연결 전이라 모의 처리)
    // TODO: Prisma 연결 후 실제 DB 로직으로 교체
    const user = {
      id: googleId,        // Google 고유 ID를 우리 서비스 ID로 사용
      email,
      nickname: name,
      profileImg: picture
    };

    // 4. 우리 서비스용 JWT 발급
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. 응답
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profileImg: user.profileImg
      }
    });

  } catch (error) {
    console.error("Google 로그인 실패:", error);
    res.status(401).json({ error: "인증에 실패했습니다" });
  }
});

/**
 * GET /auth/me
 *
 * JWT 토큰으로 현재 로그인한 사용자 정보 조회
 */
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // TODO: DB에서 사용자 정보 조회
    res.json({
      userId: decoded.userId,
      email: decoded.email
    });

  } catch (error) {
    res.status(401).json({ error: "유효하지 않은 토큰입니다" });
  }
});

module.exports = router;
