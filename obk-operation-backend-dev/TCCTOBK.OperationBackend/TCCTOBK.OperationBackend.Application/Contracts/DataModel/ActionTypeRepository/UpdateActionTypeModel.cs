using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionTypeRepository;
public class UpdateActionTypeModel
{
	public Guid ATID { get; set; }
	public string Action { get; set; }
	public UpdateActionTypeModel(Guid atid, string action)
	{
		ATID = atid;
		Action = action;
	}
}
