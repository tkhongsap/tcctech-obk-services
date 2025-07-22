using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionCarpark;
public class GetDataTransactionCarparkQuery : IQuery<GetDataTransactionCarparkResult>
{
	public int Page { get; set; }
	public int PerPage { get; set; }
	public string? CarNo { get; set; }
	public string? EntryDate { get; set; }
	public string? ExitDate { get; set; }
	public string? LogEntry { get; set; }
	public int? StatusLog { get; set; }
	public string? TerminalEntry { get; set; }
	public string? TicketNo { get; set; }
	public int VehicleType { get; set; }

	public GetDataTransactionCarparkQuery(int page, int perPage, string? carNo, string? entryDate, string? exitDate,
		string? logEntry, int? statusLog, string? terminalEntry, string? ticketNo, int vehicleType)
	{
		Page = page;
		PerPage = perPage;
		CarNo = carNo;
		EntryDate = entryDate;
		ExitDate = exitDate;
		LogEntry = logEntry;
		StatusLog = statusLog;
		TerminalEntry = terminalEntry;
		TicketNo = ticketNo;
		VehicleType = vehicleType;
	}
}
