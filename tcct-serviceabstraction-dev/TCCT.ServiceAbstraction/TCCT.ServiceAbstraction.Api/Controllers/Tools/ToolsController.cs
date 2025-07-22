using System.Text;
using Microsoft.AspNetCore.Mvc;
namespace TCCT.ServiceAbstraction.Api.Controllers.Tools;

[ApiController]
[Route("api/v1/[controller]")]
[ApiExplorerSettings(GroupName = "toolv1")]
public class ToolsController : ControllerBase
{
	[HttpGet("CheckHeader")]
	public IActionResult GetCheckHeader()
	{
		var res = new List<string>();
		var request = HttpContext.Request;
		foreach (var header in request.Headers)
		{
			var key = header.Key.ToString();
			var value = header.Value.ToString();
			res.Add($"[{key}] [{value}]");
		}
		return Ok(res);
	}

	[HttpGet("Health")]
	public IActionResult GetHealth()
	{
		return Ok();
	}

	[HttpGet("Version")]
	public IActionResult GetVersion()
	{
        try
        {
        	byte[] version = System.IO.File.ReadAllBytes("version.txt");
			string result = Encoding.UTF8.GetString(version);

			return Ok(result);
        }
        catch (FileNotFoundException)
        {
            return Ok("version not found");
        }
        catch (Exception)
        {
            return Ok("version not found");
        }
	}

	//[HttpGet("Environment")]
	//public IActionResult GetEnvironment()
	//{
	//	var res = Environment.GetEnvironmentVariables().Cast<DictionaryEntry>().Select(x => x.Key + ":" + x.Value).ToList();
	//	return Ok(res);
	//}

}
