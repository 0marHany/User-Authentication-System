const { StatusCodes } = require("http-status-codes");

module.exports = (schema) => {
    return (req, res, next) => {
        const ValidationResult = schema.body.validate(req.body);
        if (ValidationResult.error)
            res.status(StatusCodes.BAD_REQUEST).json({ Error: ValidationResult.error.details[0] });
        else
            next();
    }
}