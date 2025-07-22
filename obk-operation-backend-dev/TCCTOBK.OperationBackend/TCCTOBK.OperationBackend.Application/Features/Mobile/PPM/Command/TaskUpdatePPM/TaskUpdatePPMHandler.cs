using MediatR;
using Org.BouncyCastle.Math.EC.Rfc7748;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class TaskUpdatePPMHandler : IRequestHandler<TaskUpdatePPMCommand, TaskUpdatePPMResult>
{
  private readonly IAbstractionService _apiService;
  private readonly IMediator _mediator;


  public TaskUpdatePPMHandler(IAbstractionService apiService, IMediator mediator)
  {
    _apiService = apiService;
    _mediator = mediator;
  }

  public async Task<TaskUpdatePPMResult> Handle(TaskUpdatePPMCommand request, CancellationToken cancellationToken)
  {
    var data = new UpdatePPMRequest(
      request.Id,
      request.TaskStatus,
      request.Remarks,
      request.Reading,
      request.UpdatedBy,
      DateTime.Now
    );
    var send = await _apiService.CertisTransaction.UpdatePPM(data);
    // TODO : Block Mozart task status data
    // var detailquery = new PPMDetailQuery(request.ppmId);
    // var workdetail = await _mediator.Send(detailquery);
    // var tk = workdetail.TaskPPM.Any(x => x.ServicingObjectId == request.serviceObjectId && x.ServicingObjectId != null);
    // if (tk)
    // {
    //   var confirmcompletedata = new ConfirmCompletionRequestPPMModel()
    //   {
    //     servicingObjectId = request.serviceObjectId,
    //     confirmedBy = request.UpdatedBy
    //   };
    //   var confirmsend = await _apiService.CertisTransaction.ConfirmCompletionPPM(confirmcompletedata);
    // }

    return new TaskUpdatePPMResult();
  }
}
