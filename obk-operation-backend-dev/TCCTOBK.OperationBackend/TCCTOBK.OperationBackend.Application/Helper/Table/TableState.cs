namespace TCCTOBK.OperationBackend.Application.Helper.Table;
public class TableState
{
	public int First { get; init; } = 0;
	public int Rows { get; init; } = int.MaxValue;
	public int Page { get; init; } = 1;
	public int Skip => First;
	public int Take => Rows;
	public string? SortField { get; set; }
	public int? SortOrder { get; set; } = 1;
	public string? OrderingName => SortOrder == -1 ? SortField + " desc" : SortField;
}
