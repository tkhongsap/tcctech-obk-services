using System.Text.Json.Serialization;

namespace TCCTOBK.OperationBackend.Application;

public class LoginResult
{
  public string AccessToken { get; set; } = default!;
  public string RefreshToken { get; set; } = default!;
  public string KCUsername { get; set; } = default!;
  public bool IsLocked { get; set; } = false;
  public int ExpiresIn { get; set; } = 0;
}
