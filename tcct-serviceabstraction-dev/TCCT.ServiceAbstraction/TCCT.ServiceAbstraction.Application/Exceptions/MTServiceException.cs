namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class MTServiceException : ServiceAbstractionException
{
	public static MTServiceException MTS001 { get; } = new MTServiceException(nameof(MTS001), "Unknow error");
	public static MTServiceException MTS002 { get; } = new MTServiceException(nameof(MTS002), "Invalid username or password.");
	public static MTServiceException MTS003 { get; } = new MTServiceException(nameof(MTS003), "Invalid data");
	public static MTServiceException MTS004 { get; } = new MTServiceException(nameof(MTS004), "Invalid user id.");
	public static MTServiceException MTS005 { get; } = new MTServiceException(nameof(MTS005), "Invalid datetime.");
	public static MTServiceException MTS006 { get; } = new MTServiceException(nameof(MTS006), "Validation falied.");
	public static MTServiceException MTS007(string message)
	{
		return new MTServiceException(nameof(MTS007), message);
	}

	public static MTServiceException MTS008(string message)
	{
		return new MTServiceException(nameof(MTS008), message);
	}

	private MTServiceException(string code, string message) : base(code, message)
	{
	}
	private MTServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
