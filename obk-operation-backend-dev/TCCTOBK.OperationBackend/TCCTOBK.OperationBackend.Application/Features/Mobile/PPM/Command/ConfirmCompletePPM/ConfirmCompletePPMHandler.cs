using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application;

public class ConfirmCompletePPMHandler : IRequestHandler<ConfirmCompletePPMCommand, ConfirmCompletePPMResult>
{
  private readonly IAbstractionService _apiService;
  private readonly IMediator _mediator;

  public ConfirmCompletePPMHandler(IAbstractionService apiService, IMediator mediator)
  {
    _apiService = apiService;
    _mediator = mediator;
  }

  public async Task<ConfirmCompletePPMResult> Handle(ConfirmCompletePPMCommand request, CancellationToken cancellationToken)
  { 
    var confirmcompletedata = new ConfirmCompletionRequestPPMModel()
    {
      servicingObjectId = request.ServicingObjectId,
      confirmedBy = request.CompletedBy
    };
    
    await _apiService.CertisTransaction.ConfirmCompletionPPM(confirmcompletedata);

    return new ConfirmCompletePPMResult();
  }
}
