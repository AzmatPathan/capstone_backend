# Use Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json from the root of the build context to the working directory
COPY ../../package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code from the root of the project to the working directory
COPY ../../ ./

# Expose port and define the command to run the app
EXPOSE 5000

# Start the application
CMD ["node", "src/index.js"]
