namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
public class CreateFunctionRolesLocationMember
{
	public Guid MID { get; set; }
	public int? LocationId { get; set; }
	public int? FunctionRoleId { get; set; }
}
