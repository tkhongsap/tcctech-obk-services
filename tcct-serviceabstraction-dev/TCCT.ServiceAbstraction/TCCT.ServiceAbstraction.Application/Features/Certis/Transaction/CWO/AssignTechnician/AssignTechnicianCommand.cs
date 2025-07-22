using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignTechnician;
public class AssignTechnicianCommand : ICommand<AssignTechnicianResult>
{
	public int CwoId { get; set; }
	public Guid AssignedBy { get; set; }
	public Guid TechnicianId { get; set; }
	public string OperatorNote { get; set; } = null!;
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public int RequesterId { get; set; }
	public int AssetId { get; set; }

	public AssignTechnicianCommand(AssignTechnicianRequest request)
	{
		CwoId = request.CwoId;
		AssignedBy = request.AssignedBy;
		TechnicianId = request.TechnicianId;
		OperatorNote = request.OperatorNote;
		LocationId = request.LocationId;
		Description = request.Description;
		RequesterId = request.RequesterId;
		AssetId = request.AssetId;
	}
}
