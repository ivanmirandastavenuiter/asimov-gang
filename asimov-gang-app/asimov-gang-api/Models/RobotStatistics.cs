using System.ComponentModel.DataAnnotations;

namespace asimov_gang_api.Models
{
    public class RobotStatistics
    {
        [Key]
        public string Identifier { get; set; }
        public string ExecutionData { get; set; }
    }
}
