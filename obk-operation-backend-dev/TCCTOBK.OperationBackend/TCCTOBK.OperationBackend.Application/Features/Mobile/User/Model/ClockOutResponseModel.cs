using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Model;

public class ClockOutResponseModel
{
  public int id { get; set; }
  public int dutyShiftId { get; set; }
  public DateTime shiftDate { get; set; }
  public DateTime shiftStart { get; set; }
  public DateTime shiftEnd { get; set; }
  public bool otApplicable { get; set; }
  public int staffId { get; set; }
  public string staffName { get; set; }
  public int functionRoleId { get; set; }
  public string functionRoleName { get; set; }
  public DateTime clockIn { get; set; }
  public DateTime clockOut { get; set; }
  public bool isLate { get; set; }
}
