using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Model.PPMCommentModel;

public class PPMCommentResponseModel
{
  public int id { get; set; }
  public int commentTypeId { get; set; }
  public int woId { get; set; }
  public string comment { get; set; }
  public DateTime? createdOn { get; set; }
  public string createdBy { get; set; }
}
