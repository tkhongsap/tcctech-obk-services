using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure;

public class SOCUserRepository : BaseRepository<SOCUser>, ISOCUserRepository
{
  public SOCUserRepository(ITCCTOBKContext context) : base(context)
  {

  }

  public Task<bool> CheckTenant(Guid sid, Guid tenantId)
  {
    return Context.SOCUserTanent.AnyAsync(x => x.SID == sid && x.TID == tenantId);
  }

  public async Task<Guid> CreateSOCUser(string email, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable, string identifynumber, int identifytype, string firstname, string lastname)
  {
    var user = new SOCUser()
    {
      SID = Guid.NewGuid(),
      FirstName = firstname,
      LastName = lastname,
      FirstNameEn = "",
      LastNameEn = "",
      KeyCloakUserId = keyCloakUserId,
      IdentifyNumber = identifynumber,
      IdentifyType = identifytype,
      DataJson = dataJson,
      CreatedBy = Guid.Empty,
      CreatedByName = "Oppapp System",
      CreatedDate = DateTime.Now,
      UpdatedBy = Guid.Empty,
      UpdatedByName = "Oppapp System",
      UpdatedDate = DateTime.Now,
    };
    await Context.SOCUser.AddAsync(user);
    var existingroles = await Context.Roles.AsTracking().Where(x => roles.Contains(x.RID)).ToListAsync();
    await Context.RoleSOCUser.AddRangeAsync(existingroles.Select(role => new trRoleSOCUser
    {
      SID = user.SID,
      RID = role.RID,
      IsActive = true
    }));
    return user.SID;
  }

  public async Task<List<SOCUser>> GetAll()
  {
    var result = await Db.Where(x => x.IsActive).ToListAsync();
    return result;
  }

  public async Task<SOCUser> GetByKeyCloakUserId(string kcusername)
  {
    var result = await Db.Where(x => x.KeyCloakUserId == kcusername).Include(x => x.trRoleSOCUser).FirstOrDefaultAsync();
    if (result == null) throw new NotFoundException("ไม่พบ soc user kc");
    return result;
  }

  public async Task InsertTenantSOCUser(Guid memberId, Guid tenentId)
  {
    var data = new SOCUserTanent
    {
      SID = memberId,
      TID = tenentId
    };

    await Context.SOCUserTanent.AddAsync(data);
  }

  public async Task<SOCUser> GetById(Guid guid)
  {
    var result = await Db.Include(x => x.trRoleSOCUser).Where(x => x.SID == guid).FirstOrDefaultAsync();
    if (result == null) throw new NotFoundException("ไม่พบ soc user");
    return result;
  }

  public async Task UpdateDataJson(Guid mid, string datajson)
  {
    var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.IsActive && x.SID == mid);
    result.DataJson = datajson;
  }

  public async Task UpdateRole(Guid sid, List<Guid> rid)
  {
    var member = await Context.SOCUser.AsTracking()
        .FirstOrDefaultAsync(x => sid == x.SID)
        ?? throw new NotFoundException("ไม่พบ Member");
    var fmemberrole = Context.RoleSOCUser.AsTracking()
        .Where(x => x.SID == sid);
    Context.RoleSOCUser.RemoveRange(fmemberrole);
    foreach (var item in rid)
    {
      // var role = await Context.RoleSOCUser.FirstOrDefaultAsync(x => x.RID == item)
      //     ?? throw new NotFoundException("ไม่พบ Role");
      var nmb = new trRoleSOCUser()
      {
        IsActive = true,
        SID = sid,
        RID = item
      };
      Context.RoleSOCUser.Add(nmb);
    }
  }

  public async Task<SocUser> GetByEmail(string email)
  {

    var socuser = await GetAll();
    var data = new SocUser();
    foreach (var item in socuser)
    {
      var dtjson = JsonSerializer.Deserialize<MemberDataJsonModel>(item.DataJson);
      if (dtjson == null)
      {
        continue;
      }
      if (email == dtjson.Email)
      {
        data.Id = item.SID;
        data.Name = dtjson.Email;
        data.KeyCloakUserId = item.KeyCloakUserId;
        break;
      }
    }
    return data;
  }

  public async Task<List<SOCUser>> GetAll(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state)
  {
    var query = GetAllQueryBuilder(filter, roleid, status, tenantIds, isAvailable);

    // if (!string.IsNullOrEmpty(state.OrderingName))
    // {
    //   query = query.OrderBy(state.OrderingName);
    // }

    if (state.Skip > 0) query = query.Skip(state.Skip).Take(state.Take);

    return await query.Include(x => x.trRoleSOCUser).ThenInclude(x => x.trRole).ToListAsync();

  }

  public Task<int> GetAllCount(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state)
  {
    var query = GetAllQueryBuilder(filter, roleid, status, tenantIds, isAvailable);
    return query.CountAsync();
  }
  private IQueryable<SOCUser> GetAllQueryBuilder(string? filter, List<Guid> role, int? status, List<Guid>? tenantIds, bool isAvailable)
  {
    var query = Db.Include(x => x.trRoleSOCUser).Include(x => x.SOCUserTanent).AsQueryable();
    if (!string.IsNullOrEmpty(filter))
    {
      query = query.Where(x => x.SID.ToString().ToLower() == filter.ToLower() || x.FirstName.ToLower().Contains(filter.ToLower()) || x.LastName.ToLower().Contains(filter.ToLower()) || x.trRoleSOCUser.Any(x => x.trRole.Name.ToLower().Contains(filter.ToLower())));
    }
    // if (role.Count() > 0)

    // {
    //   query = query.Where(x => x.trRoleSOCUser.Any(x => role.Contains(x.RID)));
    // }
    // if (tenantIds != null)
    // {
    //   query = query.Where(x => x.SOCUserTanent.Any(t => tenantIds.Contains(t.TID)));
    // }
    return query;
  }

  public async Task<SocUser> GetByEmailLower(string email)
  {
    var socuser = await GetAll();
    var data = new SocUser();
    foreach (var item in socuser)
    {
      var dtjson = JsonSerializer.Deserialize<MemberDataJsonModel>(item.DataJson);
      if (dtjson == null)
      {
        continue;
      }
      if (email.ToLower() == dtjson.Email.ToLower())
      {
        data.Id = item.SID;
        data.Name = dtjson.Email;
        break;
      }
    }
    if (data.Id != Guid.Empty) throw new NotFoundException("email นี้มีอยู่ในระบบแล้ว(SOC)");
    return data;
  }

  public async Task<SocUser> GetByEmailLowerWithOutError(string email)
  {
    var socuser = await GetAll();
    var data = new SocUser();
    foreach (var item in socuser)
    {
      var dtjson = JsonSerializer.Deserialize<MemberDataJsonModel>(item.DataJson);
      if (dtjson == null)
      {
        continue;
      }
      if (email.ToLower() == dtjson.Email.ToLower())
      {
        data.Id = item.SID;
        data.Name = dtjson.Email;
        data.KeyCloakUserId = item.KeyCloakUserId;
        break;
      }
    }
    return data;
  }
  public async Task UpdateSOCStaffId(Guid? sid, int? staffId)
  {

    var soc = await Db.AsTracking().FirstOrDefaultAsync(x => x.SID == sid) ?? throw new NotFoundException("ไม่พบ SOC");
    if (staffId != null) soc.StaffId = staffId;
  }

  public async Task UpdateSOC(SOCUser data, AuditableModel auditable)
  {

    var soc = await Db.AsTracking().FirstOrDefaultAsync(x => x.SID == data.SID) ?? throw new NotFoundException("ไม่พบ SOC");
    if (data.FirstName != null) soc.FirstName = data.FirstName;
    if (data.LastName != null) soc.LastName = data.LastName;
    if (data.StaffId != null) soc.StaffId = data.StaffId;
    if (data.DataJson != null) soc.DataJson = data.DataJson;
    if (data.IdentifyNumber != null) soc.IdentifyNumber = data.IdentifyNumber;
    if (data.IdentifyType != null) soc.IdentifyType = data.IdentifyType;
    if (data.FirstNameEn != null) soc.FirstNameEn = data.FirstNameEn;
    if (data.LastNameEn != null) soc.LastNameEn = data.LastNameEn;
    if (data.Status != null) soc.Status = data.Status;
    if (data.PhoneNumber != null) soc.PhoneNumber = data.PhoneNumber;
    if (data.Gender != null) soc.Gender = data.Gender;
    if (data.IsActive != null) soc.IsActive = data.IsActive;
    if (data.FunctionRoleLocation != null) soc.FunctionRoleLocation = data.FunctionRoleLocation;
  }

  public async Task UpsertFunctionRoleLocation(Guid sid, List<CreateFunctionRolesLocationSOC> funcRoleLocation)
  {
    var member = await Context.SOCUser.AsTracking()
        .FirstOrDefaultAsync(x => sid == x.SID)
        ?? throw new NotFoundException("ไม่พบ SOCUser");
    var fmemberrole = Context.FunctionRoleLocationSOC.AsTracking()
        .Where(x => x.SID == sid);
    Context.FunctionRoleLocationSOC.RemoveRange(fmemberrole);
    foreach (var item in funcRoleLocation)
    {
      var frl = new trFunctionRoleLocationSOC()
      {
        SID = sid,
        LocationId = (int)item.LocationId,
        FunctionRoleId = (int)item.FunctionRoleId
      };
      Context.FunctionRoleLocationSOC.Add(frl);
    }
  }

  public async Task<SOCUser> GetByIdWithOutCatch(Guid guid)
  {
    // trRolePrivilegeItem
    var result = await Db.Include(x => x.FunctionRoleLocation).Include(x => x.trRoleSOCUser).ThenInclude(x => x.trRole).ThenInclude(x => x.trRolePrivilagesItem).ThenInclude(x => x.mtPrivilegeItem).Where(x => x.SID == guid).FirstOrDefaultAsync();
    return result;
  }

  public async Task<SOCUser> GetByStaffId(int staffid)
  {
    var data = await Db.FirstOrDefaultAsync(x => x.StaffId == staffid);
    return data;
  }

}
