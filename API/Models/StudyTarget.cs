namespace API.Models;

public sealed class StudyTarget
{
    public int Id { get; set; }

    public int StudyGoalId { get; set; }

    public StudyGoal StudyGoal { get; set; } = null!;

    public StudyTargetType Type { get; set; }

    public int Value { get; set; }
}
