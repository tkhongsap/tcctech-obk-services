using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionTypeRepository;
public class CreateActionTypeModel
{
	public string Action { get; set; }
	public CreateActionTypeModel(string action)
	{
		Action = action;
	}
}
