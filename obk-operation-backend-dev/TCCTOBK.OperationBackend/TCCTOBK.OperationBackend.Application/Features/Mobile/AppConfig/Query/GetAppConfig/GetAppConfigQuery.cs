using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.AppConfig.Query.GetAppConfig;

public class GetAppConfigQuery : IRequest<GetAppConfigResult>
{
  public string KeyConfig { get; set; } = default!;
}
