import { validateFields } from "./validateFields.js";

/**
 * Express middleware factory: validates req.body against a section config and stores the
 * clean values on `req.validated`. `partial` is used for item updates (PUT/PATCH /:id).
 */
export function createValidator(config, { partial = false } = {}) {
  return (req, res, next) => {
    const { values, errors } = validateFields(config.fields, req.body, { partial });
    if (!Object.keys(errors).length && config.validate) Object.assign(errors, config.validate(values, { partial }) ?? {});
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: `Please check the ${config.label} details.`, errors });
    }
    req.validated = values;
    next();
  };
}
