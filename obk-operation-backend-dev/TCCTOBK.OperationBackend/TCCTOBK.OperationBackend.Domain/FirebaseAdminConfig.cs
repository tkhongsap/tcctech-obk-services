using System.Text.Json;

namespace TCCTOBK.OperationBackend.Domain;

public class FirebaseAdminConfig
{
	public string Type { get; set; } = null!;
	public string ProjectId { get; set; } = null!;
	public string PrivateKeyId { get; set; } = null!;
	public string PrivateKey { get; set; } = null!;
	public string ClientEmail { get; set; } = null!;
	public string ClientId { get; set; } = null!;
	public string AuthUri { get; set; } = null!;
	public string TokenUri { get; set; } = null!;
	public string ClientX509CertUrl { get; set; } = null!;
	public string AuthProviderX509CertUrl { get; set; } = null!;
	public string UniverseDomain { get; set; } = null!;
	public string ProjectCode { get; set; } = null!;
	public void GetEnvironmentVariables()
	{
		Type = Environment.GetEnvironmentVariable("FIREBASEADMIN_TYPE")!;
		ProjectId = Environment.GetEnvironmentVariable("FIREBASEADMIN_PROJECTID")!;
		PrivateKeyId = Environment.GetEnvironmentVariable("FIREBASEADMIN_PRIVATEKEYID")!;
		PrivateKey = Environment.GetEnvironmentVariable("FIREBASEADMIN_PRIVATEKEY")!;
		ClientEmail = Environment.GetEnvironmentVariable("FIREBASEADMIN_CLIENTEMAIL")!;
		ClientId = Environment.GetEnvironmentVariable("FIREBASEADMIN_CLIENTID")!;
		AuthUri = Environment.GetEnvironmentVariable("FIREBASEADMIN_AUTHURI")!;
		TokenUri = Environment.GetEnvironmentVariable("FIREBASEADMIN_TOKENURI")!;
		ClientX509CertUrl = Environment.GetEnvironmentVariable("FIREBASEADMIN_CLIENTX509CERTURL")!;
		AuthProviderX509CertUrl = Environment.GetEnvironmentVariable("FIREBASEADMIN_AUTHPROVIDERX509CERTURL")!;
		UniverseDomain = Environment.GetEnvironmentVariable("FIREBASEADMIN_UNIVESEDOMAIL")!;
		ProjectCode = Environment.GetEnvironmentVariable("FIREBASEADMIN_PROJECTCODE")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("FIREBASEADMIN_TYPE", Type);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_PROJECTID", ProjectId);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_PRIVATEKEYID", PrivateKeyId);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_PRIVATEKEY", PrivateKey);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_CLIENTEMAIL", ClientEmail);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_CLIENTID", ClientId);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_AUTHURI", AuthUri);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_TOKENURI", TokenUri);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_CLIENTX509CERTURL", ClientX509CertUrl);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_AUTHPROVIDERX509CERTURL", AuthProviderX509CertUrl);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_UNIVESEDOMAIL", UniverseDomain);
		Environment.SetEnvironmentVariable("FIREBASEADMIN_PROJECTCODE", ProjectCode);
	}

	public override string ToString()
	{
		return JsonSerializer.Serialize(this);
	}

}
