// using System.Text.Json;
// using System.Xml.Linq;
// using MediatR;
// using Org.BouncyCastle.Math.EC.Rfc7748;
// using TCCTOBK.OperationBackend.Application.Contracts.API;
// using TCCTOBK.OperationBackend.Application.Features.Operation.Routine.Model;

// namespace TCCTOBK.OperationBackend.Application;

// public class GetTodoListHandler : IRequestHandler<GetTodoListQuery, List<GetTodoListResult>>
// {
//   private readonly IAbstractionService _apiService;

//   public GetTodoListHandler(IAbstractionService apiService)
//   {
//     _apiService = apiService;
//   }

//   public async Task<List<GetTodoListResult>> Handle(GetTodoListQuery request, CancellationToken cancellationToken)
//   {
//     var status = new List<int>();
//     var result = await Task.WhenAll(GetCWO(request.LocationId, request.TechnicianId));

//     if (result == null)
//     {
//       return new List<GetTodoListResult>();
//     }
//     var data = new List<GetTodoListResult>();
//     foreach (var item in result)
//     {
//       data.AddRange(item);
//     }
//     return data;
//   }

//   private async Task<List<GetTodoListResult>> GetCWO(int locationId, string technicianId)
//   {
//     var cwo = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
//     var location = await _apiService.MasterData.GetAllAssets();
//     var statusText = await _apiService.MasterData.GetAllStatus();
//     var status = new List<int>() { 2, 3, 4 };
//     var filter = cwo.Where(x => x.LocationId == locationId && status.Contains(x.StatusId)).Select(x => new RoutineItem(x)).ToList();
//     var res = new List<GetTodoListResult>();
//     res.AddRange(filter.Select(x => new GetTodoListResult()
//     {
//       WorkId = x.Id,
//       Name = x.Name ?? "-",
//       Location = x.LocationId,
//       LocationText = location?.FirstOrDefault(a => x.LocationId == a.LocationId)?.Name ?? "-",
//       ToDoDate = x.TargetStart,
//       ToDoTimeString = x.TargetStart.ToLongTimeString(),
//       ToDoTitle = x.Description ?? "-",
//       WorkType = "CWO",
//       Status = x.StatusId,
//       StatusText = statusText.FirstOrDefault(s => s.Id == x.StatusId)?.Name ?? "-",
//       TaskId = x.Id,
//       Color = "#FF0004"
//     }).ToList());
//     return res;
//   }

//   private async Task<List<GetTodoListResult>> GetPPM(int locationId, List<int> status)
//   {
//     var res = new List<GetTodoListResult>();
//     var ppm = await _apiService.CertisTransaction.GetAllPPMWorkOrderList();
//     var ppmwos = await _apiService.CertisTransaction.GetAllPPMWOS();
//     var location = await _apiService.MasterData.GetAllAssets();
//     var statusText = await _apiService.MasterData.GetAllStatus();
//     var filter = ppm.Where(x => x.LocationId == locationId && status.Contains(x.StatusId)).Select(x => new RoutineItem(x)).Select(x => x.Id).ToList();
//     var listtask = new List<Task<List<PPMTaskModel>>>();
//     foreach (var item in filter)
//     {
//       listtask.Add(_apiService.CertisTransaction.GetPPMTask(item));
//     }
//     var ppmtask = await Task.WhenAll(listtask);

//     res.AddRange(ppmtask.SelectMany(x => x.Select(a =>
//       new GetTodoListResult()
//       {
//         WorkId = a.WOId,
//         Name = a.Description,
//         Location = locationId,
//         LocationText = location?.FirstOrDefault(a => locationId == a.LocationId)?.Name ?? "-",
//         ToDoDate = a.ModifiedOn,
//         ToDoTimeString = a.ModifiedOn.ToLongTimeString(),
//         ToDoTitle = a.Description ?? "-",
//         WorkType = "PPM",
//         Status = ppm.FirstOrDefault(x => x.Id == a.WOId)!.StatusId,
//         StatusText = statusText.FirstOrDefault(s => ppm.FirstOrDefault(x => x.Id == a.WOId)!.StatusId == s.Id)?.Name ?? "-",
//         TaskId = a.Id,
//         Color = "#14181B"
//       })
//     .ToList()));
//     return res;
//   }
// }
