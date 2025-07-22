using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMComment;

public class PPMCommentResult
{
  public int id { get; set; }
  public int commentTypeId { get; set; }
  public int woId { get; set; }
  public string comment { get; set; }
  public DateTime? createdOn { get; set; }
  public string createdBy { get; set; }
  public string createdDate { get; set; }
}
