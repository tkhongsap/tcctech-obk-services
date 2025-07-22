using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationsByType;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseForm;

public class GetCreateCaseFormHandler : IQueryHandler<GetCreateCaseFormQuery, GetCreateCaseFormResult>
{
  private readonly IUnitOfWork _uow;
  private readonly IAbstractionService _apiService;
  private readonly IMediator _mediator;

  public GetCreateCaseFormHandler(IUnitOfWork uow, IAbstractionService apiService, IMediator mediator)
  {
    _uow = uow;
    _apiService = apiService;
    _mediator = mediator;
  }

  public async Task<GetCreateCaseFormResult> Handle(GetCreateCaseFormQuery request, CancellationToken cancellationToken)
  {
    var eventype = await _apiService.MasterData.GetCaseEventType();
    var locationquery = new LocationsByTypeQuery()
    {
      TypeId = 1
    };
    var locationtype = await _mediator.Send(locationquery);
    var res = new GetCreateCaseFormResult();
    res.EventType = eventype.Select(x => new DropdownData()
    {
      Text = x.description,
      Value = x.id
    }).OrderBy(x => x.Text).ToList();
    res.Location = locationtype.Select(x => new DropdownData()
    {
      Text = x.Name,
      Value = x.RefId ?? 0
    }).OrderBy(x => x.Text).ToList();
    return res;
  }
}
