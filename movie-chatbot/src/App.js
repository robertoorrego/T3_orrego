import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=14ce6d2&t=${input}`);
            const botMessage = {
                text: response.data.Title ? `I found "${response.data.Title}" - ${response.data.Plot}` : 'No movie found!',
                sender: 'bot',
            };
            setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages((prevMessages) => [...prevMessages, userMessage, { text: 'Error fetching data.', sender: 'bot' }]);
        }

        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about a movie..."
                />
                <button type="submit">Send</button>
            </form>
            <div className="instructions-box">
                <h3>Instructions</h3>
                <p>Type the name of a movie you want to know about.</p>
                <p>Example: <strong>The Shawshank Redemption</strong></p>
                <p>Click "Send" to get details about the movie!</p>
            </div>
        </div>
    );
}

export default App;
