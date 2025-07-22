using System;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IClientSiteRepository
{
  Task<ClientSite> GetClientSiteById(Guid csid);
  Task<ClientMember> GetClientMemberByMID(Guid mid, Guid csid);
  Task<List<ClientSite>> GetAll(string? name, List<Guid>? csidList);
  Task<int> GetAllCount(string? clientName, List<Guid>? csidList);
  Task<List<ClientSite>> GetClientSiteByMID(Guid mid);
}
