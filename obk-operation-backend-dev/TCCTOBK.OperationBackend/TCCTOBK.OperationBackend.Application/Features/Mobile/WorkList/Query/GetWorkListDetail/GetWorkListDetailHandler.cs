using System.Text.Json;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Model;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;

namespace TCCTOBK.OperationBackend.Application;

public class GetWorkListDetailHandler : IRequestHandler<GetWorkListDetailQuery, GetWorkListDetailResult>
{
  private readonly IAbstractionService _apiService;

  public GetWorkListDetailHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<GetWorkListDetailResult> Handle(GetWorkListDetailQuery request, CancellationToken cancellationToken)
  {
    var res = new GetWorkListDetailResult();
    if (request.WorkType.ToLower() == "cwo")
    {
      var workorder = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
      var work = workorder.FirstOrDefault(x => x.Id == request.WorkId) ?? new CWOMasterResult();
      var cwodata = await _apiService.CertisTransaction.GetCWODetail(request.WorkId.ToString());
      var cwolist = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
      var workcwoheader = cwolist.FirstOrDefault(x => x.Id == request.WorkId);
      if (cwodata == null)
      {
        return res;
      }
      res.WorkId = workcwoheader.Id;
      res.WorkName = workcwoheader.Name;
      res.WorkDescription = workcwoheader.Description;
      foreach (var item in cwodata)
      {
        var cwo = new WorkListDeatil();
        cwo.Description = item.Description;
        cwo.WorkId = item.Id;
        cwo.WorkName = work.Description ?? "-";
        cwo.TitleImageURL = "-";
        cwo.Detail = item.Description;
        res.WorkListDetail.Add(cwo);
      }

    }
    if (request.WorkType.ToLower() == "ppm")
    {
      var workorder = await _apiService.CertisTransaction.GetAllPPMWorkOrderList();
      var work = workorder.FirstOrDefault(x => x.Id == request.WorkId) ?? new PPMMasterResult();
      var ppmdata = await _apiService.CertisTransaction.GetPPMTask(request.WorkId);
      var ppmlist = await _apiService.CertisTransaction.GetAllPPMWorkOrderList();
      var workppmheader = ppmlist.FirstOrDefault(x => x.Id == request.WorkId);
      if (ppmdata == null)
      {
        return res;
      }
      res.WorkId = workppmheader.Id;
      res.WorkName = workppmheader.Name;
      res.WorkDescription = "description";

      foreach (var item in ppmdata)
      {
        var ppm = new WorkListDeatil();
        ppm.Description = item.Description;
        ppm.WorkId = item.Id;
        ppm.WorkName = "-";
        ppm.TitleImageURL = "";
        ppm.Description = item.Description;
        ppm.Detail = "-";
        res.WorkListDetail.Add(ppm);
      }
    }
    return res;
  }
}
