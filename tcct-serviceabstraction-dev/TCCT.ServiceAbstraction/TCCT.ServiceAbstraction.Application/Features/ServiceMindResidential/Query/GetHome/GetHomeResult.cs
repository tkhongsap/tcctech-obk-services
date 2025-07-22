using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHome;

public class GetHomeResult
{
    public string? tenantId { get; set; }
    public AnnouncementSection anouncement { get; set; } = new AnnouncementSection();
    public List<QuickActionSection> quickAction { get; set; } = new List<QuickActionSection>();
    public ReminderSection reminder { get; set; } = new ReminderSection();
    public List<ServiceSection> services { get; set; } = new List<ServiceSection>();
}

public class AnnouncementSection
{
    public string? title { get; set; }
    public string? description { get; set; }
    public string? url { get; set; }
    public List<Announcement> contents { get; set; } = new List<Announcement>();
}

public class QuickActionSection
{
    public string? icon { get; set; }
    public string? title { get; set; }
    public string? url { get; set; }
    public string? action { get; set; }
}

public class ReminderSection
{
    public Visitor visitor { get; set; } = new Visitor();
    public Parcel parcel { get; set; } = new Parcel();
}

public class ServiceSection
{
    public string? id { get; set; }
    public string? type { get; set; }
    public string name { get; set; } = string.Empty;
    public Data data { get; set; } = new Data();
    public ChatAvatar chatAvatar { get; set; } = new ChatAvatar();
}

public class GetHomeResultServiceMind {
    public string? tenantId { get; set; }
    public List<Announcement> announcements { get; set; } = new List<Announcement>();
    public List<QuickAction> quickActions { get; set; } = new List<QuickAction>();
    public Reminder reminder { get; set; } = new Reminder();
    public List<Service> services { get; set; } = new List<Service>();
}

public class Announcement {
    public string? id { get; set; }
    public string? title { get; set; }
    public string? imageUrl { get; set; }
    public string? description { get; set; }
    public bool pinnedToHome { get; set; }
    public string? pinnedToHomeEndDate { get; set; }
    public string? announcementDate { get; set; }
    public List<Projects> projects { get; set; } = new List<Projects>();
}

public class ChatAvatar
{
    public int? id { get; set; }
    public int? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public bool? isActive { get; set; }
    public int? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? refImageUrl { get; set; }
}

public class Projects {
    public int? projectId { get; set; }
    public string? projectCode { get; set; }
    public string? projectsName { get; set; }
}

public class QuickAction {

    public string? icon { get; set; }
    public TitleQuickAction? title { get; set; }
    public DataQuickAction? data { get; set; }
}

public class TitleQuickAction {
    public string? en { get; set; }
    public string? th { get; set; }
    public string? cn { get; set; }
}

public class DataQuickAction {
    public string? url { get; set; }
    public string? action { get; set; }
}

public class Reminder {

    public Visitor visitor { get; set; } = new Visitor();
    public Parcel parcel { get; set; } = new Parcel();
}

public class Visitor {
    [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]
    public int? total { get; set; }
    public List<UnitWiseCount> unitWiseCount { get; set; } = new List<UnitWiseCount>();
}

public class Parcel {
    public string? total { get; set; }
    public List<UnitWiseCount> unitWiseCount { get; set; } = new List<UnitWiseCount>();
}

public class UnitWiseCount {
    [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]
    public int? unitId { get; set; }
    [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]
    public int? projectId { get; set; }
    [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]
    public int? count { get; set; }
}

public class Service {

    public string? id { get; set; }
    public string? type { get; set; }
    public Name name { get; set; } = new Name();
    public Data data { get; set; } = new Data();
    public List<Projects> projects { get; set; } = new List<Projects>();
	public ChatAvatar chatAvatar { get; set; } = new ChatAvatar();
}

public class Name {

    public string? en { get; set; }
    public string? th { get; set; }
    public string? cn { get; set; }
}

public class Data {

    public string? phoneNumber { get; set; }
    public string? unreadMsgCount { get; set; }
}