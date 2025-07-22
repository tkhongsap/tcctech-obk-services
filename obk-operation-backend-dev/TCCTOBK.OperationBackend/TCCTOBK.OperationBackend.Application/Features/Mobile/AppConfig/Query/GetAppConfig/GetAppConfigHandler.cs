using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.AppConfig.Query.GetAppConfig;

public class GetAppConfigHandler : IRequestHandler<GetAppConfigQuery, GetAppConfigResult>
{
  IUnitOfWork _uow;

  public GetAppConfigHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<GetAppConfigResult> Handle(GetAppConfigQuery request, CancellationToken cancellationToken)
  {
    var data = await _uow.AppConfigRepository.GetValueByName(request.KeyConfig);
    if (data == null) data = "N/A";
    return new GetAppConfigResult() { Data = data };
  }
}
