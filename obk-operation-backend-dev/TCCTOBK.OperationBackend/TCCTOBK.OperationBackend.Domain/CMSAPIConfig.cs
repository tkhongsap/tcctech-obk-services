namespace TCCTOBK.OperationBackend.Domain;
public class CMSAPIConfig
{
	public string HomeContentPath { get; set; } = default!;
	public string FirebaseRemoteConfigPath { get; set; } = default!;
	public int AcknowleageBeforeMinutes { get; set; } = 0;

	public void GetEnvironmentVariables()
	{
		HomeContentPath = Environment.GetEnvironmentVariable("CMSAPI_HOMECONTENTPAHT")!;
		FirebaseRemoteConfigPath = Environment.GetEnvironmentVariable("CMSAPI_FIREBASEREMOTECONFIGPATH")!;
		AcknowleageBeforeMinutes = Convert.ToInt32(Environment.GetEnvironmentVariable("CMSAPI_GUARDTOUR_ACKNOWLEAGEBEFOREMINUTES")!);
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("CMSAPI_HOMECONTENTPAHT", HomeContentPath);
		Environment.SetEnvironmentVariable("CMSAPI_FIREBASEREMOTECONFIGPATH", FirebaseRemoteConfigPath);
		Environment.SetEnvironmentVariable("CMSAPI_GUARDTOUR_ACKNOWLEAGEBEFOREMINUTES", AcknowleageBeforeMinutes.ToString());
	}
}
