using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.RegisterNewTenant;
public class RegisterNewTenantCommand : ICommand<RegisterNewTenantResult>
{
	public string Provider { get; set; }
	public string? ClientSecret { get; set; }
	public string? TenantEmail { get; set; } = default!;
	public string? PhoneNumber { get; set; } = default!;
	public string? CountryCode { get; set; } = default!;


	public RegisterNewTenantCommand(string provider, string? tenantEmail, string? phoneNumber, string? countryCode)
	{
		Provider = provider;
		if (provider == "email") {
			if (tenantEmail == null) throw new Exception("tenantEmail must be provided if provider is email");
			TenantEmail = tenantEmail;
		} else if (provider == "phone") {
			if (phoneNumber == null || countryCode == null) throw new Exception("phoneNumber and countryCode must be provided if provider is phone");
			PhoneNumber = phoneNumber;
			CountryCode = countryCode;
		}
	}
}