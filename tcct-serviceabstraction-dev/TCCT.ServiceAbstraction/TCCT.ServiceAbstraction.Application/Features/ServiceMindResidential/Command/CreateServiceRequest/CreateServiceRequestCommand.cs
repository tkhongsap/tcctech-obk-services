using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateServiceRequest;
public class CreateServiceRequestCommand : ICommand<CreateServiceRequestResult>
{
	public string TenantId { get; set; }
	public string? Description { get; set; }
	public int ServiceRequestTypeId { get; set; }
	public int PropertyUnitId { get; set; }
	public ImageData? Image { get; set; } 

	public class ImageData
	{
		public string? FileName { get; set; }
		public string? ResourceUrl { get; set; }
	}
}