using Org.BouncyCastle.Asn1.Cms;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface ITimeCardEntriesRepository
{
  Task<bool> CheckIn(Guid tsid, string kcusername);
  Task<bool> CheckOut(Guid tsid, string kcusername);
  Task<List<TimeCardEntries>> GetByKCUsername(string kcusername);
  Task<TimeCardEntries?> GetByKCUsername(string kcusername, DateTime date);
  Task<TimeCardEntries?> GetByKCUsername(string kcusername, Guid tsid);
  Task<List<TimeCardEntries>> GetAll();
  Task<List<TimeCardEntries>> GetByDate(DateTime date);
  Task<TimeCardEntries?> GetById(Guid id);
  Task<TimeCardEntries?> GetByTSID(Guid tsid);
}
