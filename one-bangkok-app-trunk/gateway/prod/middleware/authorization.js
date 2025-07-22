// For more information on JS middleware see the Tyk documentation:
// https://tyk.io/docs/plugins/supported-languages/javascript-middleware/javascript-api/

log("====> JS Auth initialising");

var authorization = new TykJS.TykMiddleware.NewMiddleware({});

authorization.NewProcessRequest(function (request, session) {
  log("----> Running auth JSVM Auth Middleware");
  var token = request.Headers["X-Access-Token"];
  var refreshToken = request.Headers["X-Refresh-Token"];
  if (refreshToken) {
    token = refreshToken;
  }

  if (!token) {
    return authorization.ReturnAuthData(request, session);
  }

  log("token: " + token);

  try {
    var tokenSplit = (token + "").split(" ");
    if (!tokenSplit[1].trim()) {
      return authorization.ReturnAuthData(request, session);
    }

    if (tokenSplit[0] !== "Bearer") {
      request.ReturnOverrides.ResponseBody = "Invalid token";
      request.ReturnOverrides.ResponseCode = 403;

      return authorization.ReturnAuthData(request, {});
    }
    var decodedToken = b64dec(tokenSplit[1].split(".")[1]);
    var decodedBody = {};
    decodedBody = JSON.parse(decodedToken);
  } catch (err) {
    log("failed decoding token: ", JSON.stringify(err));
  }
  if (tokenSplit[1] !== undefined) {
    // try to use POST but it cannot sent from tyk
    var requestObject = {
      Method: "GET",
      Domain: "https://obk-iam-prod.tccproptech.com",
      Resource: "/tokens/validate/" + tokenSplit[1],
    };

    log("requestObj: " + JSON.stringify(requestObject));

    var encodedResponse = TykMakeHttpRequest(JSON.stringify(requestObject));
    var decodedResponse = JSON.parse(encodedResponse);

    log("decodeResponse: " + decodedResponse.Code);

    if (decodedResponse.Code !== 200) {
      log("token has been inactive");
      request.ReturnOverrides.ResponseBody = "token has been inactive";
      request.ReturnOverrides.ResponseCode = 401;

      return authorization.ReturnAuthData(request, {});
    }
  }
  if (Date.now() >= decodedBody.exp * 1000) {
    log("token has been expired");
    request.ReturnOverrides.ResponseBody = "token has been expired";
    request.ReturnOverrides.ResponseCode = 401;

    return authorization.ReturnAuthData(request, {});
  }
  request.SetHeaders["X-Account-Id"] = decodedBody.sub;
  try {
    var permisionList = decodedBody.permission || [];
    _.each(permisionList, function (permission, index) {
      var resource = permission.value.resource;
      _.each(resource, function (_value, key) {
        resource[key] = resource[key].replace("self", decodedBody.sub);
      });
      permisionList[index].value.resource = resource;
    });

    var permissionStr = JSON.stringify({ permission: permisionList });
    var permission = b64enc(permissionStr);
    request.SetHeaders["X-Permissions"] = permission;
  } catch (error) {
    log("failed encoding XPermissions: ", JSON.stringify(error));
    request.SetHeaders["X-Permissions"] = "";
  }

  return authorization.ReturnAuthData(request, session);
});

// Ensure init with a post-declaration log message
log("====> JS Auth initialised");
