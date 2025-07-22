namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ConfirmTaskCompletion;
public class ConfirmTaskCompletionResult
{
	public Result Result { get; set; } = new Result();
	public int Id { get; set; }
	public int Status { get; set; }
	public bool IsCanceled { get; set; }
	public bool IsCompleted { get; set; }
	public bool IsCompletedSuccessfully { get; set; }
	public int CreationOptions { get; set; }
	public bool IsFaulted { get; set; }
}

public class Result
{
	public int Id { get; set; }
	public int ObjectId { get; set; }
	public string ObjectType { get; set; } = null!;
	public int WOId { get; set; }
	public int ChecklistId { get; set; }
	public bool IsTaskCompletionConfirmed { get; set; }
	public DateTime TaskCompletionConfirmedDateTime { get; set; }
	public string TaskCompletionConfirmedUserId { get; set; } = null!;
}
