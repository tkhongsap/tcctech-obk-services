using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Query.GetUserClient;

public class GetUserClientQuery : IRequest<List<GetUserClientResult>>
{
  public string KCUserId { get; set; }
  public GetUserClientQuery(string kcuserid)
  {
    KCUserId = kcuserid;
  }
}
