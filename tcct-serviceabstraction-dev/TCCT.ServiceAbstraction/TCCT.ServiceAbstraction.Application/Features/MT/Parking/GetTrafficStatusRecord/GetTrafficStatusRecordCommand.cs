using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetTrafficStatusRecord;

public class GetTrafficStatusRecordCommand : ICommand<GetTrafficStatusRecordResult>
{
    public int? pageNo { get; set; }
    public int? pageSize { get; set; }
    public string? beginTime { get; set; }
    public string? endTime { get; set; }
    public string? createBeginTime { get; set; }
    public string? createEndTime { get; set; }
    public string? monitoringId { get; set; }
    public int? jamLevel { get; set; }
}
