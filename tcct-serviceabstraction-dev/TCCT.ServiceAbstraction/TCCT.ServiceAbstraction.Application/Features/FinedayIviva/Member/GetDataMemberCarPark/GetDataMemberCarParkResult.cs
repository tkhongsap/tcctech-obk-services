namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMemberCarPark;

public class GetDataMemberCarParkResult
{
	public List<ListDataItem> listData { get; set; } = new();
	public int total { get; set; }
	public int pageCount { get; set; }
	public int pages { get; set; }
}

public class ListDataItem
{
	public string personID { get; set; } = null!;
	public int tenantID { get; set; }
	public string name { get; set; } = null!;
	public DateTime createTime { get; set; }
	public bool active { get; set; }
}

