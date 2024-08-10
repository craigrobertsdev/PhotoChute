const express = require("express");
const path = require("path");
require("dotenv").config();
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas/index");
const { authMiddleware } = require("./utils/auth");
const { upload, handleUpload } = require("./utils/upload");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// configure our GraphQL server with our authentication middleware as the context
const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  // to assist in protecting against memory overload attacks
  persistedQueries: false,
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const fileData = await handleUpload(file.buffer, req.body.containerName, file.size, file.originalname);
  res.status(200).send(JSON.stringify(fileData));
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));

  // wildcard used in production to handle requests to different endpoints created by react-router
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
  });
}

// Create a new instance of Apollo server with the GraphQL schema and express middleware
const startApolloServer = async (typeDefs, resolvers) => {
  await gqlServer.start();
  gqlServer.applyMiddleware({ app });
};

db.once("open", () => {
  // app.listen(PORT, "0.0.0.0", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on http://localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${gqlServer.graphqlPath}`);
  });
});

startApolloServer(typeDefs, resolvers);
