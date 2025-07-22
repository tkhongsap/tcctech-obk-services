using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateMaintainanceRepair;
public class CreateMaintainanceRepairCommand : ICommand<CreateMaintainanceRepairResult>
{
	public string TenantId { get; set; }
	public string? Description { get; set; }
	public int EventTypeId { get; set; }
	public int LocationType { get; set; }
	public int PropertyUnitId { get; set; }
	public int? CommonAreaId { get; set; }
	public ImageData? Image { get; set; } 

	public class ImageData
	{
		public string? FileName { get; set; }
		public string? ResourceUrl { get; set; }
	}
}