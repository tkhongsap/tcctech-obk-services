using System;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IUsageLogMonitoringRepository
{
    Task<UsageLogMonitoring> GetLastLog();
    Task<UsageLogMonitoring> GetByDate(string date);
    Task<UsageLogMonitoring> CreateUsageMonitoring(UsageLogMonitoring data, DateTime date);
    Task<UsageLogMonitoring> UpdateUsageMonitoring(UsageLogMonitoring data, string date);
}
