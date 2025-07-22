namespace TCCTOBK.OperationBackend.Domain;
public class AbstractionConfig
{
	public string AbstractionURL { get; set; } = default!;
	public string AbstractionParqURL { get; set; } = default!;

	public void GetEnvironmentVariables()
	{
		AbstractionURL = Environment.GetEnvironmentVariable("ABSTRACTION_URL")!;
		AbstractionParqURL = Environment.GetEnvironmentVariable("ABSTRACTION_PARQ_URL")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("ABSTRACTION_URL", AbstractionURL);
		Environment.SetEnvironmentVariable("ABSTRACTION_PARQ_URL", AbstractionParqURL);
	}
}
