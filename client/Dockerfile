# Stage 1: Build
FROM node:16 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend application
RUN npm run build

# Stage 2: Serve
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install serve to serve the built application
RUN npm install -g serve

# Copy the build artifacts from the build stage
COPY --from=build /usr/src/app/build /usr/src/app/build

# Expose port 80
EXPOSE 80

# Start the application
CMD ["serve", "-s", "build", "-l", "80"]
