using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.UpdateCaseStatus;
public class UpdateCaseStatusCommand : ICommand<UpdateCaseStatusResult>
{
	public int CaseId { get; set; }
	public int StatusCode { get; set; }


	public UpdateCaseStatusCommand(int caseId, int statusCode)
	{
		CaseId = caseId;
		StatusCode = statusCode;
	}
}
