using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Core;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command;

public class UpdateRoleOpsAppCommand : IRequest<UpdateRoleOpsAppResult>
{
	public Guid UserId { get; set; } = default!;
	public int? StaffId { get; set; } = default!;
	public List<Guid> Role { get; set; } = new();

	public Guid? UpdatedBy { get; set; } = null;
	public string? UpdatedByName { get; set; } = null;

	public List<CreateFunctionRolesLocation>? FunctionRoleLocations { get; set; } = default!;
}