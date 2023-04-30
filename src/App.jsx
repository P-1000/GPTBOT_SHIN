import { useState } from 'react'
import './App.css'
import ProductList from './Home'
import Header from './Header';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import ChatLogo from './ChatLogo';


const API_KEY = "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";
// chat bot of pretrained model of chatbot of openAI :
const systemMessage = {
  "role": "system", "content": "You are chatbot customer support for online shopping website. Your are not allowed to answer any other questions than the ones related to the online shopping website. website name is \"ShinobiStore\".  if user asks any other question, you should respond with \"I am sorry, I am not allowed to answer that question. Please ask me questions related to ShinobiStore.\" ShinobiStore is an online shopping website for ninja related products. Best Deals on Ninja Weapons, Ninja Gear, Ninja Shirts, Ninja Shoes, Ninja Masks, Ninja Swords, Ninja Wear. Shinobi Store is the best place to buy ninja products online. if user wants to track their order, you should respond with \"Please provide your order number  to track your order. if tracking number less 8 digits give them error message .  these are tracking number {SS209098 ,SS271847 , SS031242 , SS129955 , SS223672 , SS070432 } ,  if the order number matches then say any random status as per previous chat . if tracking number is not found from the number i given then say wrong number or check the number or any use casae message you want to give. if user says order not booked but money is deducted then say \"We are sorry to hear that. Please be patient you will get refund message with in 7 working days mostly in 24hrs . if user says hey then say i can help you with best deal and other queries spread any 5 things you can do and etc  .  use naruto theme for chatbot . and use naruto theme for website too. use naruto reference for chatbot . and use naruto reference for website too. use Naruto references in chat replies. Demon slayer  katanas and tools also available in shinobi store. usually people ask about naruto and demon slayer products. usually delivery time is 2-3 days. if user says i want to buy naruto products then say \"We have naruto products in our website. Please visit our website to buy naruto products.  "
} 

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, How can I help you?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
  

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


  
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage, 
        ...apiMessages 
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  
  const [open, setOpen] = useState(false);
  const chatHandle = () => {
    setOpen(!open)
  }

  return (
    <div className="App">
      <Header />
      <ProductList />
      <div>
      <button 
      onClick={chatHandle}
      >
   {
  
  open ? (
    <ChatLogo />
  ) : (
    <ChatLogo />
  )
   }
      </button>
      </div>
      {
  
  open && (
    <div className='fixed h-[800px] w-[700px] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 transition-all '>
      <MainContainer>
        <ChatContainer className='transition-all duration-300 transform translate-x-full md:translate-x-0'>
          <MessageList 
            scrollBehavior="smooth" 
            typingIndicator={isTyping ? <TypingIndicator content="Shinobi Bot is looking for solution " /> : null}
          >
            {messages.map((message, i) => {
              console.log(message)
              return <Message key={i} model={message} />
            })}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />        
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

    </div>
  )
}

export default App
