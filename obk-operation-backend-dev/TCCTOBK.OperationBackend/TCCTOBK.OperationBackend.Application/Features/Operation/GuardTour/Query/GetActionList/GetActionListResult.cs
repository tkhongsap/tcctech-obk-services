using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionList;
public class GetAction
{
	public Guid Id { get; set; }
	public string Name { get; set; } = "";
	public string Description { get; set; } = "";
	public Guid ActionType { get; set; }
	public GuardTourActionMetaDataResult MetaData { get; set; } = new();
}

public record GetActionListResult(Paginate Paginate, List<GetAction> Data);