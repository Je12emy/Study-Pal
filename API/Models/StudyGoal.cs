namespace API.Models;

public sealed class StudyGoal
{
    public int Id { get; set; }

    public int? StudyAreaId { get; set; }

    public StudyArea? StudyArea { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public StudyPriority Priority { get; set; } = StudyPriority.Medium;

    public StudyGoalStatus Status { get; set; } = StudyGoalStatus.Active;

    public DateOnly? CompletedOn { get; set; }

    public List<StudyTarget> StudyTargets { get; set; } = [];

    public List<StudySession> StudySessions { get; set; } = [];
}
