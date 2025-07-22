using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using TCCTOBK.OperationBackend.Domain;


namespace TCCTOBK.OperationBackend.Application;

public class MailService : IMailService
{
	public MailService()
	{

	}
	public async Task SendEmailAsync(MailRequest mailRequest)
	{
		var email = new MimeMessage();
		email.From.Add(new MailboxAddress(DomainConfig.Mail.DisplayName, DomainConfig.Mail.Mail));
		if (mailRequest.ToEmail != null && mailRequest.ToEmail.Count > 0) {
			foreach (var to in mailRequest.ToEmail) {
				email.To.Add(MailboxAddress.Parse(to));
			}
		}
		if (mailRequest.CCToEmail != null && mailRequest.CCToEmail.Count > 0) {
			foreach (var cc in mailRequest.CCToEmail)
			{
				email.Cc.Add(MailboxAddress.Parse(cc));
			}
		}
		email.Subject = mailRequest.Subject;
		var builder = new BodyBuilder();
		if (mailRequest.Attachments != null && mailRequest.Attachments.Count > 0) {
			foreach (var attachment in mailRequest.Attachments!)
			{
				builder.Attachments.Add(attachment.FileName, attachment.Data);
			}
		}
		builder.HtmlBody = mailRequest.Body;
		email.Body = builder.ToMessageBody();
		using var smtp = new SmtpClient();
		smtp.Connect(DomainConfig.Mail.Host, DomainConfig.Mail.Port, SecureSocketOptions.StartTls);
		smtp.Authenticate(DomainConfig.Mail.Username, DomainConfig.Mail.Password);
		await smtp.SendAsync(email);
		smtp.Disconnect(true);
	}
}
