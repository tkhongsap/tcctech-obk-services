using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.GetQueueCallLift;

public class GetQueueCallLiftResult
{
    public string personID { get; set; }
    public string? liftName { get; set; }
    public int? floorID { get; set; }
    public string? floorName { get; set; }
    public int? queueNo { get; set; }
}
