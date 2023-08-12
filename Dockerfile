# First stage: build distribution
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Copy built app code and install production dependencies
FROM node:18-alpine
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
RUN npm install --production

# Copy non-source code dirs
COPY migrations ./migrations
COPY public ./public

# Set PORT and expose for service
ARG SERVICE_PORT
ENV PORT=$SERVICE_PORT
EXPOSE $PORT

# Start service
ENTRYPOINT ["node", "."]