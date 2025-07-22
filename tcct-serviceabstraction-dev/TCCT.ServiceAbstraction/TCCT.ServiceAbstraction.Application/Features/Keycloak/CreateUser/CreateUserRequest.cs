namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.CreateUser
{
	public class CreateUserRequest
	{
		public string EmailOrPhone { get; set; } = null!;
		public string Password { get; set; } = null!;
		public string Firstname { get; set; } = null!;
		public string Lastname { get; set; } = null!;

		public CreateUserRequest(string emailOrPhone, string password, string firstname, string lastname)
		{
			EmailOrPhone = emailOrPhone;
			Password = password;
			Firstname = firstname;
			Lastname = lastname;
		}
	}
}
