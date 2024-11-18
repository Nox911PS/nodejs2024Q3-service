# Base image
FROM node:20.18.0-alpine3.19


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Build the NestJS application
RUN npm run build

# Define the command to run the application
CMD ["npm", "run", "start:prod"]