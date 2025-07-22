namespace TCCTOBK.OperationBackend.Application;

public class FMTechniciansResult
{
  public Guid Id { get; set; }
  public string Email { get; set; }
  public string? Mobile { get; set; }
  public string FullName { get; set; }
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public bool Disabled { get; set; }

}
