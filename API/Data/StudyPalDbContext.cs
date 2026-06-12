using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public sealed class StudyPalDbContext(DbContextOptions<StudyPalDbContext> options) : DbContext(options)
{
    public DbSet<StudyArea> StudyAreas => Set<StudyArea>();

    public DbSet<StudyGoal> StudyGoals => Set<StudyGoal>();

    public DbSet<StudyTarget> StudyTargets => Set<StudyTarget>();

    public DbSet<StudySession> StudySessions => Set<StudySession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StudyArea>(entity =>
        {
            entity.Property(studyArea => studyArea.Name)
                .HasMaxLength(200)
                .UseCollation("NOCASE")
                .IsRequired();

            entity.HasIndex(studyArea => studyArea.Name)
                .IsUnique();
        });

        modelBuilder.Entity<StudyGoal>(entity =>
        {
            entity.Property(studyGoal => studyGoal.Name)
                .HasMaxLength(200)
                .UseCollation("NOCASE")
                .IsRequired();

            entity.Property(studyGoal => studyGoal.Description)
                .HasMaxLength(4000);

            entity.Property(studyGoal => studyGoal.Priority)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(studyGoal => studyGoal.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.HasIndex(studyGoal => studyGoal.Name)
                .IsUnique();

            entity.HasOne(studyGoal => studyGoal.StudyArea)
                .WithMany(studyArea => studyArea.StudyGoals)
                .HasForeignKey(studyGoal => studyGoal.StudyAreaId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<StudyTarget>(entity =>
        {
            entity.ToTable(table =>
            {
                table.HasCheckConstraint("CK_StudyTargets_Value_Positive", "Value > 0");
            });

            entity.Property(studyTarget => studyTarget.Type)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.HasIndex(studyTarget => new { studyTarget.StudyGoalId, studyTarget.Type })
                .IsUnique();

            entity.HasOne(studyTarget => studyTarget.StudyGoal)
                .WithMany(studyGoal => studyGoal.StudyTargets)
                .HasForeignKey(studyTarget => studyTarget.StudyGoalId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StudySession>(entity =>
        {
            entity.ToTable(table =>
            {
                table.HasCheckConstraint("CK_StudySessions_DurationMinutes_Positive", "DurationMinutes > 0");
            });

            entity.Property(studySession => studySession.LearningNote)
                .HasMaxLength(4000);

            entity.Property(studySession => studySession.FollowUpQuestions)
                .HasMaxLength(4000);

            entity.Property(studySession => studySession.FollowUpResponses)
                .HasMaxLength(4000);

            entity.HasOne(studySession => studySession.StudyGoal)
                .WithMany(studyGoal => studyGoal.StudySessions)
                .HasForeignKey(studySession => studySession.StudyGoalId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
