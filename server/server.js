const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas/index");
const { authMiddleware } = require("./utils/auth");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        const premiumAccount = premiumAccounts.get(item.id)
        return {
          price_data: {
            currency: 'aud',
            product_data: {
              name: premiumAccount.class
            },
            unit_amount: premiumAccount.price
          },
          quantity: 1
        }
      }),
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/`,
    })
    res.redirect(303, session.url);
})

// configure our GraphQL server with our authentication middleware as the context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  // to assist in protecting against memory overload attacks
  persistedQueries: false,
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema and express middleware
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
};

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

startApolloServer(typeDefs, resolvers);
