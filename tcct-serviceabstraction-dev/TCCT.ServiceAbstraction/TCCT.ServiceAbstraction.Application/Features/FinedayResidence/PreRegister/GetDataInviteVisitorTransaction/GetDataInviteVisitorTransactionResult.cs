using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.GetDataInviteVisitorTransaction;

public class GetDataInviteVisitorTransactionResult
{
    public string message { get; set; } = null!;
    public int status { get; set; }
    public List<GetDataInviteVisitorTransactionResultData>? data { get; set; }
}

public class GetDataInviteVisitorTransactionResultData
{
    public string inviteID { get; set; }
    public List<GetDataInviteVisitorTransactionResultDataList> listData { get; set; }
}


public class GetDataInviteVisitorTransactionResultDataList
{
    public string inviteID { get; set; }
    public string startDate { get; set; }
    public string endDate { get; set; }
    public string guestInviteName { get; set; }
    public string personIDInvite { get; set; }
    public int inviteResidenceID { get; set; }
    public int inviteLocationID { get; set; }
    public bool active { get; set; }
}
