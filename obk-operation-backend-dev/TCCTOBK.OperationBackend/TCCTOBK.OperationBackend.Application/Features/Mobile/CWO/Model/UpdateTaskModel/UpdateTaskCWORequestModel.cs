namespace TCCTOBK.OperationBackend.Application;

public class UpdateTaskCWORequestModel
{

  public int id { get; set; }
  public string taskStatus { get; set; }
  public string remarks { get; set; }
  public string reading { get; set; }
  public string updatedBy { get; set; }
  public DateTime updatedOn { get; set; }
}
