# Stage 1: Build the application
FROM node:22-alpine AS build

# Install PNPM and NestJS CLI
RUN npm install -g pnpm @nestjs/cli

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the project
RUN pnpm run build

# Stage 2: Run the application
FROM node:22-alpine AS run

# Set working directory
WORKDIR /app

# Copy the built application
COPY --from=build /app/dist .
COPY --from=build /app/node_modules ./node_modules

# Run the application
CMD ["node", "main.js"]
