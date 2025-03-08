FROM node

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build CSS
RUN npm run build:css

# Expose port 8085
EXPOSE 8085

# Start the application
CMD ["npm", "start"]
