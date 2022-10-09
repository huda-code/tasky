import jwt from "jsonwebtoken";
let privateKey = "codeforindia";
function generateToken(payload) {
    try {
        const token = jwt.sign(payload, privateKey, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.error(error);
        return
    }
}
export default generateToken;