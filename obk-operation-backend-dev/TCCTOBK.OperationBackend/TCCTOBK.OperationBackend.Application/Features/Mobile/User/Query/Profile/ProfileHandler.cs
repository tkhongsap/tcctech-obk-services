using System.Text.Json;
using Microsoft.VisualBasic;
using NPOI.HSSF.Record;
using NPOI.SS.Formula.Functions;
using Org.BouncyCastle.Math.EC.Rfc7748;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetUpdateMozartSupervisorTechnicain;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application;

public class ProfileHandler : IQueryHandler<ProfileQuery, ProfileResult>
{
  private readonly IUnitOfWork _uow;
  private readonly IAbstractionService _abstractionService;
  private readonly IClientSiteService _clientSiteService;
  public ProfileHandler(IUnitOfWork uow, IAbstractionService abstractionService, IClientSiteService clientSiteService)
  {
    _clientSiteService = clientSiteService;
    _uow = uow;
    _abstractionService = abstractionService;
  }

  public async Task<ProfileResult> Handle(ProfileQuery request, CancellationToken cancellationToken)
  {
    //Pack init 
    var res = new ProfileResult();
    bool isSupervisor = false;
    bool isTechnician = false;
    bool isSOC = false;
    //get Profile
    var supervisorList = await _abstractionService.MasterData.FMsupervisors();
    var technicianList = await _abstractionService.MasterData.GetAllFMTechnician();

    //end pack init

    try
    {
      // find fmc user
      var member = await _uow.MemberRepository.GetByKeyCloakUserId(request.KCUsername);
      var mozartProfile = JsonSerializer.Deserialize<MemberDataJsonModel>(member.DataJson);
      var roleMember = await _uow.RoleRepository.GetByMember(member.MID);
      roleMember = roleMember.Where(x => x.TID == Constant.TENANT_OPERATION_APP_ID).ToList();
      res.Role = roleMember.Select(role => role.RefId).Distinct().ToList();
      res.FullName = mozartProfile.Name == "" || mozartProfile.Name == null ? member.Name : mozartProfile.Name;
      res.UserId = member.MID;
      res.StaffId = member.StaffId;

      if (res.Role.Contains(Constant.CERTIS_SUPERVISOR_ROLE_ID)) isSupervisor = true;
      if (res.Role.Contains(Constant.CERTIS_SOC_ROLE_ID)) isSOC = true;
      if (res.Role.Contains(Constant.CERTIS_OSTECH_ROLE_ID)) isTechnician = true;

      if (isSupervisor)
      {
        var supervisorService = await _abstractionService.MasterData.FMSupervisorsServices();
        var membersup = supervisorList.FirstOrDefault(x => x.email.ToLower() == member.Email.ToLower());

        if (membersup != null)
        {
          res.MozartId = Guid.Parse(membersup.id);
          res.FullName = membersup.fullName;
          res.SupervisorService = supervisorService.Where(x => x.SupervisorId == membersup.id).Select(x => new FMSupervisorsServicesResult()
          {
            Id = x.Id,
            SupervisorId = x.SupervisorId,
            LocationId = x.LocationId,
            IsDefault = x.IsDefault
          }).ToList();
        }
        else
        {
          res.SupervisorService = new List<FMSupervisorsServicesResult>();
        }
        // call supervisor service
      }
      if (isTechnician)
      {
        var technicianService = await _abstractionService.MasterData.FMTechnicianServices();
        var membertech = technicianList.FirstOrDefault(x => x.Email.ToLower() == member.Email.ToLower());

        if (membertech != null)
        {
          res.FullName = membertech.FullName;
          res.MozartId = Guid.Parse(membertech.Id);
          res.TechnicianService = technicianService.Where(x => x.TechnicianId == membertech.Id).Select(x => new FMTechniciansServiceResult()
          {
            Id = x.Id,
            TechnicianId = x.TechnicianId,
            LocationId = x.LocationId,
            ServiceCategoryId = x.ServiceCategoryId
          }).ToList();
          if (res.TechnicianService.Any(x => x.ServiceCategoryId == Constant.CERTIS_CLEANER_SERVICE_CATEGORY))
          {
            res.IsCleaner = true;
          }
        }
        else
        {
          res.TechnicianService = new List<FMTechniciansServiceResult>();
        }
      }
      if (isSOC)
      {
        if (mozartProfile.TechnicianService.Any(x => x.ServiceCategoryId == Constant.CERTIS_SOC_SERVICE_CATEGORY))
        {
          res.MozartId = Guid.Parse(DomainConfig.OpsApp.GuardTourId);
          res.FullName = mozartProfile.Name ?? member.FirstName + " " + member.LastName;
        }
      }

      //return section

      foreach (var item in member.ClientMember)
      {
        var userclientsite = new UserClientData();
        var cs = await _uow.ClientSiteRepository.GetClientSiteById(item.CSID);
        var staffid = await _uow.ClientSiteRepository.GetClientMemberByMID(member.MID, item.CSID);
        userclientsite.StaffId = staffid.StaffId ?? 0;
        userclientsite.CSID = cs.CSID;
        userclientsite.ClientSiteName = cs.Name;
        userclientsite.Role = roleMember

                 .Where(x => x.CSID == item.CSID)
                 .Select(x => new RoleData
                 {
                   Name = GetRoleValue(x.RefId),
                   Role = x.RefId
                 }).OrderBy(x => x.Role)
                 .ToList();
        if (res.Role.Count() == 0)
        {
          throw new BadRequestException("Account not setting Role Please setting Role and Try Again");
        }
        res.UserClient.Add(userclientsite);
      }

      return res;
    }
    catch (Exception ex)
    {
      throw new BadRequestException("Something went worng please contact admin");
    }
  }
  private string GetRoleValue(int role)
  {
    if (role == 1) return "Supervisor";
    if (role == 2) return "SOC";
    if (role == 3) return "Outsource Supervisor";
    if (role == 4) return "DCC Manager";
    if (role == 5) return "FMC Manager";
    if (role == 6) return "SOC Manager";
    return "";
  }
}

