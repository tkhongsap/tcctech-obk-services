using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteCategoryDirectoryContact;

public class DeleteCategoryDirectoryContactResult
{
  public List<DirectoryContactModel> Data { get; set; } = new();

}
