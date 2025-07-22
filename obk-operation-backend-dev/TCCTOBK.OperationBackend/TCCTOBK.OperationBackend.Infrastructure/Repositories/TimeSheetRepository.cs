using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class TimeSheetRepository : BaseRepository<TimeSheet>, ITimeSheetRepository
{
  public TimeSheetRepository(ITCCTOBKContext context) : base(context)
  {
  }

  private IQueryable<TimeSheet> QueryBuilder(int? location, string? checkcode)
  {
    var res = Db;
    if (location != null)
    {
      res.Where(x => x.Location == location);
    }
    if (string.IsNullOrEmpty(checkcode))
    {
      res.Where(x => x.CheckCode == checkcode);
    }
    return res;
  }

  public async Task<bool> CheckValid(int location, string checkcode)
  {
    var check = Db.Any(x => x.CheckCode == checkcode && x.Location == location);
    return check;
  }

  public async Task CreateTimeSheet(List<int> location)
  {
    var data = await Db.AsTracking().ToListAsync();
    foreach (var item in data)
    {
      item.IsActive = false;
    }
    var addTimeSheet = new List<TimeSheet>();
    foreach (var item in location)
    {
      var ts = new TimeSheet();
      ts.Location = item;
      ts.TSID = Guid.NewGuid();
      ts.CheckCode = Guid.NewGuid().ToString();
      ts.IsActive = true;
      //TODO : remove When autdit
      ts.CreatedBy = new Guid();
      ts.CreatedByName = "System";
      ts.CreatedDate = DateTime.Now;
      ts.UpdatedBy = new Guid();
      ts.UpdatedByName = "System";
      ts.UpdatedDate = DateTime.Now;
      Db.Add(ts);
    }
    await Db.AddRangeAsync(addTimeSheet);
  }

  public async Task<List<TimeSheet>> GetAll()
  {
    var data = await Db.Where(x => x.IsActive).ToListAsync();
    return data;
  }

  public async Task<List<TimeSheet>> GetByFilter(int? location, string? checkcode)
  {
    var data = await QueryBuilder(location, checkcode).ToListAsync();
    return data;
  }

  public async Task<TimeSheet?> GetByID(Guid tsid)
  {
    var data = await Db.FirstOrDefaultAsync(x => x.TSID == tsid);
    return data;
  }

  public async Task<TimeSheet?> GetByCheckCode(string checkcode)
  {
    // Change check QR code same date.
    // var dtnow = DateTime.Now.Date;
    // var data = await Db.FirstOrDefaultAsync(x => x.IsActive && x.CheckCode == checkcode && x.CreatedDate.Date == dtnow);
    var data = await Db.FirstOrDefaultAsync(x => x.IsActive && x.CheckCode == checkcode);
    return data;
  }
}
