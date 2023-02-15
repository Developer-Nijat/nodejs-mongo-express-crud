const { expressjwt: jwt } = require("express-jwt");
const models = require("src/utils/models");

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),

    // authorize based on user role
    async (req, res, next) => {
      const account = await models.Account.findById(req.user.id);
      const refreshTokens = await models.RefreshToken.find({
        account: account.id,
      });

      if (!account || (roles.length && !roles.includes(account.role))) {
        // account no longer exists or role not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      // authentication and authorization successful
      req.user.role = account.role;
      req.user.ownsToken = (token) =>
        !!refreshTokens.find((x) => x.token === token);
      next();
    },
  ];
}

module.exports = authorize;
