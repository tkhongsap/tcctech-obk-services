using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.UpdateTaskCaseIncident;
public class UpdateTaskCaseIncidentCommand : ICommand<UpdateTaskCaseIncidentResult>
{
  public int CaseId { get; set; }
  public int Id { get; set; }
  public string Name { get; set; }
  public int StatusCode { get; set; }
  public bool IsCritical { get; set; }
  public int TaskCategoryId { get; set; }
  public int? AssignedStaffId { get; set; }
	public string? AssignedStaffDisplayName { get; set; }
  public string? CreatedBy { get; set; }
	public string? CreatedOn { get; set; }
	public int? Sequence { get; set; }
}
