using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace Essention.Text
{
    public static class TextSerializer
    {
        private static Text CreateText(string text)
        {
            char[] delimiterSentenceChars = { '.', '?', '!' };
            var sentenses = text.Split(delimiterSentenceChars);

            var sentensesObj = sentenses
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Select((s) => {
                    var pattern = @"\W";
                    var strWords = Regex.Replace(s, pattern, " ").Split(' ');
                   
                    var words = strWords.Where(w => !string.IsNullOrWhiteSpace(w))
                        .OrderBy(w => w)
                        .Select(w => new Word(w));
                    return new Sentence(words);
                });

            return new Text(sentensesObj);
        }

        public static string SerializeToCvs(string inputText, string seperator = ",")
        {
            var text = CreateText(inputText);
            var csvHeaderColCount = text.Sentences.Select(x => x.Words.ToArray().Length).ToArray().Max();
            var currentRow = 0;
            var returnString = "";

            for (var i = 0; i < csvHeaderColCount; ++i)
            {
                returnString = $"{returnString}{seperator}Word {i + 1}";
            }

            foreach (var sentence in text.Sentences)
            {
                var currentColumn = 0;
                var lineString = $"Sentence {++currentRow}";

                foreach (var word in sentence.Words)
                {
                    lineString = $"{lineString}{seperator}{word.Value}";
                    currentColumn++;
                }

                returnString = $"{returnString}{Environment.NewLine}{lineString}";
            }

            return returnString;
        }

        public static XDocument SerializeToXml(string inputText)
        {
            var text = CreateText(inputText);

            var textToXml = new XElement("text",
                text.Sentences
                .Select(s => {
                    return new XElement("sentence", s.Words
                         .Select(w => new XElement("word", w.Value)));
                }));

            XDocument xmlDoc = new XDocument(new XDeclaration("1.0", "UTF-8", "yes"), textToXml);

            return xmlDoc;
        }
    }
}
