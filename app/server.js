var grpc = require('grpc');

var testing_proto = grpc.load('/api/main.proto');

function emptyResponse(call, callback) {
  callback(null, {});
}

function simpleResponse(call, callback) {
  callback(null, { text: 'test text' });
}

function complexResponse(call, callback) {
  callback(null, { first: { text: 'first' }, second: { text: 'second' } });
}

function simpleRequest(call, callback) {
  callback(null, {});
}

function complexRequest(call, callback) {
  callback(null, {});
}

function simpleRequestComplexResponse(call, callback) {
  callback(null, { first: call.request, second: call.request });
}

function streamingRequest(call, callback) {
  let latest = {};
  call.on('data', data => {
    latest = data;
  });
  call.on('end', () => {
    callback(null, latest);
  });
}

function bidirectionalStreaming(call) {
  call.on('data', data => {
    call.write(data);
  });
}

function enumRequest(call, callback) {
  console.log(call.request);
  callback(null, { text: JSON.stringify(call.request) });
}

var server = new grpc.Server();
server.addProtoService(testing_proto.testing.test.service, {
  emptyResponse: emptyResponse,
  simpleResponse: simpleResponse,
  complexResponse: complexResponse,
  simpleRequest: simpleRequest,
  complexRequest: complexRequest,
  simpleRequestComplexResponse: simpleRequestComplexResponse,
  streamingRequest: streamingRequest,
  bidirectionalStreaming: bidirectionalStreaming,
  enumRequest: enumRequest
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
