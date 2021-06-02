FROM node:lts-alpine

WORKDIR /app
COPY package.json package-lock.json jwt-tool.js ./
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm ci

ARG COMMIT=local
ENV COMMIT=${COMMIT}

ENTRYPOINT ["node", "jwt-tool.js"]
CMD ["--help"]
