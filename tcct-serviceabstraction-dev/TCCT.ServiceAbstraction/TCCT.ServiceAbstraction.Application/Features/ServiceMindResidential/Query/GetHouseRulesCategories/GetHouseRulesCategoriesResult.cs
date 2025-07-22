using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRulesCategories;

public class GetHouseRulesCategoriesResult {
    public ServiceMindResidentialPaginateResponse paginate { get; set; } = new ServiceMindResidentialPaginateResponse();
    public List<Categories> data { get; set; } = new List<Categories>();
}

public class Categories {
    public string? id { get; set; }
    public string? projectId { get; set; }
    public string? categoryKey { get; set; }
    public bool? isMain { get; set; }
    public string? name { get; set; }
    public string? image { get; set; }
}
public class ServiceMindResidentialPaginateResponse
{
    public int total { get; set; }
    public int limit { get; set; }
    public int count { get; set; }
    public int page { get; set; }
}