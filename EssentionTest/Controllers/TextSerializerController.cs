using Microsoft.AspNetCore.Mvc;
using EssentionTest.Model;
using Essention.Text;
using System.Xml;
using System.IO;
using System;

namespace EssentionTest.Controllers
{
    [Route("api/[controller]")]
    public class TextSerializerController : Controller
    {

        [HttpPost()]
        public IActionResult SerializerText([FromBody]TextToSerializer value)
        {
            if (value.FormatType == "cvs")
            {
                var cvsText = TextSerializer.SerializeToCvs(value.Text, value.SeparatorCvs);
                Directory.CreateDirectory("Files");
                using (var fileStream = new FileStream($"Files/cvsFile{(DateTime.Now - new DateTime()).Ticks}.cvs", FileMode.OpenOrCreate, FileAccess.Write, FileShare.None))
                {
                    using(var streamWriter = new StreamWriter(fileStream))
                    {
                        streamWriter.Write(cvsText);
                    }
                }

                return Ok(cvsText);
            }
            else if (value.FormatType == "xml")
            {
                var xmlText = TextSerializer.SerializeToXml(value.Text);

                Directory.CreateDirectory("Files");
                xmlText.Save($"Files/xmlFile{(DateTime.Now - new DateTime()).Ticks}.xml");

                return Ok(xmlText.Root);
            }
            
            return NoContent();
        }
       
    }


}
