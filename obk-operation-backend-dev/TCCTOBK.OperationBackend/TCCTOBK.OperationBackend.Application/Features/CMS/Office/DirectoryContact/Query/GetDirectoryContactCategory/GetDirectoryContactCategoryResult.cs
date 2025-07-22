using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

public class GetDirectoryContactCategoryResult
{
  public List<DirectoryContactModel> Data { get; set; } = new();
  public int Total => Data.Count();
}
