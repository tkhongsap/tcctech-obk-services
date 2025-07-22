namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.DeactivateVisitorPass;
public class DeactivateVisitorPassResult
{
	public ApiRes apiRes { get; set; }
	public string visitorPassId { get; set; }
}

public class ApiRes
{
	public string message { get; set; }
	public int status { get; set; }
	public object data { get; set; }
}
