namespace TCCT.ServiceAbstraction.Application.Exceptions;

public class EVException : ServiceAbstractionException
{
	public static EVException EV001 { get; } = new EVException(nameof(EV001), "Cannot get data from EV");
	public static EVException EV002(string innerexception) => new EVException(nameof(EV002), "Cannot post data from EV", new Exception(innerexception));
	public static EVException EV003(string innerexception) => new EVException(nameof(EV003), "Duplicated account", new DataMisalignedException(innerexception));
	public static EVException EV004(string innerexception) => new EVException(nameof(EV004), "Unauthorized", new Exception(innerexception));
	public static EVException EV005(string innerexception) => new EVException(nameof(EV005), "Forbidden", new Exception(innerexception));

	private EVException(string code, string message) : base(code, message)
	{
	}
	private EVException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
	
	private EVException(string code, string message, Exception innerexception, int status) : base(code, message, innerexception, status)
	{
	}
}
