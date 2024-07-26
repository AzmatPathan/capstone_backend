# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /src

# Copy package.json and package-lock.json from the root of the build context
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code into the image
COPY . .

# Expose port and define the command to run the app
EXPOSE 5000

CMD ["node", "src/index.js"]
