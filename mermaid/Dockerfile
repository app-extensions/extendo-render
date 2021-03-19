FROM node:12-buster-slim
COPY mermaid.js package*.json ./
RUN npm ci
CMD [ "mermaid" ]