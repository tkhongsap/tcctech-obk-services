namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class AlphaXServiceException : ServiceAbstractionException
{
	public static AlphaXServiceException AXS001 { get; } = new AlphaXServiceException(nameof(AXS001), "Cannot get data feed from AlphaX");
	public static AlphaXServiceException AXS002 { get; } = new AlphaXServiceException(nameof(AXS002), "Invalid building");
	public static AlphaXServiceException AXS003 { get; } = new AlphaXServiceException(nameof(AXS003), "Missing building config");

	private AlphaXServiceException(string code, string message) : base(code, message)
	{
	}
	private AlphaXServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}

}
