namespace TCCTOBK.OperationBackend.Application.Exceptions;

public class BadRequestException : ApplicationException
{
	public string? ErrorCode { get; set; }
	public BadRequestException(string message) : base(message)
	{
	}
	public BadRequestException() : base("ไม่สามารถทำรายการได้")
	{
	}

	public BadRequestException(string message, string errorCode) : base(message)
	{
		this.ErrorCode = errorCode;
	}
}
