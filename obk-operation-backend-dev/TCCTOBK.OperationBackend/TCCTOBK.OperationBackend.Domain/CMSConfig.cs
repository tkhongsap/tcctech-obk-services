using System;

namespace TCCTOBK.OperationBackend.Domain;

public class CMSConfig
{
  public string EndPoint { get; set; } = null!;


  public void GetEnvironmentVariables()
  {
    EndPoint = Environment.GetEnvironmentVariable("CMS_ENDPOINT")!;
  }

  public void SetEnvironmentVariables()
  {
    Environment.SetEnvironmentVariable("CMS_ENDPOINT", EndPoint);
  }
}
