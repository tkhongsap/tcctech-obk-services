using System.Transactions;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class OPAPPUnitOfWork : IOPAPPUnitOfWork
{
  private readonly ITCCTOBKContext _context;
  private Lazy<AppConfigRepository> _appConfigRepository => new Lazy<AppConfigRepository>(() => new AppConfigRepository(_context));
  private Lazy<TimeSheetRepository> _timeSheetRepository => new Lazy<TimeSheetRepository>(() => new TimeSheetRepository(_context));
  private Lazy<TimeCardEntriesRepository> _timeCardEntriesRepository => new Lazy<TimeCardEntriesRepository>(() => new TimeCardEntriesRepository(_context));
  public OPAPPUnitOfWork(ITCCTOBKContext context)
  {
    _context = context;
  }

  #region repository
  public IAppConfigRepository AppConfigRepository => _appConfigRepository.Value;
  public ITimeCardEntriesRepository TimeCardEntries => _timeCardEntriesRepository.Value;
  public ITimeSheetRepository TimeSheet => _timeSheetRepository.Value;
  #endregion


  public TransactionScope CreateTransaction(IsolationLevel level = IsolationLevel.ReadCommitted)
  {
    return new TransactionScope(TransactionScopeOption.Required,
      new TransactionOptions() { IsolationLevel = level, Timeout = new TimeSpan(0, 30, 0) },
      TransactionScopeAsyncFlowOption.Enabled);
  }

  public async Task SaveChangeAsyncWithCommit()
  {
    if (_context.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory")
    {
      //_context.Database.SetCommandTimeout(120);
    }
    using (var trans = CreateTransaction())
    {
      await _context.SaveChangesAsync();
      trans.Complete();
    }
  }
}
