using Microsoft.AspNetCore.Mvc;
using EssentionTest.Model;
using Essention.Text;

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
                var cvsText = TextSerializer.SerializeToCvs(value.Text);
                return Ok(cvsText);
            } else if(value.FormatType == "xml")
            {
                var xmlText = TextSerializer.SerializeToXml(value.Text);
                return Ok(xmlText);
            }
            return Ok("format not found");
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello");
        }

       
    }


}
