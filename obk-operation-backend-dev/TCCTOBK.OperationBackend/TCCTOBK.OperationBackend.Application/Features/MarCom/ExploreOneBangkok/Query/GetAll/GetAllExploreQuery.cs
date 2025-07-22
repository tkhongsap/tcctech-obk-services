using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetAllExplore;

public class GetAllExploreQuery : TableState, IQuery<GetAllExploreResult>
{
	public string? Filter { get; set; }
	public int? Status { get; set; }
}
