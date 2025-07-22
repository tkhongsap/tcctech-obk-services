namespace TCCT.ServiceAbstraction.Application.Exceptions;
public class CertisServiceException : ServiceAbstractionException
{
	public static CertisServiceException CTS001(string innerexception) => new CertisServiceException(nameof(CTS001), "Cannot get data from Certis", new Exception(innerexception));
	public static CertisServiceException CTS002(string innerexception) => new CertisServiceException(nameof(CTS002), "Cannot post data to Certis", new Exception(innerexception));
	public static CertisServiceException CT001(string innerexception) => new CertisServiceException(nameof(CT001), $"Unknow error", new Exception(innerexception));
	public static CertisServiceException CT002(string innerexception) => new CertisServiceException(nameof(CT002), $"Invalid client secret", new Exception(innerexception));
	public static CertisServiceException CT003(string innerexception) => new CertisServiceException(nameof(CT003), $"Invalid token", new Exception(innerexception));
	public static CertisServiceException CT004(string innerexception) => new CertisServiceException(nameof(CT004), $"Invalid user id", new Exception(innerexception));
	public static CertisServiceException CT005(string innerexception) => new CertisServiceException(nameof(CT005), $"Invalid datetime", new Exception(innerexception));
	public static CertisServiceException CT006(string innerexception) => new CertisServiceException(nameof(CT006), $"Validation falied", new Exception(innerexception));

	private CertisServiceException(string code, string message) : base(code, message)
	{
	}
	private CertisServiceException(string code, string message, Exception innerexception) : base(code, message, innerexception)
	{
	}
}
