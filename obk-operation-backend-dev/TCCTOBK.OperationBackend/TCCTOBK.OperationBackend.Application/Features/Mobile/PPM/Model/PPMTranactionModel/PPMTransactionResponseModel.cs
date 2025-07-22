using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Model.PPMTranactionModel;

public class PPMTransactionResponseModel
{
  public int id { get; set; }
  public int commentTypeId { get; set; }
  public int woId { get; set; }
  public string message { get; set; }
  public DateTime? createdOn { get; set; }
  public string createdBy { get; set; }
}
