using System;
using System.IdentityModel.Tokens.Jwt;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Query.GetUserClient;

namespace TCCTOBK.OperationBackend.Api.Middleware;

public class ClientSiteMiddleware
{
  private readonly RequestDelegate _next;
  private readonly bool _checkAuth;
  public ClientSiteMiddleware(RequestDelegate next, bool checkAuth)
  {
    _next = next;
    _checkAuth = checkAuth;
  }
  public async Task Invoke(HttpContext context, IMediator mediator)
  {
    var header = context.Request.Headers;
    if (header.ContainsKey("x-client-site-id"))
    {
      var headerClient = Guid.Empty;
      if (!Guid.TryParse(header["x-client-site-id"], out headerClient))
      {
        throw new BadRequestException("x-client-site-id is not valid");
      }

      if (_checkAuth)
      {
        var bearer = header["Authorization"].ToString();
        var token = bearer.Split(" ")[1];
        var handler = new JwtSecurityTokenHandler();
        var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
        var keyCloakUserId = jsonToken.Claims.First(claim => claim.Type == "preferred_username").Value;
        var memberClient = await mediator.Send(new GetUserClientQuery(keyCloakUserId));
        if (memberClient.Any(x => x.CSID == headerClient))
        {
          context.Items["x-client-site-id"] = header["x-client-site-id"];
          context.Items["keyCloakId"] = keyCloakUserId;
          await _next(context);
        }
      }
      else
      {
        context.Items["x-client-site-id"] = header["x-client-site-id"];
        await _next(context);
      }
    } else {
      await _next(context);
    }
  }
}
public class ClientSiteOptions
{
  public bool CheckAuth { get; set; }
}

public class ClientSiteMiddlewarePipeline
{
  public void Configure(IApplicationBuilder app)
  {
    app.UseMiddleware<ClientSiteMiddleware>(false);
  }
}

public class ClientSiteAuthMiddlewarePipeline
{
  public void Configure(IApplicationBuilder app)
  {
    app.UseMiddleware<ClientSiteMiddleware>(true);
  }
}