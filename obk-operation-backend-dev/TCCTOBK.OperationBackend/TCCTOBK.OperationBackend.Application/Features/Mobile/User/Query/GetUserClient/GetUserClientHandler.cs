using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Query.GetUserClient;

public class GetUserClientHandler : IRequestHandler<GetUserClientQuery, List<GetUserClientResult>>
{
  private readonly IUnitOfWork _uow;

  public GetUserClientHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<List<GetUserClientResult>> Handle(GetUserClientQuery request, CancellationToken cancellationToken)
  {
    var client = await _uow.MemberRepository.GetClientMembers(request.KCUserId);
    var res = client.Select(x => new GetUserClientResult
    {
      CSID = x.CSID
    }).ToList();
    return res;
  }
}
