const jwt = require('jsonwebtoken');

const TokenAuthMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send({ message: "Token is missing" })
  }

  // "Bearer <token>" aur sirf "<token>" dono chalenge
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "You are not authorized to access this route" })
    }
    // decoded data req.user me rakho taake controller me req.user.email mile
    req.user = decoded
    next()
  })
}

module.exports = TokenAuthMiddleware;
