const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("src/middleware/validate-request");
const authorize = require("src/middleware/authorize");
const { role } = require("src/utils/constants");
const authService = require("src/services/auth.service");

router.post("/authenticate", authenticateSchema, authenticate);
router.post("/refresh-token", refreshToken);
router.post("/revoke-token", authorize(), revokeTokenSchema, revokeToken);
router.post("/register", registerSchema, register);
router.post("/verify-email", verifyEmailSchema, verifyEmail);
router.post("/forgot-password", forgotPasswordSchema, forgotPassword);
router.post(
  "/validate-reset-token",
  validateResetTokenSchema,
  validateResetToken
);
router.post("/reset-password", resetPasswordSchema, resetPassword);

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  authService
    .authenticate({ email, password, ipAddress })
    .then(({ refreshToken, ...account }) => {
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);
}

function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  authService
    .refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...account }) => {
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) return res.status(400).json({ message: "Token is required" });

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  authService
    .revokeToken({ token, ipAddress })
    .then(() => res.json({ message: "Token revoked" }))
    .catch(next);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    acceptTerms: Joi.boolean().valid(true).required(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  authService
    .register(req.body, req.get("origin"))
    .then(() =>
      res.json({
        message:
          "Registration successful, please check your email for verification instructions",
      })
    )
    .catch(next);
}

function verifyEmailSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
  authService
    .verifyEmail(req.body)
    .then(() =>
      res.json({ message: "Verification successful, you can now login" })
    )
    .catch(next);
}

function forgotPasswordSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
  authService
    .forgotPassword(req.body, req.get("origin"))
    .then(() =>
      res.json({
        message: "Please check your email for password reset instructions",
      })
    )
    .catch(next);
}

function validateResetTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function validateResetToken(req, res, next) {
  authService
    .validateResetToken(req.body)
    .then(() => res.json({ message: "Token is valid" }))
    .catch(next);
}

function resetPasswordSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
  authService
    .resetPassword(req.body)
    .then(() =>
      res.json({ message: "Password reset successful, you can now login" })
    )
    .catch(next);
}

function setTokenCookie(res, token) {
  // create cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
}

module.exports = router;
