namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class ServiceMindResidentialServiceException : ServiceAbstractionException
{
	public static ServiceMindResidentialServiceException SMS001(string innerexception)
	{
		return new ServiceMindResidentialServiceException(nameof(SMS001), $"Unknow error", new Exception(innerexception));
	}

	public static ServiceMindResidentialServiceException SMS002(string innerexception)
	{
		return new ServiceMindResidentialServiceException(nameof(SMS002), $"Invalid client secret", new Exception(innerexception));
	}

	public static ServiceMindResidentialServiceException SMS003(string innerexception)
	{
		return new ServiceMindResidentialServiceException(nameof(SMS003), $"Invalid token", new Exception(innerexception));
	}

	public static ServiceMindResidentialServiceException SMS004(string innerexception)
	{
		return new ServiceMindResidentialServiceException(nameof(SMS004), $"Invalid user id", new Exception(innerexception));
	}

	public static ServiceMindResidentialServiceException SMS005(string innerexception)
	{
		return new ServiceMindResidentialServiceException(nameof(SMS005), $"Invalid datetime", new Exception(innerexception));
	}

	public static ServiceMindResidentialServiceException SMS006(string innerexception)
	{
		return new ServiceMindResidentialServiceException(nameof(SMS006), $"Validation falied", new Exception(innerexception));
	}

	public static ServiceMindResidentialServiceException SMS007(string innerexception)
	{
		return new ServiceMindResidentialServiceException(nameof(SMS007), $"Not Found", new Exception(innerexception));
	}

	private ServiceMindResidentialServiceException(string code, string message) : base(code, message)
	{
	}
	private ServiceMindResidentialServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
