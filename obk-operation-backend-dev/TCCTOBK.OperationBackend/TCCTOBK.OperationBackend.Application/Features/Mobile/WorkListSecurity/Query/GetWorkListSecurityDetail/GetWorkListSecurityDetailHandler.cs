using System.Text.Json;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Model;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;

namespace TCCTOBK.OperationBackend.Application;

public class GetWorkListSecurityDetailHandler : IRequestHandler<GetWorkListSecurityDetailQuery, List<GetWorkListSecurityDetailResult>>
{
  private readonly IAbstractionService _apiService;

  public GetWorkListSecurityDetailHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<List<GetWorkListSecurityDetailResult>> Handle(GetWorkListSecurityDetailQuery request, CancellationToken cancellationToken)
  {
    var res = new List<GetWorkListSecurityDetailResult>();
    if (request.WorkType.ToLower() == "cwo")
    {
      var workorder = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
      var work = workorder.FirstOrDefault(x => x.Id == request.WorkId) ?? new CWOMasterResult();
      var cwodata = await _apiService.CertisTransaction.GetCWODetail(request.WorkId.ToString());
      if (cwodata == null)
      {
        return res;
      }
      foreach (var item in cwodata)
      {
        var cwo = new GetWorkListSecurityDetailResult();
        cwo.Description = item.Description;
        cwo.WorkId = item.Id;
        cwo.WorkName = work.Description ?? "-";
        cwo.TitleImageURL = "-";
        cwo.Detail = item.Description;
        res.Add(cwo);
      }

    }
    if (request.WorkType.ToLower() == "ppm")
    {
      var workorder = await _apiService.CertisTransaction.GetAllPPMWorkOrderList();
      var work = workorder.FirstOrDefault(x => x.Id == request.WorkId) ?? new PPMMasterResult();
      var ppmdata = await _apiService.CertisTransaction.GetPPMTask(request.WorkId);
      if (ppmdata == null)
      {
        return res;
      }
      foreach (var item in ppmdata)
      {
        var ppm = new GetWorkListSecurityDetailResult();
        ppm.Description = item.Description;
        ppm.WorkId = item.Id;
        ppm.WorkName = "-";
        ppm.TitleImageURL = "";
        ppm.Description = item.Description;
        ppm.Detail = "-";
        res.Add(ppm);
      }
    }
    return res;
  }
}
