export const validateRequest = (schema) => {
  return (req, res, next) => {
    // For POST/PUT requests, validate body
    // For GET requests, validate params and query
    const dataToValidate = {
      ...req.body,
      ...req.params,
      ...req.query
    };

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors = result.error.flatten();
      
      // Format error messages
      const errorMessages = Object.entries(errors.fieldErrors)
        .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
        .join(" | ");

      return res.status(400).json({ message: errorMessages });
    }

    next();
  }
}