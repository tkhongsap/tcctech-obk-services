using System;
using Amazon.Runtime.Internal;
using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Command.PublishEmergency;

public class PublishEmergencyCommand : AuditableModel, IRequest<PublishEmergencyResult>
{
  public string Title { get; set; }
  public string TitleTh { get; set; }
  public string TitleZh { get; set;}
  public string DescriptionTh { get; set; }
  public string DescriptionEn { get; set; }
  public string DescriptionZh { get; set; }
  public string PhoneNumber { get; set; }

}
