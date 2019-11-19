const Joi = require('@hapi/joi');

const { errorRes } = require('@utils/res-builder');

const templates = {
  id: Joi.number().integer().min(0),
  title: Joi.string().max(50),
  json: Joi.object(),
};

const schemas = {
  id: Joi.object().keys({
    id: templates.id.required(),
  }),
  title: Joi.object().keys({
    title: templates.title.required(),
  }),
  createFile: Joi.object().keys({
    title: templates.title.required(),
    data: templates.json,
  }),
  update: Joi.object().keys({
    id: templates.id.required(),
    data: templates.json.required(),
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
