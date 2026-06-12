namespace API.Services;

public sealed record Result<T>(T? Value, string? Error, ResultErrorType? ErrorType)
{
    public bool IsSuccess => Error is null;

    public static Result<T> Success(T value) => new(value, null, null);

    public static Result<T> ValidationFailure(string error) => new(default, error, ResultErrorType.Validation);

    public static Result<T> NotFound(string error) => new(default, error, ResultErrorType.NotFound);
}

public enum ResultErrorType
{
    Validation,
    NotFound
}
