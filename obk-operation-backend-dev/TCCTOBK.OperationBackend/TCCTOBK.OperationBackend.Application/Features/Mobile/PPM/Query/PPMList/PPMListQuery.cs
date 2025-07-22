using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application;

public class PPMListQuery : TableState, IQuery<PPMListResult>
{
  public string UserId { get; set; }
  public int? Role { get; set; }
  public int? Status { get; set; }

  public PPMListQuery(string userid, int? role, int? status)
  {
    UserId = userid;
    Role = role;
    Status = status;
  }

}
