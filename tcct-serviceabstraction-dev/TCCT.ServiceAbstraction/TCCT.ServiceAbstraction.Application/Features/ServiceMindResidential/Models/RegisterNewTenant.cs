namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Models.RegisterNewTenant;

public class RegisterNewTenantEmail
{
	public string Provider { get; set; }
	public string? ClientSecret { get; set; }
	public string? TenantEmail { get; set; }
}

public class RegisterNewTenantPhone
{
	public string Provider { get; set; }
	public string? ClientSecret { get; set; }
	public string? PhoneNumber { get; set; } = default!;
	public string? CountryCode { get; set; } = default!;
}