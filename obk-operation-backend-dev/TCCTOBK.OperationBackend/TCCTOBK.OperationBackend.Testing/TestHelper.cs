using Microsoft.EntityFrameworkCore;
using System.Globalization;
using TCCTOBK.OperationBackend.Infrastructure.Database;

namespace TCCTOBK.OperationBackend.Testing;

public class TestHelper
{
	public static void SetupCulture()
	{
		var culture = new CultureInfo("en-Us");
		culture.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";
		culture.DateTimeFormat.LongTimePattern = "HH:mm:ss";
		culture.DateTimeFormat.DateSeparator = "/";
		culture.DateTimeFormat.TimeSeparator = ":";

		culture.NumberFormat.NumberDecimalSeparator = ".";
		culture.NumberFormat.NumberGroupSeparator = ",";
		culture.NumberFormat.CurrencyGroupSeparator = ",";
		culture.NumberFormat.CurrencySymbol = "";
		CultureInfo.DefaultThreadCurrentCulture = culture;
		CultureInfo.DefaultThreadCurrentUICulture = culture;
	}

	public static DbContextOptions<TCCTOBKContext> GetInMemoryDBContextOptions()
	{
		var dbname = $"tcctobk_operation_db_{DateTime.Now.ToFileTimeUtc()}";
		return new DbContextOptionsBuilder<TCCTOBKContext>()
			.UseInMemoryDatabase(dbname)
			.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
			.Options;
	}
}
