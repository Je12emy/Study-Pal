using API.Contracts.StudyAreas;
using API.Services;
using API.Services.StudyAreas;

namespace API.Endpoints;

public static class StudyAreaEndpoints
{
    public static RouteGroupBuilder MapStudyAreaEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/study-areas")
            .WithTags("Study Areas");

        group.MapGet("/", async (IStudyAreaService service, CancellationToken cancellationToken) =>
            Results.Ok(await service.ListAsync(cancellationToken)))
            .WithName("ListStudyAreas");

        group.MapPost("/", async (
            CreateStudyAreaRequest request,
            IStudyAreaService service,
            CancellationToken cancellationToken) =>
        {
            var result = await service.CreateAsync(request, cancellationToken);

            return result.IsSuccess
                ? Results.Created($"/study-areas/{result.Value!.Id}", result.Value)
                : Results.BadRequest(new { result.Error });
        })
        .WithName("CreateStudyArea");

        group.MapPut("/{id:int}", async (
            int id,
            RenameStudyAreaRequest request,
            IStudyAreaService service,
            CancellationToken cancellationToken) =>
        {
            var result = await service.RenameAsync(id, request, cancellationToken);

            return ToHttpResult(result, Results.Ok);
        })
        .WithName("RenameStudyArea");

        group.MapDelete("/{id:int}", async (
            int id,
            IStudyAreaService service,
            CancellationToken cancellationToken) =>
        {
            var result = await service.DeleteAsync(id, cancellationToken);

            return result.IsSuccess
                ? Results.NoContent()
                : ToProblemResult(result);
        })
        .WithName("DeleteStudyArea");

        return group;
    }

    private static IResult ToHttpResult<T>(Result<T> result, Func<T, IResult> onSuccess)
    {
        return result.IsSuccess ? onSuccess(result.Value!) : ToProblemResult(result);
    }

    private static IResult ToProblemResult<T>(Result<T> result)
    {
        var error = new { result.Error };

        return result.ErrorType switch
        {
            ResultErrorType.NotFound => Results.NotFound(error),
            _ => Results.BadRequest(error)
        };
    }
}
