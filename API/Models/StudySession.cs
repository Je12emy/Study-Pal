namespace API.Models;

public sealed class StudySession
{
    public int Id { get; set; }

    public int StudyGoalId { get; set; }

    public StudyGoal StudyGoal { get; set; } = null!;

    public DateOnly StudiedOn { get; set; }

    public int DurationMinutes { get; set; }

    public string? LearningNote { get; set; }

    public string? FollowUpQuestions { get; set; }

    public string? FollowUpResponses { get; set; }
}
