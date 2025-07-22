using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class ProfileQuery : IQuery<ProfileResult>
{
  public string KCUsername { get; set; }
  public ProfileQuery(string kcusername)
  {
    KCUsername = kcusername;
  }
}
