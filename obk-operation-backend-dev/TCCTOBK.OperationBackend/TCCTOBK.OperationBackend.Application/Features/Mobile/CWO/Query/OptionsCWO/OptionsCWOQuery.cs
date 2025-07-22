using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.OptionsCWO;

public class OptionsCWOQuery : IQuery<OptionsCWOResult>
{
  public int ComponetId { get; set; }
  public OptionsCWOQuery(int componentid)
  {
    ComponetId = componentid;
  }
}
