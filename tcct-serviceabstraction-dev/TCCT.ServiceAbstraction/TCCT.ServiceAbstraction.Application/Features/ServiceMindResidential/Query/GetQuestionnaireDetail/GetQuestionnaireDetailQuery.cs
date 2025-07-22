using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaireDetail;
public class GetQuestionnaireDetailQuery : IQuery<GetQuestionnaireDetailResult>
{
	public string TenantId { get; set; }
	public int QuestionnaireId { get; set; }
	public string? Lang { get; set; }
	public GetQuestionnaireDetailQuery(string tenantId, int questionnaireId, string? lang)
	{
		TenantId = tenantId;
		QuestionnaireId = questionnaireId;
		Lang = lang;
	}
}
