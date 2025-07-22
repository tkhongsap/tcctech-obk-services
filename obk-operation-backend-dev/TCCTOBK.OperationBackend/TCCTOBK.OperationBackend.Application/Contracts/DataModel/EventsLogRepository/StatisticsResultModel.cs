using System.Text.Json.Serialization;


namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.EventsLogRepository;

public class StatisticsResultModel
{
	public string Date { get; set; }
	public int Count { get; set; }
	public string TypeDay { get; set; }

}