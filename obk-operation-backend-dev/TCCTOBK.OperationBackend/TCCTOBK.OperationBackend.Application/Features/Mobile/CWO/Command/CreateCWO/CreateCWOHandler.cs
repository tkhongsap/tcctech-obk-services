using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO.AssignSupervisorModel;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO;

public class CreateCWOHandler : IRequestHandler<CreateCWOCommand, CreateCWOResult>
{
  private readonly IAbstractionService _apiService;

  public CreateCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<CreateCWOResult> Handle(CreateCWOCommand request, CancellationToken cancellationToken)
  {
    var req = new CreateSOCIncidentModel()
    {
      RequestedOn = request.requestedOn,
      PriorityId = request.priorityId,
      RequesterId = request.requesterId,
      LocationId = request.locationId,
      AssetId = request.assetId,
      CWOTypeId = request.cwoTypeId,
      ServiceCategoryId = request.serviceCategoryId,
      ProblemTypeId = request.problemTypeId,
      CreatedBy = request.createdBy,
      Description = request.description,
    };
    var data = await _apiService.CertisTransaction.CreateCWO(req);
    var assignrequest = new AssignSupervisorRequest()
    {
      CwoId = data.Id,
      SupervisorId = request.assignTo,
      AssignedBy = request.createdBy,
      LocationId = request.locationId,
      Description = request.description,
      RequesterId = request.requesterId,
      Asset = request.assetId
    };
    _ = await _apiService.CertisTransaction.AssignSupervisor(assignrequest);
    var res = new CreateCWOResult()
    {
      CWOId = data.Id,
      CWO = data.Result.Name
    };
    return res;
  }
}
