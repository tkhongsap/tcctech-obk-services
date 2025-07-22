namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionTurnstile;

public class GetDataTransactionTurnstileResult
{
	public List<ListDataItem> listData { get; set; } = new();
	public int total { get; set; }
	public int pageCount { get; set; }
	public int pages { get; set; }
}

public class ListDataItem
{
	public int transacId { get; set; }
	public DateTime transacDatetime { get; set; }
	public int projectID { get; set; }
	public string projectName { get; set; } = null!;
	public int towerID { get; set; }
	public string towerName { get; set; } = null!;
	public string tenantName { get; set; } = null!;
	public string id { get; set; } = null!;
	public string turnstileID { get; set; } = null!;
	public int terminalPosition { get; set; }
	public string terminalStatusName { get; set; } = null!;
	public string transactionType { get; set; } = null!;
}