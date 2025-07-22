using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Domain.Entities;
using static TCCTOBK.OperationBackend.Application.ProfileHandler;
namespace TCCTOBK.OperationBackend.Application;

public class ProfileResult
{
  public string? FullName { get; set; } = default!;
  public List<string> Location { get; set; } = new();
  public string Company { get; set; } = default!;
  public Guid MozartId { get; set; }
  public List<int> Role { get; set; } = new();
  public Guid UserId { get; set; }
  public List<UserClientData> UserClient { get; set; } = new List<UserClientData>();
  public bool IsCleaner { get; set; } = false;
  public List<FMTechniciansServiceResult>? TechnicianService { get; set; } = new List<FMTechniciansServiceResult>();
  public List<FMSupervisorsServicesResult>? SupervisorService { get; set; } = new List<FMSupervisorsServicesResult>();
  public string? Message { get; set; } = null;
  public int? StaffId { get; set; } = null;
}


public class UserClientData
{
  public Guid CSID { get; set; }
  public string ClientSiteName { get; set; } = default!;
  public List<RoleData> Role { get; set; } = new List<RoleData>();
  public int StaffId { get; set; }
}

public class RoleData
{
  public string Name { get; set; }
  public int Role { get; set; }
}