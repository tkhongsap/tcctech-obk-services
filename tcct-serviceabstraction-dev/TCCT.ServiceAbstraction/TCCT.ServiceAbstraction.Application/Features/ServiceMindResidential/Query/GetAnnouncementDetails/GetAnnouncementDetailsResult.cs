namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncementDetails;

public class GetAnnouncementDetailsResult {
    public GetAnnouncementDetailsResultData data { get; set; }
}

public class GetAnnouncementDetailsResultData {
    public string id { get; set; }
    public string title { get; set; }
    public string imageUrl { get; set; }
    public string description { get; set; }
    public string content { get; set; }
    public string dateTime { get; set; }
    public string? pinnedToHomeEndDate { get; set; }
    public string? announcementDate { get; set; }
}