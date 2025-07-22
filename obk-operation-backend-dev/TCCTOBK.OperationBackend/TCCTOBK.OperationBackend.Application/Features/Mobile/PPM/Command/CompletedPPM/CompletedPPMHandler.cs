using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application;

public class CompletedPPMHandler : IRequestHandler<CompletedPPMCommand, CompletedPPMResult>
{
  private readonly IAbstractionService _apiService;
  private readonly IMediator _mediator;

  public CompletedPPMHandler(IAbstractionService apiService, IMediator mediator)
  {
    _apiService = apiService;
    _mediator = mediator;
  }

  public async Task<CompletedPPMResult> Handle(CompletedPPMCommand request, CancellationToken cancellationToken)
  {

    //AHOC : รอ task status มา remove sector นี้ออก
    var detailquery = new PPMDetailQuery(request.WorkOrderId);
    var workdetail = await _mediator.Send(detailquery);
    var tk = workdetail.TaskPPM.Where(x => x.ServicingObjectId != null)
    .GroupBy(x => x.ServicingObjectId)
    .Select(g => g.First())
    .ToList();
    foreach (var item in tk)
    {
      var confirmcompletedata = new ConfirmCompletionRequestPPMModel()
      {
        servicingObjectId = item.ServicingObjectId,
        confirmedBy = request.CompletedBy
      };
      try
      {
        var confirmsend = await _apiService.CertisTransaction.ConfirmCompletionPPM(confirmcompletedata);
      }
      catch (Refit.ApiException apiEx) when (apiEx.StatusCode == System.Net.HttpStatusCode.InternalServerError)
      {
        throw new BadRequestException("Please Update All task");
      }
      catch (Exception ex)
      {
        throw new Exception("Error", ex);
      }
    }
    //end ahoc

    var data = new PPMComplteTaskRequest(
      request.WorkOrderId,
      request.CompletionComment,
      request.CompletionSignature,
      request.CompletedBy
    );
    var send = await _apiService.CertisTransaction.PPMComplateTask(data);
    return new CompletedPPMResult();
  }
}
