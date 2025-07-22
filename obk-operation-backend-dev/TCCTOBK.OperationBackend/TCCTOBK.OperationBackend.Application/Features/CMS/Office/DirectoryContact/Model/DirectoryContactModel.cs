using System;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

public class DirectoryContactModel
{
  public Guid categoryId { get; set; }
  public string category { get; set; } = default!;
  public List<ContactListModel> contactList { get; set; } = new();

  public string? createdBy { get; set; }
  public DateTime createdAt { get; set; }
  public string? updatedBy { get; set; }
  public DateTime updatedAt { get; set; }
}

public class ContactListModel
{
  public Guid id { get; set; }
  public string phonenumber { get; set; } = default!;
  public string nameEn { get; set; } = default!;
  public string? nameTh { get; set; }
  public string? nameZh { get; set; }
  public string updatedAt { get; set; } = default!;
  public string updatedBy { get; set; } = default!;
  public int seq { get; set; }
}
