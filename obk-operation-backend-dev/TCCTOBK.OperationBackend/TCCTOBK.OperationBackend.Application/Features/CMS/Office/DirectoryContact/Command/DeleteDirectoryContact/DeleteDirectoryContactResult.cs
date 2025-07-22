using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteDirectoryContact;

public class DeleteDirectoryContactResult
{
  public List<DirectoryContactModel> Data { get; set; } = new();

}
