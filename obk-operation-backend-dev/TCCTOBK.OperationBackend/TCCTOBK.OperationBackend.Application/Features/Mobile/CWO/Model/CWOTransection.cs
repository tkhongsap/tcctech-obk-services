using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model;

public class CWOTransection
{
  public int id { get; set; }
  public int cwoId { get; set; }
  public string message { get; set; }
  public string createdBy { get; set; }
  public DateTime? createdOn { get; set; }
}

