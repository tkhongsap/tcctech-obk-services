using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWOUpdate;
public class CWOUpdateQuery : IQuery<List<CWOUpdateResult>>
{
    public string? from { get; set; }
    public string? to { get; set; }
    public string? skip { get; set; }
    public string? count { get; set; }
}
