using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Model;

public class OpsAppDataJsonSigleServiceModel
{
  public string? Email { get; set; } = default!;
  public string? Name { get; set; } = default!;
  public string? MozartUserId { get; set; } = default!;
  public List<EmailActivityModel>? EmailActivities { get; set; } = new();
  public FMTechniciansServiceResult? TechnicianService { get; set; } = new();
  public FMSupervisorsServicesResult? SupervisorService { get; set; } = new();
}
