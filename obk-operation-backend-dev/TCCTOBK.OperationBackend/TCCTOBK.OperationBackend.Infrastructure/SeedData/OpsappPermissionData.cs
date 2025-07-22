using System;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public class OpsappPermissionData
{
  public List<string> FMCSupervisorPermission()
  {
    var res = new List<string>(){
      OpAppConstant.PermissionCode.M001,
      OpAppConstant.PermissionCode.C001,
      OpAppConstant.PermissionCode.C002,
      OpAppConstant.PermissionCode.C003,
      OpAppConstant.PermissionCode.C004,
      OpAppConstant.PermissionCode.C007,
      OpAppConstant.PermissionCode.C008,
      OpAppConstant.PermissionCode.C011,
      OpAppConstant.PermissionCode.C013,
      OpAppConstant.PermissionCode.C014,
      OpAppConstant.PermissionCode.C017,
      OpAppConstant.PermissionCode.P001,
      OpAppConstant.PermissionCode.P002,
      OpAppConstant.PermissionCode.P003,
      OpAppConstant.PermissionCode.P004,
      OpAppConstant.PermissionCode.P005,
      OpAppConstant.PermissionCode.P010,
      OpAppConstant.PermissionCode.P011,
      OpAppConstant.PermissionCode.P012,
    };
    return res;
  }

  public List<string> OUTSOURCEPermission()
  {
    var res = new List<string>(){
      OpAppConstant.PermissionCode.M001,
      OpAppConstant.PermissionCode.C001,
      OpAppConstant.PermissionCode.C003,
      OpAppConstant.PermissionCode.C005,
      OpAppConstant.PermissionCode.C006,
      OpAppConstant.PermissionCode.C009,
      OpAppConstant.PermissionCode.C010,
      OpAppConstant.PermissionCode.C012,
      OpAppConstant.PermissionCode.C015,
      OpAppConstant.PermissionCode.C016,
      OpAppConstant.PermissionCode.C017,
      OpAppConstant.PermissionCode.P001,
      OpAppConstant.PermissionCode.P002,
      OpAppConstant.PermissionCode.P006,
      OpAppConstant.PermissionCode.P007,
      OpAppConstant.PermissionCode.P008,
      OpAppConstant.PermissionCode.P009,
    };
    return res;
  }

  public List<string> GUARDPermission()
  {
    var res = new List<string>()
    {
      OpAppConstant.PermissionCode.G001,
      OpAppConstant.PermissionCode.G002,
      OpAppConstant.PermissionCode.G003,
      OpAppConstant.PermissionCode.G004,
      OpAppConstant.PermissionCode.G005,
      OpAppConstant.PermissionCode.I001,
      OpAppConstant.PermissionCode.I002,
      OpAppConstant.PermissionCode.I003,
    };
    return res;
  }

  public List<string> SOCPermission()
  {
    var res = new List<string>()
    {
      OpAppConstant.PermissionCode.G001,
      OpAppConstant.PermissionCode.G002,
      OpAppConstant.PermissionCode.G003,
      OpAppConstant.PermissionCode.G004,
      OpAppConstant.PermissionCode.G005,
      OpAppConstant.PermissionCode.I001,
      OpAppConstant.PermissionCode.I002,
      OpAppConstant.PermissionCode.I003,
    };
    return res;
  }

  public List<string> DCCPermission()
  {
    var res = new List<string>()
    {
      OpAppConstant.PermissionCode.M001,
      OpAppConstant.PermissionCode.M002,
      OpAppConstant.PermissionCode.M003,
      OpAppConstant.PermissionCode.C001,
      OpAppConstant.PermissionCode.C002,
      OpAppConstant.PermissionCode.C003,
      OpAppConstant.PermissionCode.P001,
      OpAppConstant.PermissionCode.P002,
      OpAppConstant.PermissionCode.G001,
      OpAppConstant.PermissionCode.I001,
      OpAppConstant.PermissionCode.I002,
    };
    return res;
  }

  public List<string> FMCManagerPermission()
  {
    var res = new List<string>(){
      OpAppConstant.PermissionCode.M001,
      OpAppConstant.PermissionCode.C001,
      OpAppConstant.PermissionCode.C002,
      OpAppConstant.PermissionCode.C003,
      OpAppConstant.PermissionCode.P001,
      OpAppConstant.PermissionCode.P002,
    };
    return res;
  }

  public List<string> SOCManager()
  {
    var res = new List<string>(){
      OpAppConstant.PermissionCode.M002,
      OpAppConstant.PermissionCode.M003,
      OpAppConstant.PermissionCode.G001,
      OpAppConstant.PermissionCode.G002,
      OpAppConstant.PermissionCode.I001,
      OpAppConstant.PermissionCode.I002,
    };
    return res;
  }
  public List<string> SuperAdmin()
  {
    var res = new List<string>(){
    OpAppConstant.PermissionCode.M001,
    OpAppConstant.PermissionCode.M002,
    OpAppConstant.PermissionCode.M003,
    OpAppConstant.PermissionCode.C001,
    OpAppConstant.PermissionCode.C002,
    OpAppConstant.PermissionCode.C003,
    OpAppConstant.PermissionCode.C004,
    OpAppConstant.PermissionCode.C005,
    OpAppConstant.PermissionCode.C006,
    OpAppConstant.PermissionCode.C007,
    OpAppConstant.PermissionCode.C008,
    OpAppConstant.PermissionCode.C009,
    OpAppConstant.PermissionCode.C010,
    OpAppConstant.PermissionCode.C011,
    OpAppConstant.PermissionCode.C012,
    OpAppConstant.PermissionCode.C013,
    OpAppConstant.PermissionCode.C014,
    OpAppConstant.PermissionCode.C015,
    OpAppConstant.PermissionCode.C016,
    OpAppConstant.PermissionCode.C017,
    OpAppConstant.PermissionCode.P001,
    OpAppConstant.PermissionCode.P002,
    OpAppConstant.PermissionCode.P003,
    OpAppConstant.PermissionCode.P004,
    OpAppConstant.PermissionCode.P005,
    OpAppConstant.PermissionCode.P006,
    OpAppConstant.PermissionCode.P007,
    OpAppConstant.PermissionCode.P008,
    OpAppConstant.PermissionCode.P009,
    OpAppConstant.PermissionCode.P010,
    OpAppConstant.PermissionCode.P011,
    OpAppConstant.PermissionCode.P012,
    OpAppConstant.PermissionCode.G001,
    OpAppConstant.PermissionCode.G002,
    OpAppConstant.PermissionCode.G003,
    OpAppConstant.PermissionCode.G004,
    OpAppConstant.PermissionCode.G005,
    OpAppConstant.PermissionCode.I001,
    OpAppConstant.PermissionCode.I002,
    OpAppConstant.PermissionCode.I003,
    };
    return res;
  }
}
