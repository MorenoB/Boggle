using System;
using System.Collections.Generic;

namespace BoggleWebService.Models
{
    public class BoggleBox
    {
        public Guid BoggleBoxID { get; set; }
        public List<List<Die>> Dies { get; set; }
    }
}