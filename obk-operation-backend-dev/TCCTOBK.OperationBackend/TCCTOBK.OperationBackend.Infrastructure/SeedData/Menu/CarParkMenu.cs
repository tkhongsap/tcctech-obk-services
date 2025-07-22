using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Infrastructure.SeedData;

namespace TCCTOBK.OperationBackend.Infrastructure;

public static class CarParkMenu
{
  public static mtMenu Group = new()
  {
    Id = new Guid("cc6f542c-7572-4bc0-b1d7-cedf08b37342"),
    Label = "",
    Type = MenuType.GROUP,
    DisplayOrder = 800
  };

  public static mtMenu CarPark = new()
  {
    Id = new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"),
    Label = "Car park",
    ParentId = Group.Id,
    Header = "Car access activities",
    IconName = "SvgCar",
    Visible = true,
    Type = MenuType.GROUP,
    DisplayOrder = 801,
    PTID = PrivilegeSeedData.CP000.PTID
  };

  public static mtMenu CarAccessActivities = new()
  {
    Id = new Guid("41748bc4-023c-4b1b-adcb-75cdfbdafc27"),
    Label = "Car access activities",
    Header = "Car access activities",
    To = "/car-park/cars-access-activities",
    ParentId = CarPark.Id,
    Breadcrumb = "[\"Car park\"]",
    Visible = true,
    Type = MenuType.LIST,
    DisplayOrder = 802,
    PTID = PrivilegeSeedData.CP001.PTID
  };

  public static mtMenu CarParkStoreWhiteList = new()
  {
    Id = new Guid("bd95848e-8ba4-456e-aec4-84c5dd372084"),
    Label = "Retail Parking: Store Whitelist",
    Header = "Retail Parking: Store Whitelist",
    To = "/car-park/store-whitelists",
    ParentId = CarPark.Id,
    Visible = true,
    Type = MenuType.LIST,
    DisplayOrder = 803,
    PTID = PrivilegeSeedData.CP002.PTID
  };

  public static mtMenu CarParkMallProperty = new()
  {
    Id = new Guid("3e26a38f-abc8-4990-a199-b7f900dd47ba"),
    Label = "Retail Parking: Mall Property",
    Header = "Retail Parking: Mall Property",
    To = "/car-park/property",
    ParentId = CarPark.Id,
    Visible = true,
    Type = MenuType.LIST,
    DisplayOrder = 804,
    PTID = PrivilegeSeedData.CP003.PTID
  };

  public static mtMenu CarParkDocumentType = new()
  {
    Id = new Guid("0ae27072-78c5-425d-96a1-310339284c78"),
    Label = "Retail Parking: Document Type",
    Header = "Retail Parking: Document Type",
    To = "/car-park/document-type",
    ParentId = CarPark.Id,
    Visible = true,
    Type = MenuType.LIST,
    DisplayOrder = 806,
    PTID = PrivilegeSeedData.CP005.PTID
  };

  public static mtMenu CarParCampaign = new()
  {
    Id = new Guid("b7c6eab5-b87f-4d2a-bfba-ed62436f6653"),
    Label = "Retail Parking: Campaign",
    Header = "Retail Parking: Campaign",
    To = "/car-park/campaign-management",
    ParentId = CarPark.Id,
    Visible = true,
    Type = MenuType.LIST,
    DisplayOrder = 807,
    PTID = PrivilegeSeedData.CP006.PTID
  };

  public static mtMenu CarParkSelfRedemption = new()
  {
    Id = new Guid("f83ff9db-e78d-416a-80bd-784bebc7e69a"),
    Label = "Self Redemption Record",
    Header = "Self Redemption Record",
    To = "/car-park/self-redemption-record",
    ParentId = CarPark.Id,
    Visible = true,
    Type = MenuType.LIST,
    DisplayOrder = 808,
    PTID = PrivilegeSeedData.CP007.PTID
  };
  
  public static mtMenu CarParkSelfRedemptionDetail = new()
  {
    Id = new Guid("2dbe5899-6c0a-4065-bcb1-1f0f3593992d"),
    Label = "Self Redemption Detail",
    Header = "Self Redemption Detail",
    To = "/car-park/self-redemption-record/show/[id]",
    ParentId = CarPark.Id,
    Visible = false,
    Type = MenuType.EDIT,
    DisplayOrder = 809,
    PTID = PrivilegeSeedData.CP008.PTID
  };
}
