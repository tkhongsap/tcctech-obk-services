using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
public class UpdateSubtaskModel
{
	public Guid STID { get; set; }
	public string? Name { get; set; }
	public int StatusId { get; set; }
	public string? Remarks { get; set; }

	public UpdateSubtaskModel(Guid stid, string? name, int status, string? remarks)
	{
		STID = stid;
		Name = name;
		StatusId = status;
		Remarks = remarks;
	}
}
