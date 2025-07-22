using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class PPMListHandler : IQueryHandler<PPMListQuery, PPMListResult>
{
	public class StatusCounts
	{
		public int New { get; set; }
		public int Acknowledgement { get; set; }
		public int InProgress { get; set; }
		public int Completed { get; set; }
		public int Closed { get; set; }
		public int Cancelled { get; set; }
		public int Verify { get; set; }
	}
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;
	private IUnitOfWork _uow;
	public PPMListHandler(IAbstractionService apiService, IMasterDataService masterDataService, IUnitOfWork uow)
	{
		_apiService = apiService;
		_masterDataService = masterDataService;
		_uow = uow;
	}

	public async Task<PPMListResult> Handle(PPMListQuery request, CancellationToken cancellationToken)
	{
		var ppmDataQuery = await _uow.PPMRepository.GetAll(null, null, null, null, true, request.UserId, request.Role, request);
		var ppmDataCountQuery = await _uow.PPMRepository.GetAllCount(null, null, null, null, true, request.UserId, request.Role);
		var ppmmaster = await _apiService.CertisTransaction.GetAllPPMWOS();
		var locations = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);
		var serviceCategories = await _masterDataService.GetServiceCategories(_apiService.MasterData.GetServiceCategories);


		int totalItemCount = 0, assignCount = 0;
		var resultCounts = new StatusCounts()
		{
			New = 0,
			Acknowledgement = 0,
			InProgress = 0,
			Completed = 0,
			Closed = 0,
			Cancelled = 0,
			Verify = 0
		};
		totalItemCount = ppmDataCountQuery;

		totalItemCount = ppmDataQuery.Count();


		foreach (var item in ppmDataQuery)
		{
			IncrementStatusCount(item.StatusId!.Value, resultCounts);
		}
		if (request.Status != null)
		{
			ppmDataQuery = ppmDataQuery.Where(x => x.StatusId == request.Status).ToList();
		}
		var ppmData = ppmDataQuery.GroupBy(x => x.LocationId).ToList();
		var results = new List<PPMResult>();

		foreach (var group in ppmData)
		{
			var ppmResult = new PPMResult
			{
				LocationName = locations.FirstOrDefault(loc => loc.id == group.Key)?.fullName,
				Data = group.Select(item =>
				{

					var masterworkorder = ppmmaster.FirstOrDefault(p => p.Id == item.MWOId);
					return new PPMList
					{
						PPMID = item.Id,
						ProblemType = serviceCategories.FirstOrDefault(p => p.Id == item.ServiceCategoryId)?.Name,
						Description = masterworkorder?.Title ?? "-",
						PPMMasterWorkID = masterworkorder?.Name ?? "-",
						PPMWorkId = item.Name,
						Priority = 0,
						Status = item.StatusId.Value,
						Location = locations.FirstOrDefault(l => l.id == item.LocationId)?.name ?? "-",
						FrequencyTypes = item.FrequencyTypeId ?? 0,
						CreatedDate = ConvertToTimeZone(item.CreatedOn!.Value, OpAppConstant.TimeZoneTH),
						FrequencyTypesText = GetFrefencyText(item.FrequencyTypeId ?? 0)
					};
				}).ToList()
			};


			results.Add(ppmResult);
		}

		return new PPMListResult
		{
			Items = totalItemCount,
			NEWItems = resultCounts.New,
			ADDSIGNCOUNT = assignCount,
			ACKNOWLEDGEMENTItems = resultCounts.Acknowledgement,
			INPROGRESSItems = resultCounts.InProgress,
			COMPLETEDItems = resultCounts.Completed,
			CLOSEDItems = resultCounts.Closed,
			CANCELLEDItems = resultCounts.Cancelled,
			VERIFYItem = resultCounts.Verify,
			data = results
		};
	}

	private static void IncrementStatusCount(int statusId, StatusCounts resultCounts)
	{
		switch (statusId)
		{
			case 2:
				resultCounts.New++;
				break;
			case 3:
				resultCounts.Acknowledgement++;
				break;
			case 4:
				resultCounts.InProgress++;
				break;
			case 5:
				resultCounts.Completed++;
				break;
			case 6:
				resultCounts.Closed++;
				break;
			case 7:
				resultCounts.Verify++;
				break;
			case 8:
				resultCounts.Cancelled++;
				break;
		}
	}
	private string GetFrefencyText(int id)
	{
		if (id == 1) return "Daily";
		if (id == 2) return "Weekly";
		if (id == 3) return "Twice-Weekly";
		if (id == 4) return "Two-Weekly";
		if (id == 5) return "Monthly";
		if (id == 6) return "Two-Monthly";
		if (id == 7) return "Quarterly";
		if (id == 8) return "Half-Yearly";
		if (id == 9) return "Yearly";
		return "N/A";
	}
	private static string ConvertToTimeZone(DateTime utcDate, string timeZoneId) =>
			TimeZoneInfo.ConvertTimeFromUtc(utcDate, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId)).ToString(OpAppConstant.TimeFormat);
}
