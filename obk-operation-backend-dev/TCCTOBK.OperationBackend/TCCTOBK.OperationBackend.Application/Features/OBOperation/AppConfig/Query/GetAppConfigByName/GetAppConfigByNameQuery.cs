using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
public record GetAppConfigByNameQuery(string Name) : IQuery<string>;
