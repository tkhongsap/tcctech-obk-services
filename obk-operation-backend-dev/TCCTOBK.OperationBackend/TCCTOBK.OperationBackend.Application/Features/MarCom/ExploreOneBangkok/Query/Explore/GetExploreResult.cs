
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetExplore;
public class GetExploreResult
{
	public ExploreModel Data { get; set; } = new ExploreModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}
