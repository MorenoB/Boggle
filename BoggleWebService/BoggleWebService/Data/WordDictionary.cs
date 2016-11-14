using BoggleWebService.Data;
using System.Collections.Generic;
using System.IO;
using System.Web;

namespace BoggleWebService.App_Start
{
    public class WordDictionary : Singleton<WordDictionary>
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