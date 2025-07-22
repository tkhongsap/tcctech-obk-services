using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Query.GetEmergency;

public class GetEmergencyResult
{
  public EmergencyContactModel Data { get; set; } = new();
}
