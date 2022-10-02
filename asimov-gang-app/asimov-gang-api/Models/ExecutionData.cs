using System.ComponentModel.DataAnnotations;

namespace asimov_gang_api.Models
{
    public class ExecutionData
    {
        [Key]
        public int ExecutionId { get; set; }
        public string ExecutionStep { get; set; }
    }
}
