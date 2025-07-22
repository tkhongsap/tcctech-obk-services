using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceCategory;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.OptionsCWO;

public class OptionsCWOHandler : IQueryHandler<OptionsCWOQuery, OptionsCWOResult>
{
  private readonly IAbstractionService _apiService;

  public OptionsCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<OptionsCWOResult> Handle(OptionsCWOQuery request, CancellationToken cancellationToken)
  {
    var location = await _apiService.MasterData.GetAllLocation();
    var cwotype = await _apiService.MasterData.CWOType();
    var problemtype = await _apiService.MasterData.FMRelatedProblemTypes();
    var servicelocation = new List<FMRelatedServiceCategoryResult>();
    var servicecategory = await _apiService.MasterData.FMRelatedServiceCategories();
    var servicecategorylocation = await _apiService.MasterData.FMRelatedServiceCategoriesServingLocations();
    foreach (var item in servicecategorylocation)
    {
      if (item.LocationId == request.ComponetId)
      {
        var servicedata = servicecategory.FirstOrDefault(x => x.Id == item.ServiceCategoryId);
        if (servicedata != null)
        {
          servicelocation.Add(servicedata);
        }
      }
    }
    var priority = await _apiService.MasterData.FMRelatedPriorities();
    var asset = await _apiService.MasterData.GetAllAssets();
    var requester = await _apiService.MasterData.Requesters();

    var res = new OptionsCWOResult()
    {
      Location = location.Where(x => x.topLocationId == request.ComponetId).Select(x => new DropDownOption() { Value = x.id, Text = x.fullName }).ToList(),
      CWOType = cwotype.Select(x => new DropDownOption() { Value = x.Id, Text = x.Name }).ToList(),
      ProblemType = problemtype.Select(x => new DropDownOption() { Value = x.Id, Text = x.Name }).ToList(),
      ServiceCategory = servicelocation.Select(x => new DropDownOption() { Value = x.Id, Text = x.Name }).ToList(),
      Priority = priority.Select(x => new DropDownOption() { Value = x.Id, Text = x.Name }).ToList(),
      Asset = asset.Select(x => new DropDownOption() { Value = x.Id, Text = x.Name }).ToList(),
      Requester = requester.Select(x => new DropDownOption() { Value = x.Id, Text = x.Name }).ToList(),
    };

    return res;
  }
}
