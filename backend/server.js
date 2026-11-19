
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3001;

// Configuración CORS
const corsOptions = {
  origin: [
    "https://laughing-sniffle-q7g5rrp4grrvf5v7-5173.app.github.dev"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Endpoint de universidades
app.get("/api/universities", async (req, res) => {
  try {
    const { search = "" } = req.query;

    const response = await axios.get(
      "http://universities.hipolabs.com/search",
      {
        params: {
          country: "Peru"
        },
        timeout: 10000
      }
    );

    const universities = response.data;

    const filtered = universities.filter((uni) =>
      uni.name.toLowerCase().includes(search.toLowerCase())
    );

    res.json({
      success: true,
      total: filtered.length,
      data: filtered
    });

  } catch (error) {
    console.error("Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Error al consultar universidades"
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Backend funcionando correctamente"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
