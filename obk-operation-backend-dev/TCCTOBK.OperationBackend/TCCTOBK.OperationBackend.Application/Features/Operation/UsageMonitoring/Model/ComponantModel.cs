namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Model;

public class Staff
{
    public bool LoginToDay { get; set; }
    public string Sfid { get; set; }
    public string StaffName { get; set; }
    public string Email { get; set; }
    public string Component { get; set; }
    public string Position { get; set; }
    public string Company { get; set; }
    public string Location { get; set; }
    public bool MustUseOpsApp { get; set; }
    public bool IsDelete { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string KeyCloakUserId { get; set; }
}

public class ComponentModel

{
    public List<Staff> Staffs { get; set; }
    public int Count { get; set; }
}
