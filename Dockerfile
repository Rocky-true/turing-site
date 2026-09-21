FROM docker.m.daocloud.io/library/node:20-alpine
WORKDIR /app
COPY server.js index.html styles.css app.js ./
EXPOSE 3000
CMD ["node", "server.js"]
