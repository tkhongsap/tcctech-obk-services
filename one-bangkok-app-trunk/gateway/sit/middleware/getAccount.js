// For more information on JS middleware see the Tyk documentation:
// https://tyk.io/docs/plugins/supported-languages/javascript-middleware/javascript-api/

log("====> JS Auth initialising");

var getAccount = new TykJS.TykMiddleware.NewMiddleware({});

getAccount.NewProcessRequest(function (request, session) {
  log("----> Running auth JSVM Auth Middleware");
  var token = request.Headers["X-Access-Token"];

  if (!token) {
    return getAccount.ReturnAuthData(request, session);
  }

  log("token: " + token);

  var requestObj = {
    Method: "GET",
    Headers: {
      "X-Access-Token": token + "",
    },
    Domain: "https://iam.glorymtel.xyz",
    Resource: "/me/account",
  };

  log("requestObj: " + JSON.stringify(requestObj));

  var encodedResponse = TykMakeHttpRequest(JSON.stringify(requestObj));
  var decodedResponse = JSON.parse(encodedResponse);
  var decodedBody = {};

  try {
    decodedBody = JSON.parse(decodedResponse.Body);
  } catch (err) {
    decodedBody = {};
  }

  log(JSON.stringify(decodedBody));

  if (decodedResponse.Code === 200) {
    log("Decoded response code = 200 start to set header");

    request.SetHeaders["X-Account-Id"] = decodedBody.data.account.id;
  }

  return getAccount.ReturnAuthData(request, session);
});

// Ensure init with a post-declaration log message
log("====> JS Auth initialised");
