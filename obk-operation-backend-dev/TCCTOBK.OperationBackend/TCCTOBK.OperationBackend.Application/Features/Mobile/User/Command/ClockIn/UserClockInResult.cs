using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.ClockIn;


public class UserClockInResult
{
  public int id { get; set; }
  public int DutyShiftId { get; set; }
  public DutyShiftId dutyShift { get; set; }
  public DateTime shiftDate { get; set; }
  public DateTime shiftStart { get; set; }
  public DateTime shiftEnd { get; set; }
  public bool otApplicable { get; set; }
  public int staffId { get; set; }
  public string staffName { get; set; }
  public int functionRoleId { get; set; }
  public string functionRoleName { get; set; }
  public DateTime clockIn { get; set; }
  public bool isLate { get; set; }
}


public class DutyShiftId
{
  public int id { get; set; }
  public string code { get; set; }
  public string name { get; set; }
  public DateTime effectiveStartDate { get; set; }
  public string startTime { get; set; }
  public int durationMin { get; set; }
  public bool otApplicable { get; set; }
  public int locationKey { get; set; }
  public string locationName { get; set; }
  public string colorCode { get; set; }
  public List<Staff> staff { get; set; }
  public List<DutyShiftTask> tasks { get; set; }
  public RepeatConfig repeatConfig { get; set; }
  // "attendance": [
  //   {}
  // ]
}
public class Staff
{
  public int functionRoleId { get; set; }
  public int quantity { get; set; }
}
public class DutyShiftTask
{
  public int seqNo { get; set; }
  public string description { get; set; }
  public int locationId { get; set; }
}
public class RepeatConfig
{
  public string repeatType { get; set; }
  public int frequency { get; set; }
  public DateTime endDate { get; set; }
}