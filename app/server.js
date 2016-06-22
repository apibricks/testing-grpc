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

function streamingResponse(call) {
  for (let i = 0; i < 50; i++) {
    call.write({text: "test text " + i});
  }
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

function enumResponse(call, callback) {
  callback(null, {value: 2});
}

function anyRequest(call, callback) {
  callback(null, { text: JSON.stringify(call.request) });
}

function anyResponse(call, callback) {
  let possibleResponses = [
    {thing: 42},
    {thing: "some text"},
    {thing: ["some", "string", "values"]},
    {thing: {someNumber: 42, someString: "some text"}}
  ];
  let responseIndex = Math.floor(Math.random() * possibleResponses.length);
  callback(null, possibleResponses[responseIndex]);
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
  streamingResponse: streamingResponse,
  bidirectionalStreaming: bidirectionalStreaming,
  enumRequest: enumRequest,
  enumResponse: enumResponse,
  anyRequest: anyRequest,
  anyResponse: anyResponse
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();