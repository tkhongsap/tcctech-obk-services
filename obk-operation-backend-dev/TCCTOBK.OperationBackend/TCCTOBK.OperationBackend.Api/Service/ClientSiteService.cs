using System;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Api.Service;

public class ClientSiteService : IClientSiteService
{
  private readonly IHttpContextAccessor _httpContextAccessor;
  public Guid ClientSiteId => Guid.Parse(_httpContextAccessor.HttpContext?.Items["x-client-site-id"]?.ToString() ?? Constant.OBK_CLIENT_SITE.ToString());
  public ClientSiteService(IHttpContextAccessor httpContextAccessor)
  {
    _httpContextAccessor = httpContextAccessor;
  }
}
