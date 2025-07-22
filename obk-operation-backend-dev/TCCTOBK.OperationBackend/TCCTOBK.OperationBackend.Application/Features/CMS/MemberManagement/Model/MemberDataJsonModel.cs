namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
public class MemberDataJsonModel
{
	public string Email { get; set; } = default!;
	public string Name { get; set; } = default!;
	public Guid? MozartUserId { get; set; } = default!;
	public List<EmailActivityModel> EmailActivities { get; set; } = new();
	public List<FMTechniciansServiceResult>? TechnicianService { get; set; } = new List<FMTechniciansServiceResult>();
	public List<FMSupervisorsServicesResult>? SupervisorService { get; set; } = new List<FMSupervisorsServicesResult>();
}
