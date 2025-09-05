import jwt from "jsonwebtoken";

/**
 * Xác thực JWT token
 * @param {string} token - Token từ cookie / localStorage
 * @returns {object|null} - Payload đã decode hoặc null nếu token sai/hết hạn
 */
export function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
  } catch (err) {
    return null;
  }
}
