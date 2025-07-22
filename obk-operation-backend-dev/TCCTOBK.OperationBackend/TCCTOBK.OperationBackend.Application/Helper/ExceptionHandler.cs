using System.Net;

namespace TCCTOBK.OperationBackend.Application;

public class ExceptionHandler : ApplicationException
{
	public HttpStatusCode Code { get; set; } = HttpStatusCode.BadRequest;
	public ExceptionHandler()
	{
	}

	public ExceptionHandler(string message) : base(message)
	{
	}
	public ExceptionHandler(HttpStatusCode code, string message) : base(message)
	{
		Code = code;
	}
	public ExceptionHandler(HttpStatusCode code, string message, ApplicationException inner) : base(message, inner)
	{
		Code = code;
	}
}
