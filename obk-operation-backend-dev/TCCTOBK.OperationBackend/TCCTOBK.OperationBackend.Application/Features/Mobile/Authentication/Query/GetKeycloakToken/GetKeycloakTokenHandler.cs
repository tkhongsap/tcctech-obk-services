using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetKeycloakTokenHandler : IQueryHandler<GetKeycloakTokenQuery, GetKeycloakTokenResult>
{
  public async Task<GetKeycloakTokenResult> Handle(GetKeycloakTokenQuery request, CancellationToken cancellationToken)
  {
    return new GetKeycloakTokenResult() { Token = "" };
  }
}
