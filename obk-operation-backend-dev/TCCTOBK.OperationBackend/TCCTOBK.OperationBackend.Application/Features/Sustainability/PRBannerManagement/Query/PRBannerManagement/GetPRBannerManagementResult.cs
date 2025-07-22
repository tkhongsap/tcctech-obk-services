
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
public class GetPRBannerManagementResult
{
	public PRBannerManagementModel Data { get; set; } = new PRBannerManagementModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class GetInitialPRBannerResult
{
	public InitialPRBannerModel Data { get; set; } = new InitialPRBannerModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}