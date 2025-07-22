using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.CWOCommentModel;

public class CWOCommentModel
{
  public int id { get; set; }
  public int commentTypeId { get; set; }
  public int cwoId { get; set; }
  public string comment { get; set; }
  public bool isSynced { get; set; }
  public string createdBy { get; set; }
  public DateTime createdOn { get; set; }
}
