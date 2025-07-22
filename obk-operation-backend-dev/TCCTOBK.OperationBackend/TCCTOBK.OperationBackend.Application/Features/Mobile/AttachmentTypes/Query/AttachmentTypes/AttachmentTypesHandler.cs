using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class AttachmentTypesHandler : IQueryHandler<AttachmentTypesQuery, AttachmentTypesResult>
{

  private readonly IAbstractionService _apiService;

  public AttachmentTypesHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<AttachmentTypesResult> Handle(AttachmentTypesQuery request, CancellationToken cancellationToken)
  {
    var res = new AttachmentTypesResult{};
		return res;

  }

}

