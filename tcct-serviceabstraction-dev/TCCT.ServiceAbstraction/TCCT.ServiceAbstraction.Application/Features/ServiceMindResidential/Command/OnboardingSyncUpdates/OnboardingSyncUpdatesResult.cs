namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.OnboardingSyncUpdates;
public class OnboardingSyncUpdatesResult
{
    public OnboardingSyncUpdatesResultData? data { get; set; }
}

public class OnboardingSyncUpdatesResultData
{
    public bool? success { get; set; }
}