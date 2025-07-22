using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.CWOCommentModel;

public class CWOCommentRequestModel
{
  public int CwoId { get; set; }
  public int CommentTypeId { get; set; }
  public string Comment { get; set; }
  public DateTime CommentedOn { get; set; }
  public Guid CommentedBy { get; set; }
}
