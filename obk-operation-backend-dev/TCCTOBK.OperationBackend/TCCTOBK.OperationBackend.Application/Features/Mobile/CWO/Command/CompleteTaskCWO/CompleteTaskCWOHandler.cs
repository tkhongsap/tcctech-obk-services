using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class CompleteTaskCWOHandler : IRequestHandler<CompleteTaskCWOCommand, CompleteTaskCWOResult>
{
  private readonly IAbstractionService _apiService;

  public CompleteTaskCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public Task<CompleteTaskCWOResult> Handle(CompleteTaskCWOCommand request, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }
}
