FROM node:12-buster
COPY mermaid.js package*.json ./
RUN npm ci
CMD [ "mermaid" ]