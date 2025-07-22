namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.OnboardResidence;
public class OnboardResidenceResult
{
	public OnboardResidenceResultStatus status { get; set; }
	public OnboardResidenceResultData data { get; set; }
}

public class OnboardResidenceResultStatus
{
	public int responseCode { get; set; }
	public string responseMessage { get; set; }
}

public class OnboardResidenceResultData
{
	public string processId { get; set; }
	public string userId { get; set; }
	public string cardNo { get; set; }
	public bool dataSave { get; set; }
}
