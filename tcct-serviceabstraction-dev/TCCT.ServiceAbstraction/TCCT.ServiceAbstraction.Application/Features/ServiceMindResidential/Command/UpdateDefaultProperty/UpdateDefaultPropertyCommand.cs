using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateDefaultProperty;
public class UpdateDefaultPropertyCommand : ICommand<UpdateDefaultPropertyResult>
{
	public string TenantId { get; set; }
	public string PropertyUnitId { get; set; }

	public UpdateDefaultPropertyCommand(string tenantId, string propertyUnitId)
	{
		TenantId = tenantId;
		PropertyUnitId = propertyUnitId;
	}
}