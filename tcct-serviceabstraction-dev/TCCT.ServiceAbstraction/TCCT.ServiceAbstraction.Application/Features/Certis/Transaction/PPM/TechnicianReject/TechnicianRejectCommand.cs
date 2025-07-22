using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.TechnicianReject;
public class TechnicianRejectCommand : ICommand<TechnicianRejectResult>
{
	public int WoId { get; set; }
	public Guid RejectedBy { get; set; }
	public Guid TechnicianId { get; set; }

	public TechnicianRejectCommand(TechnicianRejectRequest request)
	{
		WoId = request.WorkOrderId;
		RejectedBy = request.RejectedBy;
		TechnicianId = request.TechnicianId;
	}
}
