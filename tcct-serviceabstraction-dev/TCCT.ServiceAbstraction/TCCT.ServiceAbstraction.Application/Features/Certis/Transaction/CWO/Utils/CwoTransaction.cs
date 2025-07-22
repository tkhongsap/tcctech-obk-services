namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Utils;
public class CwoTransaction
{
	public int Id { get; set; }
	public int CwoId { get; set; }
	public string Message { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
}
