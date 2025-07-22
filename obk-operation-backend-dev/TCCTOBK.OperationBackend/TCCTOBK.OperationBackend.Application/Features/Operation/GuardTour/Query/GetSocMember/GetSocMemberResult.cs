using System;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;

public class GetSocMemberResult
{
	public List<SocUser> Data { get; set; }
}

public class SocUser
{
	public Guid Id { get; set; }
	public string Name { get; set; }
	public string? KeyCloakUserId { get; set; }


}
