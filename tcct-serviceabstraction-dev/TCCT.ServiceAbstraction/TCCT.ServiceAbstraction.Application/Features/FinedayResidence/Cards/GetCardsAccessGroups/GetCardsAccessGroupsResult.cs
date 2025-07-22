using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetCardsAccessGroups;

public class GetCardsAccessGroupsResult
{
    public int cardID { get; set; }
    public string cardNumber { get; set; }
    public DateTime startDateUse { get; set; }
    public DateTime expiredDate { get; set; }
    public int residenceID { get; set; }
    public int honeywellAccessGroupID { get; set; }
    public string honeywellAccessGroupName { get; set; }
    public bool cardStatus { get; set; }
}
