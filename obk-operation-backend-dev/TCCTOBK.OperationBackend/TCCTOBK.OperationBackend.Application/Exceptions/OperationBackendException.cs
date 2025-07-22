namespace TCCTOBK.OperationBackend.Application.Exceptions;
public class OperationBackendException : ApplicationException
{
	public string Code { get; set; }
	protected OperationBackendException(string code) : base()
	{
		Code = code;
	}
	protected OperationBackendException(string code, string message) : base(message)
	{
		Code = code;
	}
	protected OperationBackendException(string code, string message, Exception innerexception) : base(message, innerexception)
	{
		Code = code;
	}

}
