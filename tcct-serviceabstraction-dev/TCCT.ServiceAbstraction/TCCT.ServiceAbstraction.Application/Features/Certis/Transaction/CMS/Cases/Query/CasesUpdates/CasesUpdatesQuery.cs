using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CasesUpdates;
public class CasesUpdatesQuery : IQuery<List<CasesUpdatesResult>>
{
    public string? from { get; set; }
		public string? to { get; set; }
		public string? skip { get; set; }
		public string? count { get; set; }
}
