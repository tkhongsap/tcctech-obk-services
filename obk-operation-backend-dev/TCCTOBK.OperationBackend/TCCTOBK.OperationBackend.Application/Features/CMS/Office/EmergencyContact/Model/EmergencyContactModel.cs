using System;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Model;

public class EmergencyContactModel
{
  public string title { get; set; }
  public string titleTh { get; set; }
  public string titleZh { get; set; }
  public string descriptionTh { get; set; }
  public string descriptionEn { get; set; }
  public string descriptionZh { get; set; }
  public string phoneNumber { get; set; }
  public DateTime updatedDate { get; set; }
  public string updatedBy { get; set; }

}
