namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
public class AddStaffRoleMappingCommand
{
	public int StaffId { get; set; }
	public int LocationId { get; set; }
	public int FunctionRoleId { get; set; }
}