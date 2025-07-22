using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationsByType;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.CWOComponents;

public class CWOComponentsHandler : IRequestHandler<CWOComponentsQuery, List<CWOComponentsResult>>
{
  private readonly IAbstractionService _apiService;
  private readonly IMediator _mediator;

  public CWOComponentsHandler(IAbstractionService apiService, IMediator mediator)
  {
    _apiService = apiService;
    _mediator = mediator;
  }
  public async Task<List<CWOComponentsResult>> Handle(CWOComponentsQuery request, CancellationToken cancellationToken)
  {

    var locationquery = new LocationsByTypeQuery()
    {
      TypeId = 1
    };
    var locationtype = await _mediator.Send(locationquery);

    var res = locationtype.Select(x => new CWOComponentsResult()
    {
      Text = x.Name,
      Value = x.RefId ?? 0
    }).OrderBy(x => x.Text).ToList();
    return res;
  }
}
