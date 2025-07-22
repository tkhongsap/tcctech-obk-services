using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingSpace;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetTrafficStatusRecord;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingQuery;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParking;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParkingStations;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PatchCallMyValetCar;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingDetailByPersonId;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlocker;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlockerList;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.UpdateTransactionCarpark;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.ExtCarpark;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.EntCarpark;
namespace TCCT.ServiceAbstraction.Application.Contracts.MT;
public interface IMTService
{
	Task<List<GetParkingSpaceResult>> GetParkingSpace(GetParkingSpaceCommand data);
	Task<GetTrafficStatusRecordResult> GetTrafficStatusRecord(GetTrafficStatusRecordCommand data);
	Task<GetParkingQueryResult> GetParkingQuery(GetParkingQueryCommand data);
	Task<GetValetParkingResult> GetValetParking(GetValetParkingQuery data);
	Task<List<GetValetParkingStationsResult>> GetValetParkingStations(GetValetParkingStationsQuery data);
	Task<PatchCallMyValetCarResult> PatchCallMyValetCar(PatchCallMyValetCarCommand data);
	Task<GetParkingDetailByPersonIdResult> GetParkingDetailByPersonId(Guid personID, bool lostCard);
	Task<PmsCarBlockerResult> PmsCarBlocker(PmsCarBlockerCommand data);
	Task<List<PmsCarBlockerListResult>> PmsCarBlockerList(PmsCarBlockerListCommand data);
	Task<UpdateTransactionCarparkResult> UpdateTransactionCarpark(UpdateTransactionCarparkCommand data);
	Task<ExtCarparkResult> ExtCarpark(ExtCarparkCommand data);
	Task<EntCarparkResult> EntCarpark(EntCarparkCommand data);
}
