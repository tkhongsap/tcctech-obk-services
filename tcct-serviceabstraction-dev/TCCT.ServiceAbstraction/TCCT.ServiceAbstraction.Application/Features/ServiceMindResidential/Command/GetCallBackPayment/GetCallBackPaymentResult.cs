namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetCallBackPayment;
public class GetCallBackPaymentResult
{
    public GetCallBackPaymentResultData? data { get; set; }
}

public class GetCallBackPaymentResultData
{
    public bool? success { get; set; }
}