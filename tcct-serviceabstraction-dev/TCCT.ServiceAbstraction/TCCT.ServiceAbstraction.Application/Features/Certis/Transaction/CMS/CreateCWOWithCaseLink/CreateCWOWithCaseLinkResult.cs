namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CreateCWOWithCaseLink;
public class CreateCWOWithCaseLinkResult
{
	public int Id { get; set; }
	public int CaseId { get; set; }
	public string Action { get; set; } = string.Empty;
}