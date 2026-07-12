import "dotenv/config";
import app from "./app.js";
import { connectMongo } from "./config/mongo.js";

if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET no está definido. El servidor no puede arrancar.");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error al conectar con MongoDB. El servidor no puede arrancar.", err.message);
    process.exit(1);
  }
};

startServer();