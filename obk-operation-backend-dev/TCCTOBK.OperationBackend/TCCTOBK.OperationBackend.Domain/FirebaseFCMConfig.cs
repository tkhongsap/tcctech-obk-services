using System;

namespace TCCTOBK.OperationBackend.Domain;

public class FirebaseFCMConfig
{

  public string Type { get; set; } = null!;
  public string ProjectId { get; set; } = null!;
  public string PrivateKeyId { get; set; } = null!;
  public string PrivateKey { get; set; } = null!;
  public string ClientEmail { get; set; } = null!;
  public string ClientId { get; set; } = null!;
  public string AuthUri { get; set; } = null!;
  public string TokenUri { get; set; } = null!;
  public string AuthProviderX509CertUrl { get; set; } = null!;
  public string ClientX509CertUrl { get; set; } = null!;
  public string UniverseDomain { get; set; } = null!;

  public void GetEnvironmentVariables()
  {
    Type = Environment.GetEnvironmentVariable("FCMSETTING_TYPE")!;
    ProjectId = Environment.GetEnvironmentVariable("FCMSETTING_PROJECTID")!;
    PrivateKeyId = Environment.GetEnvironmentVariable("FCMSETTING_PRIVATEKEYID")!;
    PrivateKey = Environment.GetEnvironmentVariable("FCMSETTING_PRIVATEKEY")!;
    ClientEmail = Environment.GetEnvironmentVariable("FCMSETTING_CLIENTEMAIL")!;
    ClientId = Environment.GetEnvironmentVariable("FCMSETTING_CLIENTID")!;
    AuthUri = Environment.GetEnvironmentVariable("FCMSETTING_AUTHURI")!;
    TokenUri = Environment.GetEnvironmentVariable("FCMSETTING_TOKENURI")!;
    AuthProviderX509CertUrl = Environment.GetEnvironmentVariable("FCMSETTING_AUTHX509")!;
    ClientX509CertUrl = Environment.GetEnvironmentVariable("FCMSETTING_CLIENTX509")!;
    UniverseDomain = Environment.GetEnvironmentVariable("FCMSETTING_UDOMAIL")!;
  }

  public void SetEnvironmentVariables()
  {
    Environment.SetEnvironmentVariable("FCMSETTING_TYPE", Type);
    Environment.SetEnvironmentVariable("FCMSETTING_PROJECTID", ProjectId);
    Environment.SetEnvironmentVariable("FCMSETTING_PRIVATEKEYID", PrivateKeyId);
    Environment.SetEnvironmentVariable("FCMSETTING_PRIVATEKEY", PrivateKey);
    Environment.SetEnvironmentVariable("FCMSETTING_CLIENTEMAIL", ClientEmail);
    Environment.SetEnvironmentVariable("FCMSETTING_CLIENTID", ClientId);
    Environment.SetEnvironmentVariable("FCMSETTING_AUTHURI", AuthUri);
    Environment.SetEnvironmentVariable("FCMSETTING_TOKENURI", TokenUri);
    Environment.SetEnvironmentVariable("FCMSETTING_AUTHX509", AuthProviderX509CertUrl);
    Environment.SetEnvironmentVariable("FCMSETTING_CLIENTX509", ClientX509CertUrl);
    Environment.SetEnvironmentVariable("FCMSETTING_UDOMAIL", UniverseDomain);

  }
}
