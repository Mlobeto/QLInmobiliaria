const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const routes = require("./routes/index.js")

const allowedOrigins = [
    'http://localhost:5173', // Permitir localhost para desarrollo
    
  ];

const app = express()

app.use(express.json())
const corsOptions = {
  origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error("Not allowed by CORS"));
      }
  },
};

app.use(cors(corsOptions));
app.use(morgan("dev"))
app.use("/", routes)

app.use((err, req, res, next) => {
  console.error(err.stack); // Log del error
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});
  
  
module.exports = app