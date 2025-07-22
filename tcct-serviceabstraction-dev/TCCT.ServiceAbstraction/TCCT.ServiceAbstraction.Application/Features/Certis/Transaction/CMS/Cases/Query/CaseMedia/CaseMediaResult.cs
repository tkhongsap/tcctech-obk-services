namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseMedia;
public class CaseMediaResult
{
	public int Id { get; set; }
	public int CaseId { get; set; }
	public string FileName { get; set; } = string.Empty;
	public string Data { get; set; } = string.Empty;
	public string MimeType { get; set; } = string.Empty;
}
