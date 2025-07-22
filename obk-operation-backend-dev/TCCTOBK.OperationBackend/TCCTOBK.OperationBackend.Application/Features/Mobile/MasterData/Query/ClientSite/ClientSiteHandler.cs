using NPOI.HPSF;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Domain;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetUpdateMozartSupervisorTechnicain;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application;

public class ClientSiteHandler : IQueryHandler<ClientSiteQuery, List<ClientSite>>
{
  private readonly IUnitOfWork _uow;

  public ClientSiteHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<List<ClientSite>> Handle(ClientSiteQuery request, CancellationToken cancellationToken)
  {
    return await _uow.ClientSiteRepository.GetAll(request.SiteName, request.ClientSiteIdList);
  }
}
