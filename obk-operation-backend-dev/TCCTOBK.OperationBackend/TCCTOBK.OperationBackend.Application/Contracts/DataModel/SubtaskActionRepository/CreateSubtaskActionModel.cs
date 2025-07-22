using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
public class CreateSubtaskActionModel
{
	public Guid STID { get; set; } = Guid.Empty;
	public List<Guid> AIDS { get; set; } = new List<Guid>();
	public int StatusId { get; set; }
	public CreateSubtaskActionModel(Guid stid, List<Guid> aids, int statusId)
	{
		STID = stid;
		AIDS = aids;
		StatusId = statusId;
	}
}
