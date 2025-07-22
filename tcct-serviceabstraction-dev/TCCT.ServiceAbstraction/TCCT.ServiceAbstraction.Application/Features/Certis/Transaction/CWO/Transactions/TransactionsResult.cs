namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Transactions;
public class TransactionsResult
{
	public int Id { get; set; }
	public int CwoId { get; set; }
	public string Message { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
}
