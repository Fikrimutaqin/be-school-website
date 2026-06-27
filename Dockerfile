# Base stage
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Development stage
FROM base AS development
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build
USER node

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
