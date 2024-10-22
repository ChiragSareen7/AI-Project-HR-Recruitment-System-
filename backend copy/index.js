const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
