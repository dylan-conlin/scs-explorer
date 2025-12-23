# Build stage
FROM oven/bun:1 AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Run the app
CMD ["bun", "./build/index.js"]
