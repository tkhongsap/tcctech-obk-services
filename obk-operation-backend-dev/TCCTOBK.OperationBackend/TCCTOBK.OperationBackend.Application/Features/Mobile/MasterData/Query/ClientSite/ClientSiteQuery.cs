using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application;

public class ClientSiteQuery : IQuery<List<ClientSite>>
{
    public string? SiteName { get; set; }
    public List<Guid>? ClientSiteIdList { get; set; }
}
