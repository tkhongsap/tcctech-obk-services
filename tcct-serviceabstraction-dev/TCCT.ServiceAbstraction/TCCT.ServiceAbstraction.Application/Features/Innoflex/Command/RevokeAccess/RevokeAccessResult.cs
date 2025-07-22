namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.RevokeAccess;
public class RevokeAccessResult
{
	public RevokeAccessResultStatus status { get; set; }
}

public class RevokeAccessResultStatus
{
	public int responseCode { get; set; }
	public string responseMessage { get; set; }
}