using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCommonAreas;

public class GetCommonAreasResult {
    public int total { get; set; }
    [JsonPropertyName("per_page")]
    public int perPage { get; set; }
    public int offset { get; set; }
    public int to { get; set; }
    [JsonPropertyName("last_page")]
    public int lastPage { get; set; }
    [JsonPropertyName("current_page")]
    public int currentPage { get; set; }
    public int from { get; set; }
    public List<GetCommonAreasResultData>? data { get; set; }
}

public class GetCommonAreasResultData
{
    public string commonAreaId { get; set; }
    public string commonAreaNumber { get; set; }
    public string commonAreaName { get; set; }
    public string buildingPhaseCode { get; set; }
    public string buildingId { get; set; }
    public string buildingPhaseName { get; set; }
    public string projectCode { get; set; }
    public string projectId { get; set; }
    public string projectsName { get; set; }
    public string projectsNameThai { get; set; }
    public string companyName { get; set; }
    public string companyId { get; set; }
    public MozartLocation mozartLocation { get; set; }
    public string sqNo { get; set; }

    public class MozartLocation
    {
        public string name { get; set; }
        public string fullName { get; set; }
        public string code { get; set; }
        public string? description { get; set; }
        public int mozartLocationId { get; set; }
        public int locationTypeId { get; set; }
    }
}

