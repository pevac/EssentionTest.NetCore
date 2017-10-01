using System.Collections.Generic;

namespace Essention.Text
{
    public class Sentence
    {
        public Sentence(IEnumerable<Word> words)
        {
            Words = words;
        }

        public IEnumerable<Word> Words { get; set; }
    }

    public class Word
    {
        public Word(string value)
        {
            Value = value;
        }

        public string Value { get; set; }
    }
}
