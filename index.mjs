import { init, routeRequest, routeUpgrade, shouldRoute } from "wisp-server-cpp"
import { createServer } from 'node:http';
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import { fileURLToPath } from 'node:url';
import serveStatic from 'serve-static';
import express from "express";

init();

const server = createServer();
const app = express();
app.use(express.static("static/"));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/bare-mux/", express.static(baremuxPath));

server.on('request', (req, res) => {
  if (shouldRoute(req)) {
    routeRequest(req, res);
    return;
  }
  app(req, res);
});

server.on('upgrade', (req, socket, head) => {
  if (shouldRoute(req)) {
    routeUpgrade(req, socket, head);
    return;
  }
  socket.end();
});

server.listen({
  port: process.env.PORT || 8080,
});
