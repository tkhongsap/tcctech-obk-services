using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskSubtaskRepository;
public class CreateTaskSubtaskModel
{
	public Guid TID { get; set; } = Guid.Empty;
	public Guid STID { get; set; } = Guid.Empty;

	public CreateTaskSubtaskModel(Guid tid, Guid stid)
	{
		TID = tid;
		STID = stid;
	}
}
