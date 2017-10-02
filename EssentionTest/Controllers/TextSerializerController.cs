using Microsoft.AspNetCore.Mvc;
using EssentionTest.Models;
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
            var folder = "App_Data/Files";
            if (value.FormatType == "cvs")
            {
                var formatText = TextSerializer.SerializeToCvs(value.Text, value.SeparatorCvs);

                return Ok(new { formatText });
            }
            else if (value.FormatType == "xml")
            {
                var xmlText = TextSerializer.SerializeToXml(value.Text);

                var formatText = xmlText.Root.ToString();

                return Ok(new { formatText });
            }
            
            return BadRequest();
        }
    }
}
