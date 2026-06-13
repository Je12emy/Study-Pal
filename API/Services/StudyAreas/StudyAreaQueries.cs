using API.Contracts.StudyAreas;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services.StudyAreas;

public static class StudyAreaQueries
{
    public static async Task<IReadOnlyList<StudyAreaResponse>> ListAsync(
        StudyPalDbContext dbContext,
        CancellationToken cancellationToken)
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

    public static Task<bool> NameExistsAsync(
        StudyPalDbContext dbContext,
        string name,
        int? excludedId,
        CancellationToken cancellationToken)
    {
        return dbContext.StudyAreas.AnyAsync(
            studyArea => studyArea.Name == name && studyArea.Id != excludedId,
            cancellationToken);
    }

    public static Task<StudyArea?> GetByIdAsync(
        StudyPalDbContext dbContext,
        int id,
        CancellationToken cancellationToken)
    {
        return dbContext.StudyAreas.SingleOrDefaultAsync(
            studyArea => studyArea.Id == id,
            cancellationToken);
    }

    public static Task<StudyArea?> GetByIdWithGoalsAsync(
        StudyPalDbContext dbContext,
        int id,
        CancellationToken cancellationToken)
    {
        return dbContext.StudyAreas
            .Include(studyArea => studyArea.StudyGoals)
            .SingleOrDefaultAsync(studyArea => studyArea.Id == id, cancellationToken);
    }
}
