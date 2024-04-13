import { init, routeRequest, routeUpgrade, shouldRoute } from "wisp-server-cpp"
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import serveStatic from 'serve-static';
import express from "express";

init();

const server = createServer();
const app = express();
app.use(express.static("static/"));
app.use("/epoxy/", express.static(epoxyPath));

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
