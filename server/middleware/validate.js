const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors to a clean object { field: message }
    const formattedErrors = {};
    errors.array().forEach((err) => {
      if (!formattedErrors[err.path]) {
        formattedErrors[err.path] = err.msg;
      }
    });

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = validate;
