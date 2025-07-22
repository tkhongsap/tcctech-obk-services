using System.Transactions;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IOPAPPUnitOfWork
{
  public IAppConfigRepository AppConfigRepository { get; }
  public ITimeCardEntriesRepository TimeCardEntries { get; }
  public ITimeSheetRepository TimeSheet { get; }
  public Task SaveChangeAsyncWithCommit();
  TransactionScope CreateTransaction(IsolationLevel level = IsolationLevel.ReadCommitted);

}
