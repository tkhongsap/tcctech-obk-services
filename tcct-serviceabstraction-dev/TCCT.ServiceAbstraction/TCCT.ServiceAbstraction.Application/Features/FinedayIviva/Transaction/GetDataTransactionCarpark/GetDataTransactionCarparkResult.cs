namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionCarpark;

public class GetDataTransactionCarparkResult
{
	public List<ListDataItem> listData { get; set; } = new();
	public int total { get; set; }
	public int pageCount { get; set; }
	public int pages { get; set; }
}

public class ListDataItem
{
	public string logEntry { get; set; } = null!;
	public string? logExit { get; set; }
	public string? carNo { get; set; }
	public string? entryDate { get; set; }
	public string? exitDate { get; set; }
	public string? vehicleTypeID { get; set; }
	public string? vehicleTypeName { get; set; }
	public string? ticketNo { get; set; }
	public string? terminalEntry { get; set; }
	public string? terminalExit { get; set; }
	public int statusLog { get; set; }
	public string? statusLogName { get; set; }
}

