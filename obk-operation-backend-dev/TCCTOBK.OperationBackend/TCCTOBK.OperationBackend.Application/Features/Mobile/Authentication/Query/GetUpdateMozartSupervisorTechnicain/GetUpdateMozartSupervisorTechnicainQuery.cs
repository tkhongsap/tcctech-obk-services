using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetUpdateMozartSupervisorTechnicain;

public class GetUpdateMozartSupervisorTechnicainQuery : IQuery<GetUpdateMozartSupervisorTechnicainResult>
{
  public string Email { get; set; }
  public Guid? MozartId { get; set; }
  public GetUpdateMozartSupervisorTechnicainQuery(string email, Guid? mozartId)
  {
    Email = email;
    MozartId = mozartId;
  }
}
