using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.Asset;

public class AssetHandler : IRequestHandler<AssetQuery, List<AssetResult>>
{
  private readonly IAbstractionService _apiService;

  public AssetHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<List<AssetResult>> Handle(AssetQuery request, CancellationToken cancellationToken)
  {
    var res = new List<AssetResult>();
    var asset = await _apiService.MasterData.GetAllAssets();
    res = asset.Select(x => new AssetResult()
    {
      Id = x.Id,
      Name = x.Name
    }).ToList();
    return res;
  }
}
