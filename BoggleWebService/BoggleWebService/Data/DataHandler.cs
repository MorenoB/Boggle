using BoggleWebService.Data;
using BoggleWebService.Models;
using System.Collections.Generic;
using System.IO;
using System.Web;

namespace BoggleWebService.App_Start
{
    public class DataHandler : Singleton<DataHandler>
    {
        public List<string> WordList
        {
            get
            {
                if (wordList != null && wordList.Count > 0)
                    return wordList;

                PopulateWordList();

                return wordList;
            }
        }

        public List<BoggleBox> RegisteredBoggleBoxes
        {
            get
            {
                return registeredBoggleBoxes;
            }
        }

        private List<BoggleBox> registeredBoggleBoxes = new List<BoggleBox>();
        private List<string> wordList = new List<string>();

        public void PopulateWordList()
        {

            string f = HttpContext.Current.Server.MapPath("~/Data/lower.lst");


            using (StreamReader r = new StreamReader(f))
            {
                string line;
                while ((line = r.ReadLine()) != null)
                {
                    wordList.Add(line);
                }
            }
        }
    }
}