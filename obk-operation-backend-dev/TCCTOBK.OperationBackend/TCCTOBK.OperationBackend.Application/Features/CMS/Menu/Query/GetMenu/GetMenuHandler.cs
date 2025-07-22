using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Menu.Query.GetMenu;
internal class GetMenuHandler : IQueryHandler<GetMenuQuery, GetMenuResult>
{
	private readonly IUnitOfWork _uow;
	private readonly IClientSiteService _clientSiteService;

	public GetMenuHandler(IUnitOfWork uow, IClientSiteService clientSiteService)
	{
		_uow = uow;
		_clientSiteService = clientSiteService;

	}

	public async Task<GetMenuResult> Handle(GetMenuQuery request, CancellationToken cancellationToken)
	{
		var result = await _uow.MenuRepository.GetMenuByRole(request.KeyCloakUserId, _clientSiteService.ClientSiteId);
		var menuItems = result.Select(x => new MenuItem
		{
			Id = x.Id,
			ParentId = x.ParentId,
			Label = x.Label,
			Header = x.Header,
			Class = x.Class,
			IconName = x.IconName,
			IconClass = x.IconClass,
			To = x.To,
			Url = x.Url,
			Separator = x.Separator,
			Type = x.Type,
			Visible = x.Visible,
			Disabled = x.Disabled,
			IsActive = x.IsActive,
			BreadcrumbData = x.Breadcrumb,
		}).ToList();
		var items = new List<MenuItem>(menuItems.Where(x => x.ParentId == null));
		foreach (var item in menuItems)
		{
			if (item.ParentId == null)
			{
				continue;
			}

			for (int j = 0; j < items.Count; j++)
			{
				if (items[j].InsertToParent(item.ParentId!.Value, item))
				{
					break;
				}
			}
		}

		return new GetMenuResult
		{
			Items = items.ToList(),
		};
	}
}
