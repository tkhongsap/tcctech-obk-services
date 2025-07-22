using System;
using System.Data.Common;
using System.Net.Http.Headers;
using System.Text.Json;
using Amazon.SimpleEmail.Model;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class UsageMonitoringRepository : BaseRepository<UsageLogMonitoring>, IUsageLogMonitoringRepository
{

    private readonly IClientSiteService _clientSiteService;
    public UsageMonitoringRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
    {
        _clientSiteService = clientSiteService;
    }

  private IQueryable<UsageLogMonitoring> GetByIdQueryBuilder()
  {
    var query = Db.AsTracking();
    query = query.Where(e => e.CSID == _clientSiteService.ClientSiteId);
    return query;
  }
  public async Task<UsageLogMonitoring> GetLastLog()
  {
    var query = GetByIdQueryBuilder();
    var result = await query.OrderByDescending(e => e.CreatedAt ).FirstOrDefaultAsync();
    return result;
  }

  public async Task<UsageLogMonitoring> GetByDate(string date)
  {
    var existingRecord = await Db.AsTracking().FirstOrDefaultAsync(x => x.SyncDate == date && x.CSID == _clientSiteService.ClientSiteId);
    return existingRecord;
  }

  public async Task<UsageLogMonitoring> UpdateUsageMonitoring(UsageLogMonitoring data, string date)
  {
    var existingRecord = await Db.AsTracking().FirstOrDefaultAsync(x => x.SyncDate == date && x.CSID == _clientSiteService.ClientSiteId);
        if (existingRecord != null)
        {
            existingRecord.FixedDailyUserTarget = data.FixedDailyUserTarget;
            existingRecord.AtcualActiveDailyUser = data.AtcualActiveDailyUser;
            existingRecord.TotlaOnGroundStaffMustUseOpsApp = data.TotlaOnGroundStaffMustUseOpsApp;
            existingRecord.TotalDalilyOnGroundStaffMustUseOpsAppWithRegister = data.TotalDalilyOnGroundStaffMustUseOpsAppWithRegister;
            existingRecord.TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister = data.TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister;
            existingRecord.Component = data.Component;
            existingRecord.Statistics = data.Statistics;
            existingRecord.AllStaff = data.AllStaff;
            existingRecord.SumWeekDay = data.SumWeekDay;
            existingRecord.SumWeekEnd = data.SumWeekEnd;
            existingRecord.CreatedAt = data.CreatedAt;
            existingRecord.CSID = _clientSiteService.ClientSiteId;    
    }
    return existingRecord;
  }
  public async Task<UsageLogMonitoring> CreateUsageMonitoring(UsageLogMonitoring data, DateTime date)
  {
    var existingRecord = await Db.AsTracking().FirstOrDefaultAsync(x => x.CreatedAt == date.Date);

        if (existingRecord != null)
        {
            existingRecord.FixedDailyUserTarget = data.FixedDailyUserTarget;
            existingRecord.AtcualActiveDailyUser = data.AtcualActiveDailyUser;
            existingRecord.TotlaOnGroundStaffMustUseOpsApp = data.TotlaOnGroundStaffMustUseOpsApp;
            existingRecord.TotalDalilyOnGroundStaffMustUseOpsAppWithRegister = data.TotalDalilyOnGroundStaffMustUseOpsAppWithRegister;
            existingRecord.TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister = data.TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister;
            existingRecord.Component = data.Component;
            existingRecord.Statistics = data.Statistics;
            existingRecord.AllStaff = data.AllStaff;
            existingRecord.SumWeekDay = data.SumWeekDay;
            existingRecord.SumWeekEnd = data.SumWeekEnd;
            existingRecord.CreatedAt = data.CreatedAt;
            existingRecord.CSID = _clientSiteService.ClientSiteId;
    }
        else
        {
            data.CSID = _clientSiteService.ClientSiteId;
            await Db.AddAsync(data);
        }
    return data;
  }



}
