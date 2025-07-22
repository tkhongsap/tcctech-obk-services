using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMTransection;

public class PPMTransectionResult
{
  public int id { get; set; }
  public int commentTypeId { get; set; }
  public int woId { get; set; }
  public string message { get; set; }
  public DateTime? createdOn { get; set; }
  public string createdBy { get; set; }
  public string createdDate { get; set; }
}
