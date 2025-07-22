namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ServicingObject;
public class ServicingObjectResult
{
	public int Id { get; set; }
	public int ObjectId { get; set; }
	public string ObjectType { get; set; } = string.Empty;
	public int WOId { get; set; }
	public int ChecklistId { get; set; }
	public bool IsTaskCompletionConfirmed { get; set; }
}
