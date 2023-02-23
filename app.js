const express = require("express");
if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
} else {
  require("dotenv").config({ path: ".env.development" });
}

const path = require("path");
const router = require("./router");

const PORT = process.env.PORT || 3316;

const app = express();

app.use(express.static(path.join("public")));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server listening on port : http://localhost:${PORT}`); //eslint-disable-line
});
