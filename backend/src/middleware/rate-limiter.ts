import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: "Za dużo prób logowania, spróbuj ponownie za 5 minut",
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Za dużo prób rejestracji, spróbuj później",
});

export default { loginLimiter, registerLimiter };
