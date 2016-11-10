using BoggleWebService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BoggleWebService.Controllers
{
    public class BoggleController : ApiController
    {
        private Random randomObj = new Random();
        private List<BoggleBox> registeredBoggleBoxes = new List<BoggleBox>();

        [HttpGet]
        [Route("api/boggle/getBoggleBox")]
        public BoggleBox GetBoggleBox()
        {
            BoggleBox newBox = new BoggleBox();
            newBox.BoggleBoxID = Guid.NewGuid();
            newBox.Dies = randomDices();

            //byte[] guidArray = newBox.BoggleBoxID.ToByteArray();

            registeredBoggleBoxes.Add(newBox);
            return newBox;
        }

        [HttpGet]
        [Route("api/boggle/getBoggleBox")]
        public BoggleBox GetBoggleBox(string boggleBoxId)
        {
            BoggleBox foundBox = registeredBoggleBoxes.Find(x => x.BoggleBoxID.ToString() == boggleBoxId);

            if (foundBox != null)
                return foundBox;

            //If unable to find box, generate a new one.
            return GetBoggleBox();
        }


        private List<List<Die>> randomDices()
        {
            int rows = 4;
            int column = 4;
            List<List<Die>> randomList = new List<List<Die>>();


            for (int i = 0; i < rows; i++)
            {
                List<Die> randomColumn = new List<Die>();
                for (int j = 0; j < column; j++)
                {
                    Die randomDie = RandomDie();
                    randomColumn.Add(randomDie);
                }
                randomList.Add(randomColumn);
            }
           


            return randomList;


        }

        private Die RandomDie()
        {
            string randomLettersToChoose = "abcdefghijklmnopqrstuvwxyz";
            int randomIndex = randomObj.Next(randomLettersToChoose.Count());
            Die die = new Die();
            die.Value = randomLettersToChoose[randomIndex].ToString();

            return die;
        }
    }
}
