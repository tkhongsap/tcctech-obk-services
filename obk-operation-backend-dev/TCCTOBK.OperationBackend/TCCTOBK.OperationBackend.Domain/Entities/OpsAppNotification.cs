using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

public class OpsAppNotification
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid OANID { get; set; }
  public Guid FromUser { get; set; }
  public string FromUserName { get; set; } = default!;
  public Guid ToUser { get; set; }
  public string ToUserName { get; set; } = default!;
  public int UserType { get; set; }
  public int MessageType { get; set; }
  public string Title { get; set; } = default!;
  public string Message { get; set; } = default!;
  public string MessageEn { get; set; } = default!;
  public bool IsSendSuccess { get; set; }
  public string FCMResult { get; set; } = default!;
  public bool IsRead { get; set; }
  public bool IsActive { get; set; }
  public int WorkId { get; set; }
  public DateTime CreatedDate { get; set; }


  public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
