namespace TCCTOBK.OperationBackend.Domain;
public class ReportConfig
{
	public string Email { get; set; } = null!;
	public string CCEmail { get; set; } = null!;

	public void GetEnvironmentVariables()
	{
		Email = Environment.GetEnvironmentVariable("REPORT_ATTENDENCT_EMAIL")!;
		CCEmail = Environment.GetEnvironmentVariable("REPORT_ATTENDENCT_CCEMAIL")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("REPORT_ATTENDENCT_EMAIL", Email);
		Environment.SetEnvironmentVariable("REPORT_ATTENDENCT_CCEMAIL", CCEmail);
	}


}

