using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRules;

public class GetHouseRulesResult {
    public ServiceMindResidentialPaginateResponse paginate { get; set; } = new ServiceMindResidentialPaginateResponse();
    public List<HouseRules> data { get; set; } = new List<HouseRules>();
}

public class HouseRules {
    public string? id { get; set; }
    public string? houseRulesCategoryId { get; set; }
    public string? name { get; set; }
    public string? file { get; set; }
    public bool? isMain { get; set; }
}

public class ServiceMindResidentialPaginateResponse
{
    public int total { get; set; }
    public int limit { get; set; }
    public int count { get; set; }
    public int page { get; set; }
}