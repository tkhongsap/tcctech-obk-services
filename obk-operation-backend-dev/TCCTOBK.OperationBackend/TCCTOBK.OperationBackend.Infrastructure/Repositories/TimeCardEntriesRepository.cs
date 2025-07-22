using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class TimeCardEntriesRepository : BaseRepository<TimeCardEntries>, ITimeCardEntriesRepository
{
  public TimeCardEntriesRepository(ITCCTOBKContext context) : base(context)
  {

  }

  public async Task<bool> CheckIn(Guid tsid, string kcusername)
  {
    var checkscan = await GetByKCUsername(kcusername, DateTime.Now.Date);
    if (checkscan != null)
    {
      return false;
    }
    var checkin = new TimeCardEntries()
    {
      CAID = Guid.NewGuid(),
      TSID = tsid,
      CheckIn = DateTime.Now,
      CheckOut = null,
      KCUsername = kcusername,
      IsActive = true,
      //TODO : remove When autdit
      CreatedBy = new Guid(),
      CreatedByName = "System",
      CreatedDate = DateTime.Now,
      UpdatedBy = new Guid(),
      UpdatedByName = "System",
      UpdatedDate = DateTime.Now,
    };
    await Db.AddAsync(checkin);
    return true;
  }

  public async Task<bool> CheckOut(Guid tsid, string kcusername)
  {
    var now = DateTime.Now.Date;
    var checkscan = await Db.AsTracking().FirstOrDefaultAsync(x => x.IsActive && x.KCUsername == kcusername && x.TSID == tsid && x.CheckIn.Date == now);
    if (checkscan == null)
    {
      return false;
    }
    checkscan.CheckOut = DateTime.Now;
    //TODO : remove When autdit
    checkscan.UpdatedBy = new Guid();
    checkscan.UpdatedByName = "System";
    checkscan.UpdatedDate = DateTime.Now;
    return true;
  }

  public async Task<List<TimeCardEntries>> GetAll()
  {
    var data = await Db.Where(x => x.IsActive).ToListAsync();
    return data;
  }

  public async Task<List<TimeCardEntries>> GetByDate(DateTime date)
  {
    var data = await Db.Where(x => x.IsActive && x.CreatedDate.Date == date.Date).ToListAsync();
    return data;
  }

  public async Task<TimeCardEntries?> GetById(Guid id)
  {
    var data = await Db.FirstOrDefaultAsync(x => x.IsActive && x.CAID == id);
    return data;
  }

  public async Task<List<TimeCardEntries>> GetByKCUsername(string kcusername)
  {
    var data = await Db.Where(x => x.IsActive && x.KCUsername == kcusername).ToListAsync();
    return data;
  }

  public async Task<TimeCardEntries?> GetByKCUsername(string kcusername, DateTime date)
  {
    var data = await Db.FirstOrDefaultAsync(x => x.IsActive && x.KCUsername == kcusername && x.CreatedDate.Date == date.Date);
    return data;
  }

  public async Task<TimeCardEntries?> GetByKCUsername(string kcusername, Guid tsid)
  {
    var data = await Db.FirstOrDefaultAsync(x => x.IsActive && x.KCUsername == kcusername && x.TSID == tsid);
    return data;
  }

  public async Task<TimeCardEntries?> GetByTSID(Guid tsid)
  {
    var data = await Db.FirstOrDefaultAsync(x => x.IsActive && x.TSID == tsid);
    return data;
  }
}
