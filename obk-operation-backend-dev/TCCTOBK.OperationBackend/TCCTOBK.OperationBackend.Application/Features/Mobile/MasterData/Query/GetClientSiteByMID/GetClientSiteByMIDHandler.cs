using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetClientSiteByMID;

public class GetClientSiteByMIDHandler : IRequestHandler<GetClientSiteByMIDQuery, List<GetClientSiteByMIDResult>>
{
  private readonly IUnitOfWork _uow;
  public GetClientSiteByMIDHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<List<GetClientSiteByMIDResult>> Handle(GetClientSiteByMIDQuery request, CancellationToken cancellationToken)
  {
    var query = await _uow.ClientSiteRepository.GetClientSiteByMID(request.MID);
    var res = query.Select(x => new GetClientSiteByMIDResult
    {
      CSID = x.CSID,
      Name = x.Name
    }).ToList();
    return res;
  }
}
