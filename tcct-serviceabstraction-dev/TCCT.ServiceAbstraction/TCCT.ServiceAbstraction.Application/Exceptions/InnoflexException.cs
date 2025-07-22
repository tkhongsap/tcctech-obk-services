namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class InnoflexException : ServiceAbstractionException
{
	public static InnoflexException INF001 { get; } = new InnoflexException(nameof(INF001), "Cannot get data from Innoflex");
	public static InnoflexException INF002(string innerexception) => new InnoflexException(nameof(INF002), "Cannot post data from Innoflex", new Exception(innerexception));

	private InnoflexException(string code, string message) : base(code, message)
	{
	}
	private InnoflexException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
