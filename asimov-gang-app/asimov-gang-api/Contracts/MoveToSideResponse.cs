using FluentValidation.Results;

namespace asimov_gang_api.Contracts
{
    public class MoveToSideResponse
    {
        public string NewOrientation { get; set; }
        public IList<ValidationFailure> Errors { get; set; }
    }
}
