using Microsoft.AspNetCore.Mvc;

namespace asimov_gang_api.Contracts
{
    public class MoveForwardRequest
    {
        [FromBody]
        public string CurrentOrientation { get; set; }
    }
}
