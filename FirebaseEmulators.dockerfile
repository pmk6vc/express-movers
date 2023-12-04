# Build functions
FROM node:18-alpine AS builder
WORKDIR /app
COPY functions .
RUN npm install
RUN npm run build

# Seed emulator image with global dependencies and Firebase config
FROM node:18-alpine
WORKDIR /app
RUN npm install -g firebase-tools
COPY firebase.json .

# Copy cloud functions content from builder
RUN mkdir "functions"
WORKDIR /app/functions
COPY --from=builder ./app/lib ./lib
COPY functions/package.json .
RUN npm install --production

ARG GCP_TEST_PROJECT_ID
ENV GCP_PROJECT_ID=$GCP_TEST_PROJECT_ID
ENTRYPOINT firebase emulators:start --project $GCP_PROJECT_ID