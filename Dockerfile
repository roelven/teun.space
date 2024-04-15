# Using a specific version of node on Alpine for a smaller image
ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-alpine

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your entire project
COPY . .

# Build the Eleventy site
RUN npx @11ty/eleventy

# The container does nothing at runtime but is used to build the site
CMD ["npx", "@11ty/eleventy", "--watch"]
