using System;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IOpsAppNotificationRepository
{
  Task<List<OpsAppNotification>> GetByUser(Guid userid);
  Task Create(OpsAppNotification data);
  Task Update(OpsAppNotification data);
  Task Read(Guid id);
  Task Delete(Guid id);
}
