using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.TechnicianReject;
public class TechnicianRejectCommand : ICommand<TechnicianRejectResult>
{
	public int CwoId { get; set; }
	public Guid RejectedBy { get; set; }
	public Guid TechnicianId { get; set; }
	public string OperatorNote { get; set; }
	public int LocationId { get; set; }
	public string Description { get; set; } = string.Empty;
	public int RequesterId { get; set; }
	public int AssetId { get; set; }

	public TechnicianRejectCommand(TechnicianRejectRequest technicianrejectCommand)
	{
		CwoId = technicianrejectCommand.CwoId;
		RejectedBy = technicianrejectCommand.RejectedBy;
		TechnicianId = technicianrejectCommand.TechnicianId;
		OperatorNote = technicianrejectCommand.OperatorNote;
		LocationId = technicianrejectCommand.LocationId;
		Description = technicianrejectCommand.Description;
		RequesterId = technicianrejectCommand.RequesterId;
		AssetId = technicianrejectCommand.AssetId;
	}
}
