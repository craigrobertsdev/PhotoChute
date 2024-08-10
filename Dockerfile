# Stage 1: Build the React app
FROM node:alpine AS build

# Set the working directory to /client
WORKDIR /client

# Copy the client code to the container
COPY ./client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client code
COPY ./client/ ./

# Build the React app for production
RUN npm run build

# Stage 2: Set up the server and copy the client build files
FROM node:alpine

# Set the working directory to /app
WORKDIR /app

# Copy the server code to /app
COPY ./server/package*.json ./

# Install server dependencies
RUN npm install

# Copy the rest of the server code
COPY ./server/ ./

# Copy the client build from the first stage into the /app/client/dist directory
COPY --from=build /client/build ./client/dist

# Copy the .env file into the container (assuming it's in the server directory)
COPY ./server/.env .env

# Create a shell script to source the .env file and start the server
RUN echo '#!/bin/sh' > /app/start.sh \
    && echo 'set -a' >> /app/start.sh \
    && echo '. /app/.env' >> /app/start.sh \
    && echo 'set +a' >> /app/start.sh \
    && echo 'node server.js' >> /app/start.sh \
    && chmod +x /app/start.sh

# Expose the port the server is running on
EXPOSE 3000:3000

# Set environment variable
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the shell script, which sources the .env file and starts the server
CMD ["sh", "/app/start.sh"]