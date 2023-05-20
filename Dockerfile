# First stage: build distribution
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Copy app code, build, and start app
FROM node:18-alpine
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
RUN npm install --production
COPY src/config/configs ./config
ARG SERVICE_PORT
ENV PORT=$SERVICE_PORT
EXPOSE $PORT
ENTRYPOINT ["node", "."]