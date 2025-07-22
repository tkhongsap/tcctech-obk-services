
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
public class GetMarcomBannerManagementResult
{
	public MarcomBannerManagementModel Data { get; set; } = new MarcomBannerManagementModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class GetInitialMarcomBannerResult
{
	public InitialMarcomBannerModel Data { get; set; } = new InitialMarcomBannerModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}