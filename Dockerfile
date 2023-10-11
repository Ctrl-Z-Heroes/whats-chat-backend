# Use an appropriate base image, for example, Node.js
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your application listens on
EXPOSE 8081

# Define the command to run your application
CMD ["npm", "run", "start"]
