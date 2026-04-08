import rateLimit, { ipKeyGenerator } from "express-rate-limit";
export const askLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,

  keyGenerator: (req) => {
    if (req.user?.id) return req.user.id;
    return ipKeyGenerator(req); 
  },
  message: {
    message: "Too many requests, try again later",
  },
});