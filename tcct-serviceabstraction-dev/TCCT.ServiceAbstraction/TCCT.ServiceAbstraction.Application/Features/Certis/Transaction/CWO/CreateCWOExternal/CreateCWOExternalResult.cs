namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CreateCWOExternal;
public class CreateCWOExternalResult
{
	public string? status { get; set; }
	public string? message { get; set; }
	public CreateCWOExternalData Cwo { get; set; } = new CreateCWOExternalData();
}

public class CreateCWOExternalData
{
	public int? Id { get; set; }
	public string? Name { get; set; }
	public string? Description { get; set; }
	public string? Status { get; set; }
	public DateTime? CreatedOn { get; set; }

}