FROM node:18-alpine
WORKDIR /app
RUN npm install -g firebase-tools

ARG GCP_TEST_PROJECT_ID
ENV GCP_PROJECT_ID=$GCP_TEST_PROJECT_ID
COPY firebase.json .
ENTRYPOINT firebase emulators:start --project $GCP_PROJECT_ID