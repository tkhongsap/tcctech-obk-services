using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
public class CaseUpdateTaskCommand : ICommand<CaseUpdateTaskResult>
{
	public int CaseId { get; set; } = default!;
	public int Id { get; set; } = default!;
	public string Name { get; set; } = default!;
	public int StatusCode { get; set; } = default!;
	public bool IsCritical { get; set; } = default!;
	public int TaskCategoryId { get; set; } = default!;
	public int? AssignedStaffId { get; set; }
	public string? AssignedStaffDisplayName { get; set; }
	public string? CreatedBy { get; set; }
	public string? CreatedOn { get; set; }
	public int? Sequence { get; set; }
}