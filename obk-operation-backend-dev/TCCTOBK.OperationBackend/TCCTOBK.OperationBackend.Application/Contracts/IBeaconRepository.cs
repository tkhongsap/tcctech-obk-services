using System;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IBeaconRepository
{
	Task<List<BeaconModel>> GetBeaconsListAsync();
	Task<BeaconModel> GetBeaconByUUIDAsync(string uuid);
}
