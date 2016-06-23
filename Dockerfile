FROM mhart/alpine-node:6.2

RUN apk add --update libc6-compat && \
    rm -rf /var/cache/apk/* /root/.cache

RUN adduser -D runner
WORKDIR /home/runner/app
COPY app/package.json /home/runner/app/
RUN npm install
# copy the protofile to the apibricks location /api/main.proto
COPY app/testing.proto /api/main.proto
COPY app/external.proto /api/external.proto
COPY app/google/protobuf/any.proto /api/google/protobuf/any.proto
COPY app/server.js /home/runner/app/

RUN chown -R runner /home/runner/app

USER runner

CMD ["node", "server.js"]
