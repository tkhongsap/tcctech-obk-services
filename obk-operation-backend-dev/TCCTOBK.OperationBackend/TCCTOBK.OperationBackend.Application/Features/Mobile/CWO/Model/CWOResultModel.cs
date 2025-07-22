using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model;

public class CWOResultModel
{
  public List<CWOTransection>? cwoTransactions { get; set; } = new();
  public List<CWOComment>? cwoComments { get; set; } = new();
}
