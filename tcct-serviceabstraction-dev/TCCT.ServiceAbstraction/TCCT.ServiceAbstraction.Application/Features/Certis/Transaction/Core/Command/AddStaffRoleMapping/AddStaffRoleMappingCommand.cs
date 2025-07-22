using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.AddStaffRoleMapping;
public class AddStaffRoleMappingCommand : ICommand<AddStaffRoleMappingResult>
{
	public int StaffId { get; set; }
	public int LocationId { get; set; }
	public int FunctionRoleId { get; set; }
}