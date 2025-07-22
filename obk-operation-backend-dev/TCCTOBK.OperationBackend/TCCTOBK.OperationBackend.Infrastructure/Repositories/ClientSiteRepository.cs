using System;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

internal class ClientSiteRepository : BaseRepository<ClientSite>, IClientSiteRepository
{
  public ClientSiteRepository(ITCCTOBKContext context) : base(context)
  {
  }

  public async Task<ClientMember> GetClientMemberByMID(Guid mid, Guid csid)
  {
    var data = await Context.ClientMember.FirstOrDefaultAsync(x => x.MID == mid && x.CSID == csid);
    return data;
  }

  public async Task<ClientSite> GetClientSiteById(Guid csid)
  {
    var data = await Db.FirstOrDefaultAsync(x => x.CSID == csid);
    return data;
  }

  public Task<List<ClientSite>> GetAll(string? name, List<Guid>? csidList)
  {
    var query = GetAllQueryBuilder(name, csidList);
    return query.ToListAsync();
  }
  public Task<int> GetAllCount(string? clientName, List<Guid>? csidList)
  {
    var query = GetAllQueryBuilder(clientName, csidList);
    return query.CountAsync();
  }
  private IQueryable<ClientSite> GetAllQueryBuilder(string? name, List<Guid>? csidList)
  {
    var query = Db.AsQueryable();
    if (name != null)
    {
      query = query.Where(x => x.Name.ToLower().Contains(name.ToLower()));
    }
    if (csidList != null && csidList.Count > 0)
    {
      query = query.Where(x => csidList.Contains(x.CSID));
    }
    return query;
  }

  public async Task<List<ClientSite>> GetClientSiteByMID(Guid mid)
  {
    var query = await Context.TenantMember.Where(x => x.MID == mid && x.TID == Constant.TENANT_OBKCMS_ID).Select(x => x.CSID).ToListAsync();
    var res = await Db.Where(x => query.Contains(x.CSID)).ToListAsync();
    return res;
  }

}