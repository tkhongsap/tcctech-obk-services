namespace TCCTOBK.OperationBackend.Application;

public interface IMailService
{
	Task SendEmailAsync(MailRequest mailRequest);
}
