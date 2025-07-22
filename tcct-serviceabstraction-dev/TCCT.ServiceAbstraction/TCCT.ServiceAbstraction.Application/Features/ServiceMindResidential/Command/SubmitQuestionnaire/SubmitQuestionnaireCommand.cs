using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.SubmitQuestionnaire;
public class SubmitQuestionnaireCommand : ICommand<SubmitQuestionnaireResult>
{
	public string TenantId { get; set; }
	public int QuestionnaireId { get; set; }
	public List<SectionData>? Sections { get; set; }
}
public class SectionData
{
	public int? SectionId { get; set; }
	public List<QuestionData>? Questions { get; set; }
}

public class QuestionData
{
    public int? QuestionId { get; set; }
    public string? Answer { get; set; }
    public List<OptionData>? SelectedOptionIds { get; set; }
    public List<string?>? Images { get; set; }
    public List<string?>? Files { get; set; }
}

public class OptionData
{
    public int? OptionId { get; set; }
    public string? Answer { get; set; }
}