export function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.name === "ZodError" || error.errors) {
        const formattedErrors = {};
        error.errors.forEach((err) => {
          const field = err.path.join(".");
          formattedErrors[field || "general"] = err.message;
        });

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
}
