namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckStatusMember;

public class CheckStatusMemberResult
{
    public string personID { get; set; }
    public string name { get; set; }
    public string? email { get; set; }
    public string? phone { get; set; }
    public List<ServiceType>? serviceType { get; set; }
}

public class ServiceType
{
    public int? serviceTypeID { get; set;}
    public string? serviceTypeName { get; set;}
}