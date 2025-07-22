namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDirectoryContacts;
public class GetDirectoryContactsResult {
    public GetDirectoryContactsResultData data { get; set; } = new GetDirectoryContactsResultData();
}

public class GetDirectoryContactsResultData {
    public List<CategoryResult> categories { get; set; } = new List<CategoryResult>();
}

public class CategoryResult {
    public int id { get; set; }
    public string? name { get; set; }
    public List<ContactResult> contacts { get; set; } = new List<ContactResult>();
}

public class ContactResult {
    public string id { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
    public string? email { get; set; }
    public string? address { get; set; }
    public string? phoneNumber { get; set; }
    public string? icon { get; set; }
}

public class GetDirectoryContactsResultServiceMind {
    public string id { get; set; }
    public string? phoneNumber { get; set; }
    public string? categoryId { get; set; }
    public string? name { get; set; }
    public string? icon { get; set; }
    public Category category { get; set; } = new Category();
}

public class Category {
    public int id { get; set; }
    public string? name { get; set; }
    public string? icon { get; set; }
}