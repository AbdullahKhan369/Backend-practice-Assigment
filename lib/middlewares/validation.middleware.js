const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      // return lagana zaroori h, warna next() bhi chal jata h aur "headers already sent" error aata h
      return res.status(422).send({ error: errorMessage });
    }
    next();
  };
};

module.exports = validationMiddleware;
