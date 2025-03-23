FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy application source
COPY server ./server
COPY db ./db
COPY openapi.yaml ./openapi.yaml

# Prepopulate SQLite DB
RUN apt-get update && apt-get install -y sqlite3
RUN sqlite3 db/database.sqlite < db/seed.sql

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
