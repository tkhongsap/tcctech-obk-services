namespace TCCTOBK.OperationBackend.Application;

public class UpdatePPMRequest
{

  public UpdatePPMRequest(int id, string taskStatus, string remarks, string reading, Guid updatedBy, DateTime updatedOn)
  {
    Id = id;
    TaskStatus = taskStatus;
    Remarks = remarks;
    Reading = reading;
    UpdatedBy = updatedBy;
    UpdatedOn = updatedOn;
  }

  public int Id { get; set; }
  public string TaskStatus { get; set; }
  public string Remarks { get; set; }
  public string Reading { get; set; }
  public Guid UpdatedBy { get; set; }
  public DateTime UpdatedOn { get; set; }
}
