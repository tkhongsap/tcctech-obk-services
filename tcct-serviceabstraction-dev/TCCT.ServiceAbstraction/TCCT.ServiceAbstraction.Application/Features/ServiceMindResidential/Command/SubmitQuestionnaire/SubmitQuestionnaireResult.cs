namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.SubmitQuestionnaire;

public class SubmitQuestionnaireResult
{
	public SubmitQuestionnaireResultData? data { get; set; }
	public string? message { get; set; }
}
public class SubmitQuestionnaireResultData
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? questionnaireId { get; set; }
	public string? tenantId { get; set; }
	public bool? submitted { get; set; }
	public string? createdAt { get; set; }
	public string? updatedAt { get; set; }
	public string? createdBy { get; set; }
	public string? updatedBy { get; set; }
}
