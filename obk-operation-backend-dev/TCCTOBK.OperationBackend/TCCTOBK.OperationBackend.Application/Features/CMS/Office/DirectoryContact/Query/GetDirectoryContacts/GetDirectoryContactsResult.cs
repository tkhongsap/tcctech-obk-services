using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContacts;

public class GetDirectoryContactsResult
{
	public List<ContactListCategoryModel> Data { get; set; } = new();
	public int TotalRecord { get; set; }
}

public class ContactListCategoryModel : ContactListModel
{
	public Guid categoryId { get; set; }
	public string category { get; set; } = "";
	public ContactListCategoryModel(Guid categoryId, string category, ContactListModel data)
	{
		this.id = data.id;
		this.phonenumber = data.phonenumber;
		this.nameEn = data.nameEn;
		this.nameTh = string.IsNullOrEmpty(data.nameTh) ? "-" : data.nameTh;
		this.nameZh = string.IsNullOrEmpty(data.nameZh) ? "-" : data.nameZh;
		this.updatedAt = data.updatedAt;
		this.updatedBy = data.updatedBy;
		this.seq = data.seq;
		this.categoryId = categoryId;
		this.category = category;
	}
}