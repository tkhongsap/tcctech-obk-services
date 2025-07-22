namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionMember;

public class GetDataTransactionMemberResult
{
	public List<ListDataItem> listData { get; set; } = new();
	public int total { get; set; }
	public int pageCount { get; set; }
	public int pages { get; set; }
}

public class ListDataItem
{
	public int transacId { get; set; }
	public string personID { get; set; } = null!;
	public DateTime transacDatetime { get; set; }
	public string projectName { get; set; } = null!;
	public string towerName { get; set; } = null!;
	public string turnstileID { get; set; } = null!;
	public int terminalStatus { get; set; }
	public string terminalStatusName { get; set; } = null!;
}

