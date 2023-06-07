const express = require("express");
const path = require("path");
require("dotenv").config();
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas/index");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up socket.io for handling POST requests from Azure
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
// const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" } });
const io = new Server(httpServer);

// configure our GraphQL server with our authentication middleware as the context
const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  // to assist in protecting against memory overload attacks
  persistedQueries: false,
});

app.post("/", (req, res) => {
  if (!req.headers.apiKey === process.env.API_SECRET) {
    return res.status(401).json({ message: "Incorrect api key" });
  }
  console.log(req.body);
  const thumbnailUrl = req.body.thumbnailUrl;
  console.log(thumbnailUrl);
  io.emit("thumbnail-created", { thumbnailUrl });

  res.json({ thumbnailUrl });
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  // wildcard used in production to handle requests to different endpoints created by react-router
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Create a new instance of Apollo server with the GraphQL schema and express middleware
const startApolloServer = async (typeDefs, resolvers) => {
  await gqlServer.start();
  gqlServer.applyMiddleware({ app });
};

db.once("open", () => {
  httpServer.listen(PORT, () => {
    console.log(httpServer.address());
    console.log(`🌍 Now listening on http://localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${gqlServer.graphqlPath}`);
  });
});

startApolloServer(typeDefs, resolvers);

module.exports = { io };
