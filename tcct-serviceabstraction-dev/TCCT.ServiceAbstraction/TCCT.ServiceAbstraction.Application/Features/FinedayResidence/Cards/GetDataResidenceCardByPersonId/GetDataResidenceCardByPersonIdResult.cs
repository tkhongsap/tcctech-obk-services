namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetDataResidenceCardByPersonId;

public class GetDataResidenceCardByPersonIdResult
{
	public int? cardID { get; set; }
    public string? cardNumber { get; set; }
    public DateTime? startDate { get; set; }
    public DateTime? expiredDate { get; set; }
    public int? residenceId { get; set; }
    public bool? active { get; set; }
}
