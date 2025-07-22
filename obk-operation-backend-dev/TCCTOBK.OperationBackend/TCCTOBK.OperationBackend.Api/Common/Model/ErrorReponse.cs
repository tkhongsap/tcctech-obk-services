using System.Net;

namespace TCCTOBK.OperationBackend.Api;

public class ErrorReponse
{
	public int Code { get; set; } = (int)HttpStatusCode.BadRequest;
	public List<string> Messages { get; set; } = new();

	public ErrorReponse() { }
	public ErrorReponse(string message)
	{
		this.Messages = new() { message };
	}

	public ErrorReponse(int code, string message)
	{
		this.Code = code;
		this.Messages = new() { message };
	}

	public ErrorReponse(List<string> messages)
	{
		this.Messages = messages;
	}

	public ErrorReponse(int code, List<string> messages)
	{
		this.Code = code;
		this.Messages = messages;
	}
}
