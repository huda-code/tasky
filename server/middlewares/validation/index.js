import { body, validationResult } from "express-validator";

function registerValidation() {
  return [
    body("firstname", "First Name is Required").notEmpty().isLength({ max: 30 }),
    body("lastname", "Lastname is Required ").notEmpty().isLength({ max: 30 }),
    body("email", "Email Is Invalid").isEmail(),
    body(
      "password",
      "Password should be Min 8 Characters, Atleast 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character"
    ).isStrongPassword(),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and Confirm Password do not Match");
      } else {
        return true;
      }
    }),
    body("phone", "Mobile Phone is Invalid").isMobilePhone(),
  ];
}

function loginValidation() {
  return [
    body('email', "Email Is Required").isEmail(),
    body('password', "Passowrd is Required").notEmpty()
  ]
}
function errorMiddleware(req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  return next();
}
export { loginValidation, registerValidation, errorMiddleware };
