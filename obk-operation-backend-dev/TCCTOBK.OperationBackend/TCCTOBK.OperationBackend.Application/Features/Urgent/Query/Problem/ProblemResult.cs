using System.Text.Json.Serialization;


namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.Problem;

public class ProblemResult
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
}