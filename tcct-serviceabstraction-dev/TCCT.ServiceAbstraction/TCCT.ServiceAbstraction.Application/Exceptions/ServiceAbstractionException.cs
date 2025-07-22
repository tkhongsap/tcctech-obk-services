namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class ServiceAbstractionException : ApplicationException
{
	public string Code { get; set; }
	public int? Status { get; set; } = null;
	protected ServiceAbstractionException(string code) : base()
	{
		Code = code;
	}
	protected ServiceAbstractionException(string code, string message) : base(message)
	{
		Code = code;
	}
	protected ServiceAbstractionException(string code, string message, Exception innerexception) : base(message, innerexception)
	{
		Code = code;
	}
	protected ServiceAbstractionException(string code, string message, Exception innerexception, int status) : base(message, innerexception)
	{
		Code = code;
		Status = status;
	}
}
