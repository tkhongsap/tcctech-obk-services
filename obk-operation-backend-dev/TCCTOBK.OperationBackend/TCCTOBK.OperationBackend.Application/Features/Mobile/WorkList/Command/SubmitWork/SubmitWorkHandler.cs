using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class SubmitWorkHandler : IRequestHandler<SubmitWorkCommand, SubmitWorkResult>
{
  private readonly IAbstractionService _apiService;
  public SubmitWorkHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<SubmitWorkResult> Handle(SubmitWorkCommand request, CancellationToken cancellationToken)
  {
    //TODO : 1 Upload Attactment
    // foreach (var item in request.Attatchment)
    // {
    //   await _apiService.CertisTransaction.Upload(item.objectKey, item.objectType, item.description, item.searchTags, item.attachmentType, item.isDefault, item.isHidden, item.bytes);
    // }
    //TODO : 2 Update Task
    if (request.WorkType.ToLower() == "ppm")
    {
      //ppm ต้อง update task confirm complete ทีละtask loop ไปให้ครบ ถึงจะใช้ complete 
      // 1 : query เอา task ทั้งหมดของ ppm มา
      var ppmtask = await _apiService.CertisTransaction.GetPPMTask(request.WorkId);
      // 2 : เอา task มา loop update status to 5
      foreach (var item in ppmtask)
      {
        var req = new UpdatePPMRequest(item.Id, Constant.CERTIS_WORK_STATUS_COMPLETED, request.Remark, request.Reading, new Guid(request.TechniciansId), DateTime.Now);
        await _apiService.CertisTransaction.UpdatePPM(req);
      }
      // 3 : loop เสร็จส่งใบ complete card ใหญ่
      // var complete = new PPMComplteTaskRequest(request.WorkId, request.Remark, "", new Guid(request.TechniciansId));
      // await _apiService.CertisTransaction.PPMComplateTask(complete);
    }
    else if (request.WorkType.ToLower() == "cwo")
    {
      //cwo update task รวดเดียวได้เลยครับ และ ค่อย confirmcomplete 
      var cwodata = await _apiService.CertisTransaction.GetCWODetail(request.WorkId.ToString());
      foreach (var item in cwodata)
      {
        var req = new UpdateCWORequest(item.Id, Constant.CERTIS_WORK_STATUS_COMPLETED, request.Remark, request.Reading, new Guid(request.TechniciansId), DateTime.Now);
        await _apiService.CertisTransaction.UpdateCWO(req);
      }
      // // complete task เลย
      // var complete = new CWOComplteTaskRequest(request.WorkId, "", "", "", new Guid(request.TechniciansId), request.LocationId, "", 0);
      // await _apiService.CertisTransaction.CWOCompleteTask(complete);
    }
    return new SubmitWorkResult() { WorkId = request.WorkId, Status = "Submit" };
  }
}
