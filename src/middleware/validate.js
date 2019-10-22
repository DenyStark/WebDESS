const Joi = require('@hapi/joi');

const { errorRes } = require('@utils/res-builder');

const templates = {
  title: Joi.string().max(75),
  string: Joi.string(),
};

const schemas = {
  file: Joi.object().keys({
    title: templates.title.required(),
    data: templates.string.required(),
  }),
};

const validate = (type, isQuery = true) => (req, res, next) => {
  const schema = schemas[type];
  const data = (isQuery) ? req.query : req.body;

  const { error } = schema.validate(data);

  if (error) {
    const data = JSON.stringify(error.details).replace(/"/gi, '\'');
    return errorRes(res, 422, 73444, data);
  }

  next();
};

module.exports = validate;
