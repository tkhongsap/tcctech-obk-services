using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UploadMedia;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpdateTask;

public class UpdateTaskHandler : IRequestHandler<UpdateTaskCommand, UpdateTaskResult>
{
  private readonly IAbstractionService _apiService;
  private readonly IUnitOfWork _uow;
  private readonly IMediator _mediator;
  public UpdateTaskHandler(IAbstractionService apiService, IUnitOfWork uow, IMediator mediator)
  {
    _apiService = apiService;
    _uow = uow;
    _mediator = mediator;
  }

  async Task<UpdateTaskResult> IRequestHandler<UpdateTaskCommand, UpdateTaskResult>.Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
  {
    var req = new UpdateTaskSOCRequest()
    {
      CaseId = request.CaseId,
      Id = request.Id,
      Name = request.Name,
      StatusCode = request.StatusCode,
      IsCritical = request.IsCritical,
      TaskCategoryId = request.TaskCategoryId,
      AssignedStaffId = request.AssignedStaffId,
      AssignedStaffDisplayName = request.AssignedStaffDisplayName,
      CreatedBy = request.CreatedBy,
      CreatedOn = request.CreatedOn,
      Sequence = request.Sequence
    };
    _ = await _apiService.CertisTransaction.UpdateTaskSOC(req);


    await _uow.CaseTasksRepository.UpdateTaskStatus(request.Id, request.StatusCode);
    await _uow.SaveChangeAsyncWithCommit();
    try
    {
      if (request.ImageBase64.Count > 0 && request.ImageBase64 != null)
      {
        var data = await _mediator.Send(new UploadMediaCommand() { CaseId = request.CaseId, ImagesBase64 = request.ImageBase64 });
      }
    }
    catch (Exception ex)
    {
      return new UpdateTaskResult();
    }

    return new UpdateTaskResult();
  }
}
