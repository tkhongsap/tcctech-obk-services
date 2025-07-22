using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;

public class GetSubtask
{
	public Guid Id { get; set; }
	public string Name { get; set; } = default!;
	public int Status { get; set; }
	public string? Remarks { get; set; } 
	public int IsRequired { get; set; }
	public int IsHaveIncomplete { get; set; }
	public string? UpdatedDate { get; set; }
	public Guid? UpdatedBy { get; set; }
	public List<Action> Action { get; set; } = new();
}

public class Action
{
	public Guid ActionId { get; set; }
	public string? Name { get; set; }
    public string? Description { get; set; }
	public int Status { get; set; }
	public string? ActionType { get; set; }
	public string? Remarks { get; set; }
	public string? Reading { get; set; }
	public int IsRequired { get; set; }
	public GuardTourSubtaskActionMetaDataResult? MetaData { get; set; }
}


public record GetSubtaskResult(int TotalRecords, float ProgressSuccess, float ProgressFail, List<GetSubtask> Data);