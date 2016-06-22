FROM mhart/alpine-node:6.2

RUN apk add --update libc6-compat && \
    rm -rf /var/cache/apk/* /root/.cache

RUN adduser -D runner
COPY app/server.js app/package.json /home/runner/app/
# copy the protofile to the apibricks location /api/main.proto
COPY app/testing.proto /api/main.proto

RUN chown -R runner /home/runner/app

WORKDIR /home/runner/app
RUN npm install
USER runner

CMD ["node", "server.js"]
