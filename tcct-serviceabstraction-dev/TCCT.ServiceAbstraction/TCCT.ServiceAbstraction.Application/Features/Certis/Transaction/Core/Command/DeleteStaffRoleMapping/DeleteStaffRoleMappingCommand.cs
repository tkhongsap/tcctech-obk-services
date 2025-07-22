using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.DeleteStaffRoleMapping;
public class DeleteStaffRoleMappingCommand : ICommand<DeleteStaffRoleMappingResult>
{
	public int StaffId { get; set; }
	public int? LocationId { get; set; }
	public int? FunctionRoleId { get; set; }
}