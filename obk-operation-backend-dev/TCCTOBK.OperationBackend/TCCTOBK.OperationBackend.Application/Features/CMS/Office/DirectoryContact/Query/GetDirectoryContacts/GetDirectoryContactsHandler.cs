using System.Text.Json;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContacts;

public class GetDirectoryContactsHandler : IQueryHandler<GetDirectoryContactsQuery, GetDirectoryContactsResult>
{
	private readonly IMediator _mediator;

	public GetDirectoryContactsHandler(IMediator mediator)
	{
		_mediator = mediator;
	}

	public async Task<GetDirectoryContactsResult> Handle(GetDirectoryContactsQuery request, CancellationToken cancellationToken)
	{
		var getremoteconfigquery = new GetRemoteConfigDataQuery();
		var getremoteconfigresult = await _mediator.Send(getremoteconfigquery);
		if (!getremoteconfigresult.IsSuccess)
		{
			return new GetDirectoryContactsResult();
		}
		using (JsonDocument doc = JsonDocument.Parse(getremoteconfigresult.data))
		{
			JsonElement valueElement = doc.RootElement
				.GetProperty("parameters")
				.GetProperty("directory_contact")
				.GetProperty("defaultValue")
				.GetProperty("value");
			if (valueElement.GetString() is null)
				return new GetDirectoryContactsResult();
			string unescapedJsonString = valueElement.GetString()!.Replace("\\\"", "\"").Replace("\\\\", "\\");
			var contactsCategory = JsonSerializer.Deserialize<List<DirectoryContactModel>>(unescapedJsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<DirectoryContactModel>();
			if (request.CategoryId != null)
			{
				contactsCategory = contactsCategory.Where(x => x.categoryId == request.CategoryId).ToList();
			}
			var contacts = contactsCategory.SelectMany(x => x.contactList.Select(c => new ContactListCategoryModel(x.categoryId, x.category, c))).ToList();
			if (!string.IsNullOrEmpty(request.SortField))
			{
				switch (request.SortField)
				{
					case "nameEn":
						contacts = request.SortOrder == -1 ? contacts.OrderByDescending(x => x.nameEn.ToLower()).ToList() : contacts.OrderBy(x => x.nameEn.ToLower()).ToList();
						break;
					case "nameTh":
						contacts = request.SortOrder == -1 ? contacts.OrderByDescending(x => x.nameTh?.ToLower()).ToList() : contacts.OrderBy(x => x.nameTh?.ToLower()).ToList();
						break;
					case "nameZh":
						contacts = request.SortOrder == -1 ? contacts.OrderByDescending(x => x.nameZh?.ToLower()).ToList() : contacts.OrderBy(x => x.nameZh?.ToLower()).ToList();
						break;
					case "updatedAt":
						contacts = request.SortOrder == -1 ? contacts.OrderByDescending(x => DateTime.Parse(x.updatedAt)).ToList() : contacts.OrderBy(x => DateTime.Parse(x.updatedAt)).ToList();
						break;
					case "updatedBy":
						contacts = request.SortOrder == -1 ? contacts.OrderByDescending(x => x.updatedBy).ToList() : contacts.OrderBy(x => x.updatedBy).ToList();
						break;
					case "category":
						contacts = request.SortOrder == -1 ? contacts.OrderByDescending(x => x.category.ToLower()).ToList() : contacts.OrderBy(x => x.category.ToLower()).ToList();
						break;
				}
			}
			var result = contacts.Skip(request.First).Take(request.Take).ToList();
			return new GetDirectoryContactsResult() { Data = result, TotalRecord = contacts.Count };
		}
	}
}
