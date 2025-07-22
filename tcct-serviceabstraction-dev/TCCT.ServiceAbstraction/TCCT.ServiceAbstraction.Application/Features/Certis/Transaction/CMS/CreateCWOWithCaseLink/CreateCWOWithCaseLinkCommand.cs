using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CreateCWOWithCaseLink;
public class CreateCWOWithCaseLinkCommand : ICommand<List<CreateCWOWithCaseLinkResult>>
{
	public string CaseId { get; set; } = string.Empty;


	public CreateCWOWithCaseLinkCommand(string caseId)
	{
		CaseId = caseId;
	}
}
