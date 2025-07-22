namespace TCCTOBK.OperationBackend.Application.Features.CMS.Menu.Query.GetMenu;

public class GetMenuResult()
{
	public List<MenuItem> Items { get; set; } = new();
}

public class MenuItem
{
	public Guid Id { get; set; }
	public Guid? ParentId { get; set; }
	public string? Label { get; set; }
	public string? Header { get; set; }
	public string? Class { get; set; }
	public string? IconName { get; set; }
	public string? IconClass { get; set; }
	public string? To { get; set; }
	public string? Url { get; set; }
	public bool Separator { get; set; } = false;
	public string? Type { get; set; }
	public List<MenuItem> Items { get; set; } = new();
	public bool Visible { get; set; } = true;
	public bool Disabled { get; set; } = false;
	public bool IsActive { get; set; } = true;
	public string? BreadcrumbData { get; set; }
	public List<Guid> ParentsId { get; set; } = new();

	public bool InsertToParent(Guid parentId, MenuItem child)
	{
		var parentsId = new List<Guid>();
		var item = InsertToParent(this, parentsId, parentId, child);
		return item != null;
	}

	public MenuItem? InsertToParent(MenuItem node, List<Guid> parentsId, Guid parentId, MenuItem child)
	{
		parentsId.Add(node.Id);
		if (node.Id == parentId)
		{
			child.ParentsId = parentsId;
			node.Items.Add(child);
			return node;
		}

		foreach (var item in node.Items)
		{
			var result = InsertToParent(item, parentsId, parentId, child);
			if (result != null)
			{
				return result;
			}
		}

		return null;
	}
}