namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncements;

public class GetAnnouncementsResult {
   public GetAnnouncementsPaginateResponse paginate { get; set; } = new();
   public List<GetAnnouncementsResultData> data { get; set; } = new();
}


public class GetAnnouncementsResultData
{
   public string? id { get; set; }
   public string? title { get; set; }
   public string? imageUrl { get; set; }
   public string? description { get; set; }
   public bool pinnedToHome { get; set; }
   public string? pinnedToHomeEndDate { get; set; }
    public string? announcementDate { get; set; }
}

public class GetAnnouncementsPaginateResponse
{
    public int total { get; set; }
    public int limit { get; set; }
    public int count { get; set; }
    public int page { get; set; }
}