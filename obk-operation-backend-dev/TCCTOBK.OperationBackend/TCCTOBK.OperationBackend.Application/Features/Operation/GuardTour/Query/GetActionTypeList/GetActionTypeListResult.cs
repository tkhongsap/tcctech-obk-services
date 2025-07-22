using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionTypeList;
public class GetActionType
{
	public Guid Id { get; set; }
	public string Action { get; set; } = "";
}

public record GetActionTypeListResult(Paginate Paginate, List<GetActionType> Data);