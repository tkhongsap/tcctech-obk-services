using System.Text.Json.Serialization;


namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.RosterRepository;

public class SumWeekDayWeekEndModel
{

    public int? WeekDay { get; set; } = 0;
    public int? WeekEnd { get; set; } = 0;

}
