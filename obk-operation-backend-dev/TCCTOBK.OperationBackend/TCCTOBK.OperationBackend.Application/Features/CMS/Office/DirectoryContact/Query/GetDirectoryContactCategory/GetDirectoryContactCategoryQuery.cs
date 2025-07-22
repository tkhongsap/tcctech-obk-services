using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;

public class GetDirectoryContactCategoryQuery : TableState, IQuery<GetDirectoryContactCategoryResult>
{
  public Guid? CategoryId { get; set; }

  public GetDirectoryContactCategoryQuery(Guid? categoryId)
  {
    CategoryId = categoryId;
  }
}
