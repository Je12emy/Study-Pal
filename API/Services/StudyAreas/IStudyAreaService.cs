using API.Contracts.StudyAreas;

namespace API.Services.StudyAreas;

public interface IStudyAreaService
{
    Task<IReadOnlyList<StudyAreaResponse>> ListAsync(CancellationToken cancellationToken);

    Task<Result<StudyAreaResponse>> CreateAsync(CreateStudyAreaRequest request, CancellationToken cancellationToken);

    Task<Result<StudyAreaResponse>> RenameAsync(int id, RenameStudyAreaRequest request, CancellationToken cancellationToken);

    Task<Result<bool>> DeleteAsync(int id, CancellationToken cancellationToken);
}
