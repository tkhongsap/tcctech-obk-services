using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface ITimeSheetRepository
{
  Task<List<TimeSheet>> GetAll();
  Task<TimeSheet?> GetByID(Guid tsid);
  Task<TimeSheet?> GetByCheckCode(string checkcode);
  Task<List<TimeSheet>> GetByFilter(int? location, string? checkcode);
  Task<bool> CheckValid(int location, string checkcode);
  Task CreateTimeSheet(List<int> location);
}
