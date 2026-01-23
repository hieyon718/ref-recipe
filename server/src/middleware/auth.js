const jwt = require("jsonwebtoken");

/**
 * JWT 인증 미들웨어
 *
 * Spring의 @PreAuthorize 또는 SecurityFilterChain과 유사한 역할
 * 보호된 라우트에서 사용자 인증을 검증합니다.
 *
 * 사용 예:
 * router.get("/recipes", authMiddleware, (req, res) => {
 *   const userId = req.user.userId; // 인증된 사용자 ID
 * });
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // req.user에 디코딩된 사용자 정보 저장
    // Spring의 SecurityContextHolder.getContext().getAuthentication()과 유사
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다" });
  }
};

module.exports = authMiddleware;
