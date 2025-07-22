namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Tenant.GetDataTenant;

public class GetDataTenantResult
{
	public List<ListDataItem> listData { get; set; } = new();
	public int total { get; set; }
	public int pageCount { get; set; }
	public int pages { get; set; }
}

public class ListDataItem
{
	public int number { get; set; }
	public int totalRecord { get; set; }
	public int tenantID { get; set; }
	public string tenantName { get; set; } = null!;
	public string nameEng { get; set; } = null!;
	public string nameThai { get; set; } = null!;
	public string? phone { get; set; }
	public string? email { get; set; }
	public string? addresss { get; set; }
	public bool showKiosk { get; set; }
	public bool showReception { get; set; }
	public string? remark { get; set; }
	public string createTime { get; set; } = null!;
	public int createBy { get; set; }
	public string? updateTime { get; set; }
	public int? updateBy { get; set; }
	public bool active { get; set; }
}

