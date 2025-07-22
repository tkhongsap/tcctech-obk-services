using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetOAuthTokenHandler : IQueryHandler<GetOAuthTokenQuery, GetOAuthTokenResult>
{
  public async Task<GetOAuthTokenResult> Handle(GetOAuthTokenQuery request, CancellationToken cancellationToken)
  {
    return new GetOAuthTokenResult() { Token = "" };

  }
}
