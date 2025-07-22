
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.SpecialEvent.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;
public class GetEventResult
{
	public SpecialEventModel Data { get; set; } = new SpecialEventModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}
