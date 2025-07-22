using System.Net;

namespace TCCTOBK.OperationBackend.Application.Exceptions;

public class NotFoundException : ApplicationException
{
	public string ErrorCode { get; set; } = HttpStatusCode.NotFound.ToString();
	public NotFoundException(string message) : base(message)
	{
	}
	public NotFoundException() : base("ไม่พบข้อมูล")
	{
	}

	public NotFoundException(string message, string errorcode) : base(message)
	{
		this.ErrorCode = errorcode;
	}
}
