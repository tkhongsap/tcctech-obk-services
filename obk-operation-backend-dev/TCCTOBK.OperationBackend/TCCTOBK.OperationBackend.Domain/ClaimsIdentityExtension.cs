using System.Security.Claims;


namespace TCCTOBK.OperationBackend.Domain;
public static class ClaimsIdentityExtension
{
	public static string GetEmail(this ClaimsIdentity iden)
	{
		var claim = iden.FindFirst(ClaimTypes.Email);
		if (claim == null) throw new Exception("");
		return claim.Value;
	}
	public static string GetName(this ClaimsIdentity iden)
	{
		var claim = iden.FindFirst(ClaimTypes.NameIdentifier);
		if (claim == null) throw new Exception("");
		return claim.Value;
	}
	public static List<string> GetRoles(this ClaimsIdentity iden)
	{
		var roles = iden.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => x.Value).ToList();
		return roles;
	}
}
