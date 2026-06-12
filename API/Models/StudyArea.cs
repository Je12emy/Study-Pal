namespace API.Models;

public sealed class StudyArea
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public List<StudyGoal> StudyGoals { get; set; } = [];
}
