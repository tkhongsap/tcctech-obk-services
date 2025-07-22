namespace TCCTOBK.OperationBackend.Domain;
public class MailConfig
{
	public string Host { get; set; } = null!;
	public int Port { get; set; }
	public string DisplayName { get; set; } = null!;
	public string Mail { get; set; } = null!;
	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;

	public void GetEnvironmentVariables()
	{
		Host = Environment.GetEnvironmentVariable("MAILSETTINGS_HOST")!;
		Port = Convert.ToInt32(Environment.GetEnvironmentVariable("MAILSETTINGS_PORT")!);
		DisplayName = Environment.GetEnvironmentVariable("MAILSETTINGS_DISPLAYNAME")!;
		Mail = Environment.GetEnvironmentVariable("MAILSETTINGS_MAIL")!;
		Username = Environment.GetEnvironmentVariable("MAILSETTINGS_USERNAME")!;
		Password = Environment.GetEnvironmentVariable("MAILSETTINGS_PASSWORD")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("MAILSETTINGS_HOST", Host);
		Environment.SetEnvironmentVariable("MAILSETTINGS_PORT", Port.ToString());
		Environment.SetEnvironmentVariable("MAILSETTINGS_DISPLAYNAME", DisplayName);
		Environment.SetEnvironmentVariable("MAILSETTINGS_MAIL", Mail);
		Environment.SetEnvironmentVariable("MAILSETTINGS_USERNAME", Username);
		Environment.SetEnvironmentVariable("MAILSETTINGS_PASSWORD", Password);
	}


}

