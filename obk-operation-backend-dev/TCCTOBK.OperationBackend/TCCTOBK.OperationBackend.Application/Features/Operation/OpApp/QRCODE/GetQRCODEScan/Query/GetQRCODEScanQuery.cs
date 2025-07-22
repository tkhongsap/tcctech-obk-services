using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;

public class GetQRCODEScanQuery : IRequest<GetQRCODEScanResult>
{
  public string CheckCode { get; set; }
  public GetQRCODEScanQuery(string checkcode)
  {
    CheckCode = checkcode;
  }
}
