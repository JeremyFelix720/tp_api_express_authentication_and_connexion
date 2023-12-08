import jwt from "jsonwebtoken";

export const middleware = (req: any, res: any, next: any) => {

  const fullToken = req.headers.authorization;  // fullToken = "Bearer + jwt"

  if (!fullToken) {
    res.status(401).send("Token non fourni");
  }
  else {
    const token = fullToken.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    if(decoded){
      req.token = token
      next();  // Validation du middleware
      console.log("Le JWT est correct.")
      /*
      res.status(200).json(
        {
          message: "Le JWT est correct."
        }
      );
      */
    } else {
      console.log("Le JWT est incorrect.")
      /*
      res.status(400).json(
        {
          message: "Le JWT est incorrect."
        }
      );
      */
    }
  }
}