using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Query.UserClientStie;

public class UserClientStieResult
{
  public List<UserClientData> UserClientData { get; set; } = new List<UserClientData>();
}

public class UserClientData
{
  public Guid CSID { get; set; }
  public string ClientSiteName { get; set; } = default!;
}
