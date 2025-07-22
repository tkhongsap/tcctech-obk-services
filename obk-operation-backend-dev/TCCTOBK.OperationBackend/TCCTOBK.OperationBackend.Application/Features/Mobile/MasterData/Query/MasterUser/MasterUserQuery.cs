using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.MasterUser;

public class MasterUserQuery : IQuery<MasterUserResult>
{
  public Guid FromUser { get; set; }
  public Guid ToUser { get; set; }
  public MasterUserQuery(Guid fromuser, Guid touser)
  {
    FromUser = fromuser;
    ToUser = touser;
  }
}
