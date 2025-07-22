using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetFeedbackEventTypes;
public class GetFeedbackEventTypesResult
{
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
    public List<GetFeedbackEventTypesResultData>? data { get; set; }
}


public class GetFeedbackEventTypesResultData
{
    public string? orgId { get; set; }
    public string? id { get; set; }
    public string? mozartId { get; set; }
    public string? name { get; set; }
    public string? code { get; set; }
    public string? description { get; set; }
    public string? eventCategoryId { get; set; }
    public string? priorityLevelId { get; set; }
    public bool? isManualEvent { get; set; }
    public bool? isCritical { get; set; }
    public bool? isActive { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedBy { get; set; }
    public string? updatedAt { get; set; }
}