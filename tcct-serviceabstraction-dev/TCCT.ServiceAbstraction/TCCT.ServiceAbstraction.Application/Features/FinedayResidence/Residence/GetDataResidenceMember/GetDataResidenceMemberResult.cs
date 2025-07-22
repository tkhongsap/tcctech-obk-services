namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceMember;
public class GetDataResidenceMemberResult {
    public List<CheckStatusMemberData> listData { get; set; }
    public int total { get; set; }
}

public class CheckStatusMemberData
{
    public int number { get; set; }
    public int totalRecord { get; set; }
    public string personID { get; set; }
    public string firstname { get; set; }
    public string lastname { get; set; }
    public string gender { get; set; }
    public int hasCard { get; set; }
    public DateTime createTime { get; set; }
    public int createBy { get; set; }
    public bool active { get; set; }
}