using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TCCTOBK.OperationBackend.Api.Controllers;
public class OperationApiControllerBase : ControllerBase
{
	public ClaimsIdentity Identity
	{
		get
		{
			var iden = HttpContext.User.Identity as ClaimsIdentity;
			if (iden == null) throw new Exception("Invalid identity.");
			return iden;
		}
	}
}
