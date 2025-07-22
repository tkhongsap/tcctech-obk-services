namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Transactions;
public class TransactionsResult
{
	public int Id { get; set; }
	public int WOId { get; set; }
	public string Message { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
}
