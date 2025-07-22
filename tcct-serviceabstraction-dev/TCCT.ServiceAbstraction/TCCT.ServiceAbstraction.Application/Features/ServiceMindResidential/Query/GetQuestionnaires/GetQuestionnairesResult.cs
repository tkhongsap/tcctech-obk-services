namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaires;

public class GetQuestionnairesResult {
   public GetQuestionnairesPaginateResponse paginate { get; set; } = new();
   public List<GetQuestionnairesResultData> data { get; set; } = new();
}

public class GetQuestionnairesResultData
{
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public string? fromDate { get; set; }
    public string? toDate { get; set; }
    public string? duration { get; set; }
    public string? durationUnit { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
    public bool isActive { get; set; }
    public int status { get; set; }
}

public class GetQuestionnairesPaginateResponse
{
    public int total { get; set; }
    public int limit { get; set; }
    public int count { get; set; }
    public int page { get; set; }
}