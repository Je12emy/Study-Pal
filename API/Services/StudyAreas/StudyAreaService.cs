using API.Contracts.StudyAreas;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services.StudyAreas;

public sealed class StudyAreaService(StudyPalDbContext dbContext) : IStudyAreaService
{
    public async Task<IReadOnlyList<StudyAreaResponse>> ListAsync(CancellationToken cancellationToken)
    {
        return await dbContext.StudyAreas
            .AsNoTracking()
            .OrderBy(studyArea => studyArea.Name)
            .Select(studyArea => new StudyAreaResponse(
                studyArea.Id,
                studyArea.Name,
                studyArea.StudyGoals.Count))
            .ToListAsync(cancellationToken);
    }

    public async Task<Result<StudyAreaResponse>> CreateAsync(
        CreateStudyAreaRequest request,
        CancellationToken cancellationToken)
    {
        var normalizedName = NormalizeName(request.Name);
        if (normalizedName is null)
        {
            return Result<StudyAreaResponse>.ValidationFailure("Study Area name is required.");
        }

        if (await NameExistsAsync(normalizedName, excludedId: null, cancellationToken))
        {
            return Result<StudyAreaResponse>.ValidationFailure("A Study Area with this name already exists.");
        }

        var studyArea = new StudyArea { Name = normalizedName };
        dbContext.StudyAreas.Add(studyArea);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result<StudyAreaResponse>.Success(ToResponse(studyArea, studyGoalCount: 0));
    }

    public async Task<Result<StudyAreaResponse>> RenameAsync(
        int id,
        RenameStudyAreaRequest request,
        CancellationToken cancellationToken)
    {
        var normalizedName = NormalizeName(request.Name);
        if (normalizedName is null)
        {
            return Result<StudyAreaResponse>.ValidationFailure("Study Area name is required.");
        }

        var studyArea = await dbContext.StudyAreas
            .Include(area => area.StudyGoals)
            .SingleOrDefaultAsync(area => area.Id == id, cancellationToken);
        if (studyArea is null)
        {
            return Result<StudyAreaResponse>.NotFound("Study Area was not found.");
        }

        if (await NameExistsAsync(normalizedName, id, cancellationToken))
        {
            return Result<StudyAreaResponse>.ValidationFailure("A Study Area with this name already exists.");
        }

        studyArea.Name = normalizedName;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result<StudyAreaResponse>.Success(ToResponse(studyArea, studyArea.StudyGoals.Count));
    }

    public async Task<Result<bool>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var studyArea = await dbContext.StudyAreas
            .SingleOrDefaultAsync(area => area.Id == id, cancellationToken);
        if (studyArea is null)
        {
            return Result<bool>.NotFound("Study Area was not found.");
        }

        dbContext.StudyAreas.Remove(studyArea);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }

    private async Task<bool> NameExistsAsync(string name, int? excludedId, CancellationToken cancellationToken)
    {
        return await dbContext.StudyAreas
            .AnyAsync(studyArea => studyArea.Name == name && studyArea.Id != excludedId, cancellationToken);
    }

    private static string? NormalizeName(string name)
    {
        var normalizedName = name.Trim();
        return normalizedName.Length == 0 ? null : normalizedName;
    }

    private static StudyAreaResponse ToResponse(StudyArea studyArea, int studyGoalCount)
    {
        return new StudyAreaResponse(studyArea.Id, studyArea.Name, studyGoalCount);
    }
}
