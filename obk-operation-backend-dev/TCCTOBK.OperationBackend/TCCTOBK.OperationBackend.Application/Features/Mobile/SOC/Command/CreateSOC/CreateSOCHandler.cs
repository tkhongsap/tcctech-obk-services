using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class CreateSOCHandler : ICommandHandler<CreateSOCCommand, CreateSOCResult>
{
  private readonly IAbstractionService _apiService;
  public CreateSOCHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<CreateSOCResult> Handle(CreateSOCCommand request, CancellationToken cancellationToken)
  {
    var req = new CreateSOCIncidentModel()
    {
      RequestedOn = DateTime.Now,
      PriorityId = 3,
      RequesterId = 17, // Mock
      LocationId = request.LocationId,
      AssetId = request.AssetId,
      CWOTypeId = 104, // Mock
      ServiceCategoryId = 34,
      ProblemTypeId = request.ProblemTypeId,
      CreatedBy = new Guid("59559089-4116-4275-a37d-e956f5ac0f03"), //Mock
      Description = request.Description
    };
    await _apiService.CertisTransaction.CreateSoc(req);
    return new CreateSOCResult();
  }
}
