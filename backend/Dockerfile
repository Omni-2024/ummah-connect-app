# Step 1: Use the official Node.js image
FROM node:22

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Build the NestJS application
RUN npm run build

# Step 6: Expose the app port (use the port your app is running on, e.g., 3000)
EXPOSE 3000

# Step 7: Start the NestJS application
CMD ["npm", "run", "start:prod"]
