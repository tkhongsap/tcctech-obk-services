using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetClientSiteByMID;

public class GetClientSiteByMIDQuery : IRequest<List<GetClientSiteByMIDResult>>
{
  public Guid MID { get; set; }

  public GetClientSiteByMIDQuery(Guid mid)
  {
    MID = mid;
  }
}
