using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContacts;

public class GetDirectoryContactsQuery : TableState, IQuery<GetDirectoryContactsResult>
{
	public Guid? CategoryId { get; set; }
}
