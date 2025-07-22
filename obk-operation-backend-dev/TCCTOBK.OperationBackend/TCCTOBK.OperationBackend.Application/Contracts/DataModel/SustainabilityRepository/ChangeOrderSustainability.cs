namespace TCCTOBK.OperationBackend.Application;

public class ChangeOrderSustainability
{
	public Guid Id { get; set; }
	public int Type { get; set; }
	public int NewOrder { get; set; }

	public ChangeOrderSustainability(Guid id , int type, int newOrder)
	{
		Type = type;
		NewOrder = newOrder;
		Id = id;
	}
}
