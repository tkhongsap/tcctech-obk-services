using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
public class CWOCommand : ICommand<CWOResult>
{
	public DateTime RequestedOn { get; set; }
	public int PriorityId { get; set; }
	public int RequesterId { get; set; }
	public int LocationId { get; set; }
	public int AssetId { get; set; }
	public int CwoTypeId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int ProblemTypeId { get; set; }
	public Guid CreatedBy { get; set; }
	public string Description { get; set; } = string.Empty;

	public CWOCommand(CWORequest cwoCommand)
	{
		RequestedOn = cwoCommand.RequestedOn;
		PriorityId = cwoCommand.PriorityId;
		RequesterId = cwoCommand.RequesterId;
		LocationId = cwoCommand.LocationId;
		AssetId = cwoCommand.AssetId;
		Description = cwoCommand.Description;
		CwoTypeId = cwoCommand.CwoTypeId;
		ServiceCategoryId = cwoCommand.ServiceCategoryId;
		ProblemTypeId = cwoCommand.ProblemTypeId;
		CreatedBy = cwoCommand.CreatedBy;
	}
}
