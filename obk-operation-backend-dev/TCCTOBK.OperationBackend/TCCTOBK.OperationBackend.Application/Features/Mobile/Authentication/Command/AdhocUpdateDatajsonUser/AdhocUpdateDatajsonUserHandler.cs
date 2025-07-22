// using System;
// using System.Text.Json;
// using MediatR;
// using NPOI.OpenXmlFormats.Spreadsheet;
// using TCCTOBK.OperationBackend.Application.Contracts;
// using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
// using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Model;
// using TCCTOBK.OperationBackend.Domain;

// namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.AdhocUpdateDatajsonUser;

// public class AdhocUpdateDatajsonUserHandler : IRequestHandler<AdhocUpdateDatajsonUserCommand, AdhocUpdateDatajsonUserResult>
// {
//   private readonly IUnitOfWork _uow;

//   public AdhocUpdateDatajsonUserHandler(IUnitOfWork uow)
//   {
//     _uow = uow;
//   }

//   public async Task<AdhocUpdateDatajsonUserResult> Handle(AdhocUpdateDatajsonUserCommand request, CancellationToken cancellationToken)
//   {
//     var useropsapp = await _uow.MemberRepository.GetByTenant(Constant.TENANT_OPERATION_APP_ID);
//     var res = new AdhocUpdateDatajsonUserResult();
//     foreach (var item in useropsapp)
//     {
//       try
//       {
//         var dtjson = JsonSerializer.Deserialize<OpsAppDataJsonSigleServiceModel>(item.DataJson);

//         var newdtjson = new MemberDataJsonModel();
//         var mozartId = "";
//         if (dtjson.SupervisorService != null)
//         {
//           mozartId = dtjson.SupervisorService.SupervisorId;
//         }
//         if (dtjson.TechnicianService != null)
//         {
//           mozartId = dtjson.TechnicianService.TechnicianId;
//         }
//         newdtjson.Email = dtjson.Email;
//         if (!string.IsNullOrEmpty(mozartId))
//         {
//           newdtjson.MozartUserId = new Guid(mozartId);
//         }
//         newdtjson.Name = dtjson.Name;
//         newdtjson.EmailActivities = dtjson.EmailActivities;

//         {
//           newdtjson.TechnicianService.Add(dtjson.TechnicianService);
//         }
//         if (dtjson.SupervisorService != null)
//         {
//           newdtjson.SupervisorService.Add(dtjson.SupervisorService);
//         }
//         var newdtjsonstr = JsonSerializer.Serialize(newdtjson);
//         await _uow.MemberRepository.UpdateDataJson(item.MID, newdtjsonstr);
//         res.Result.Add(newdtjsonstr);
//       }
//       catch
//       {
//         continue;
//       }
//     }
//     await _uow.SaveChangeAsyncWithCommit();

//     var usersoc = await _uow.SOCUserRepository.GetAll();
//     foreach (var item in usersoc)
//     {
//       try
//       {
//         var dtjson = JsonSerializer.Deserialize<OpsAppDataJsonSigleServiceModel>(item.DataJson);
//         var newdtjson = new MemberDataJsonModel();
//         var mozartId = "";
//         if (dtjson.SupervisorService != null)
//         {
//           mozartId = dtjson.SupervisorService.SupervisorId;
//         }
//         if (dtjson.TechnicianService != null)
//         {
//           mozartId = dtjson.TechnicianService.TechnicianId;
//         }
//         newdtjson.Email = dtjson.Email;
//         if (!string.IsNullOrEmpty(mozartId))
//         {
//           newdtjson.MozartUserId = new Guid(mozartId);
//         }
//         newdtjson.Name = dtjson.Name;
//         newdtjson.EmailActivities = dtjson.EmailActivities;
//         {
//           newdtjson.TechnicianService.Add(dtjson.TechnicianService);
//         }
//         if (dtjson.SupervisorService != null)
//         {
//           newdtjson.SupervisorService.Add(dtjson.SupervisorService);
//         }
//         var newdtjsonstr = JsonSerializer.Serialize(newdtjson);
//         await _uow.SOCUserRepository.UpdateDataJson(item.SID, newdtjsonstr);
//         res.Result.Add(newdtjsonstr);
//       }
//       catch
//       {
//         continue;
//       }
//     }

//     await _uow.SaveChangeAsyncWithCommit();
//     return res;
//   }
// }
