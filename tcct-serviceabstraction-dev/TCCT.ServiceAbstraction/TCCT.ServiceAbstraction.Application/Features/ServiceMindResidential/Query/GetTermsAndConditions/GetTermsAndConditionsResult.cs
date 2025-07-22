using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTermsAndConditions;

public class GetTermsAndConditionsResult {
    public TermsAndConditionsData data { get; set; } = new TermsAndConditionsData();
}

public class TermsAndConditionsData {
    public string? id { get; set; }
    public Project project { get; set; } = new Project();
    public string? title { get; set; }
    public string? term { get; set; }
}

public class Project {
    public int projectId { get; set; }
    public string? projectCode { get; set; }
    public string? projectsName { get; set; }
}
