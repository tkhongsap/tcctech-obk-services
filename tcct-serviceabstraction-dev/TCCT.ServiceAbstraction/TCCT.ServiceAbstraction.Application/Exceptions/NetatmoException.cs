namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class NetatmoException : ServiceAbstractionException
{
	public static NetatmoException NTM001(string message)
	{
		return new NetatmoException(nameof(NTM001), $"Cannot get data from Netatmo, {message}");
	}
	public static NetatmoException NTM002(string message)
	{
		return new NetatmoException(nameof(NTM002), $"Cannot post data to Netatmo, {message}");
	}
	public static NetatmoException NTM003 { get; } = new NetatmoException(nameof(NTM003), "Netatmo Invalid token");
	public static NetatmoException NTM004 { get; } = new NetatmoException(nameof(NTM004), "Invalid user email");
	public static NetatmoException NTM005(string message)
	{
		return new NetatmoException(nameof(NTM005), $"Invalid operation, {message}");
	}
	public static NetatmoException NTM006(string message)
	{
		return new NetatmoException(nameof(NTM006), $"Netatmo unknow error, {message}");
	}
	public static NetatmoException NTM007 { get; } = new NetatmoException(nameof(NTM007), "Invalid Client");
	public static NetatmoException NTM008 { get; } = new NetatmoException(nameof(NTM008), "Invalid home, Forbidden access to home");
	public static NetatmoException NTM009(string message)
	{
		return new NetatmoException(nameof(NTM009), $"Cannot delete this timeslot, {message}");
	}
	public static NetatmoException NTM010(string message)
	{
		return new NetatmoException(nameof(NTM010), $"Invalid request, {message}");
	}

	public static NetatmoException NTM011(string message)
	{
		return new NetatmoException(nameof(NTM011), $"Cannot update status, {message}");
	}

	private NetatmoException(string code, string message) : base(code, message)
	{
	}
	private NetatmoException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
