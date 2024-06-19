import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [languages, setLanguages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('https://text-translator2.p.rapidapi.com/getLanguages', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '88a5caa34bmsh786063c90487b3fp1f931ejsna7b943284bb8',
          'x-rapidapi-host': 'text-translator2.p.rapidapi.com',
        },
      });
      const result = await response.json();
      setLanguages(result.data.languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const translateText = async () => {
    if (from === to) {
      alert('Source and target languages must be different.');
      return;
    }

    try {
      const response = await fetch('https://text-translator2.p.rapidapi.com/translate', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '88a5caa34bmsh786063c90487b3fp1f931ejsna7b943284bb8',
          'x-rapidapi-host': 'text-translator2.p.rapidapi.com',
        },
        body: new URLSearchParams({
          source_language: from,
          target_language: to,
          text: input,
        }),
      });
      const result = await response.json();
      setOutput(result.data.translatedText);
      speakText(result.data.translatedText, to);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = from;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const speakText = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className='translator-container'>
      <div>
        <h1>Hello Translator</h1>
        <div>
          From:
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          To:
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <textarea
          cols='50'
          rows='8'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter text to translate'
        ></textarea>
        <button onClick={startListening}>{isListening ? 'Listening...' : 'Start Speaking'}</button>
      </div>
      <div>
        <textarea cols='50' rows='8' value={output} readOnly placeholder='Translated text'></textarea>
      </div>
      <div className='tran-btn'>
        {to === 'af' ? (
          <button onClick={translateText}>Translate</button>
        ) : (
          <button onClick={translateText}>Translate</button>
        )}
      </div>
    </div>
  );
}

export default App;
                                                                                                                                               