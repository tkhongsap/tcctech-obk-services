using System.Reflection.Metadata;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.CreateUserKC;

public class CreateUserKCCommand : AuditableModel, ICommand<CreateUserKCResult>
{
	public string EmailOrPhone { get; set; } = default!;
	public string Password { get; set; } = default!;
	public string? IdentifyNumber { get; set; } = null;
	public int IdentifyType { get; set; }  // 0 N/A , 1 Thai ID, 2 Passport
	public List<int> UserType { get; set; } = default!; // 1 sup 2 guard 3 os (tech,clean)
	public string? FirstName { get; set; } = null;
	public string? LastName { get; set; } = null;
	public string? Company { get; set; } = null;
	public int? Location { get; set; } = null;
	public int? Role { get; set; } = null;
	public Guid? ClientSite { get; set; } = Domain.Constant.OBK_CLIENT_SITE;
	public List<CreateFunctionRolesLocation>? FunctionRoleLocation { get; set; }


	public CreateUserKCCommand(string emailOrPhone, string password, List<int> userType)
	{
		Password = password;
		EmailOrPhone = emailOrPhone;
		UserType = userType;
	}
}