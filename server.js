const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const dotenv = require("dotenv");
dotenv.config();
server.listen(port);
console.log("Server listening on port: " + port);
