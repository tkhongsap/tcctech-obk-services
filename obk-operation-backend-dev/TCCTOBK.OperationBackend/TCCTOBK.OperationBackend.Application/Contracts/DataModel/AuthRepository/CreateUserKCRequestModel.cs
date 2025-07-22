namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
public class CreateUserKCRequestModel
{
	public string EmailOrPhone { get; set; } = default!;
	public string Password { get; set; } = default!;
	public string Firstname { get; set; } = default!;
	public string Lastname { get; set; } = default!;
	public string Company { get; set; } = default!;
	public int? StaffId { get; set; } = default!;

	public List<CreateFunctionRolesLocation>? FunctionRoleLocation { get; set; }


}