using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationsByType;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseForm;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseLocationOptions;

public class GetCreateCaseLocationOptionsHandler : IRequestHandler<GetCreateCaseLocationOptionsQuery, GetCreateCaseLocationOptionsResult>
{
  private readonly IMediator _mediator;
  private readonly IUnitOfWork _uow;
  public GetCreateCaseLocationOptionsHandler(IMediator mediator, IUnitOfWork uow)
  {
    _mediator = mediator;
    _uow = uow;
  }
  public async Task<GetCreateCaseLocationOptionsResult> Handle(GetCreateCaseLocationOptionsQuery request, CancellationToken cancellationToken)
  {
    var res = new GetCreateCaseLocationOptionsResult();
    var mainlocation = await _mediator.Send(new LocationsByTypeQuery()
    {
      TypeId = 1
    });
    var parent = mainlocation.FirstOrDefault(x => x.RefId == request.Id).ParentId;
    if (parent != null)
    {
      var locationtype = await _mediator.Send(new LocationsByTypeQuery()
      {
        TypeId = request.TypeId,
        ParentId = parent,
      });

      res.Location = locationtype.Select(x => new DropdownData()
      {
        Text = x.Name,
        Value = x.RefId ?? 0
      }).OrderBy(x => x.Text).ToList();
    }
    return res;
  }
}
