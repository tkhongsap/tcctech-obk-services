using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Menu.Query.GetMenu;

public record GetMenuQuery(string KeyCloakUserId) : IQuery<GetMenuResult>;