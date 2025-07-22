using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class CWOListQuery : TableState, IQuery<CWOListResult>
{
  public string UserId { get; set; }
  public bool IsSoc { get; set; }
  public int? Role { get; set; }
  public CWOListQuery(string userid, int? role)
  {
    UserId = userid;
    IsSoc = role == Constant.CERTIS_SOC_ROLE_ID;
    Role = role;
  }
}
