namespace TCCTOBK.OperationBackend.Application.Configuration.Validation;
public class InvalidCommandException : ApplicationException
{
	public string Details { get; }
	public InvalidCommandException(string message, string details) : base(message)
	{
		this.Details = details;
	}
}
