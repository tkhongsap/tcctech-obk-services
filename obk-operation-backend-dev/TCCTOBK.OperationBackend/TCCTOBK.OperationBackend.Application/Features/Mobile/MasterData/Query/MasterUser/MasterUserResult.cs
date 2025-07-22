using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.MasterUser;

public class MasterUserResult
{
  public Guid? FromUser { get; set; }
  public string? FromUserName { get; set; }
  public Guid? ToUser { get; set; }
  public string? ToUserName { get; set; }
}
