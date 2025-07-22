using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDirectoryContacts;

public sealed class GetDirectoryContactsQueryHandler : IQueryHandler<GetDirectoryContactsQuery, GetDirectoryContactsResult>
{
	private readonly IServiceMindResidential _service;
	public GetDirectoryContactsQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetDirectoryContactsResult> Handle(GetDirectoryContactsQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.GetDirectoryContacts(request);
		List<CategoryResult> categoryList = new List<CategoryResult>();
		Dictionary<int, List<CategoryResult>> categoryDic = new Dictionary<int, List<CategoryResult>>();
		Dictionary<int, List<ContactResult>> contactDic = new Dictionary<int, List<ContactResult>>();
		foreach (var contact in res)
		{
			var contacts = new ContactResult{
				id = contact.id,
				name = contact.name,
				phoneNumber = contact.phoneNumber,
				icon = contact.icon
			};
			var category = new CategoryResult{
				id = contact.category.id,
				name = contact.category.name
			};
			if (!categoryDic.ContainsKey(contact.category.id))
			{
				List<ContactResult> listContact = new List<ContactResult>();
				List<CategoryResult> listCategory = new List<CategoryResult>();
				listCategory.Add(category);
				listContact.Add(contacts);
				categoryDic.Add(contact.category.id, listCategory);
				contactDic.Add(contact.category.id, listContact);
				categoryList.Add(category);
			} else {
				List<ContactResult> listContact = contactDic[contact.category.id];
				List<CategoryResult> listCategory = categoryDic[contact.category.id];
				listCategory.Add(category);
				listContact.Add(contacts);
				contactDic[contact.category.id] = listContact;
				categoryDic[contact.category.id] = listCategory;
			}
		}

		foreach (var category in categoryList)
		{
			category.contacts = contactDic[category.id];
		}

		return new GetDirectoryContactsResult{
			data = new GetDirectoryContactsResultData(){
				categories = categoryList
			}
		};
	}
}

