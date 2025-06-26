import {useState} from "react";

const chats_example = {
    chats: [
        {
            id: "1",
            user: {
                name: "Fabio Betancourt",
                phone_number: "573003044493"
            },
            messages: [
                {
                    id: "0",
                    body: "Hola",
                    time: "",
                    owner: true
                },
                {
                    id: "1",
                    body: "Como Estas?",
                    time: "",
                    owner: true
                }
            ]
        },
        {
            id: "2",
            user: {
                name: "Gabriela Farfan",
                phone_number: "573005248072"
            },
            messages: [
                {
                    id: "0",
                    body: "Hola",
                    time: "",
                    owner: true
                },
                {
                    id: "1",
                    body: "Hola",
                    time: "",
                    owner: false
                }
            ]
        }
    ]
}

export default function Chats() {

    const [chats, setChats] = useState(chats_example.chats);
    const [currentChat, setCurrentChat] = useState({});

    function loadChat(chatId) {
        let chat = chats.find(chat => chat.id === chatId);
        setCurrentChat(chat);
    }

    return (

        <div className="relative top-0 bottom-0 left-0 right-0 h-screen flex flex-col justify-stretch fixed w-full">
            <main className={'flex h-full w-full'}>
                <div className={'flex h-full w-full'}>
                    <div className="sidebar relative h-full w-full lg:w-1/2 flex flex-col justify-between">
                        <div className="options p-4 order-1 border-b-2 border-green-800 font-bold text-green-800">
                            <span className="flex items-center justify-start h-[40px]">Conversaciones</span>
                        </div>
                        <div className="chats h-full overflow-y-auto order-2">

                            {chats.map((chat) => (
                                <a
                                    key={"chat_" + chat.id}
                                    onClick={() => loadChat(chat.id)}
                                >
                                    <div className={`chats-item flex p-4 hover:bg-gray-100 hover:cursor-pointer ${chat.id === currentChat.id && 'bg-gray-200'}`}>
                                        <div className="picture pr-4">
                                    <span
                                        className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full"></span>
                                        </div>
                                        <div className="name flex items-center">{chat.user.name}</div>
                                    </div>
                                </a>
                            ))}

                        </div>
                        <div className="options p-4 order-3 border-t-2 border-green-800">
                            <span className="flex items-center justify-start h-[40px]">Version 1.0</span>
                        </div>
                    </div>
                    <div
                        className="viewer bg-gray-200 h-full w-full border-l-2 border-green-800 flex flex-col justify-between">
                        <div className="chat p-4 h-max overflow-y-auto grid justify-items-stretch">
                            {currentChat?.messages?.map((message) => (
                                <div
                                    key={"message_" + message.id}
                                    className={`message bg-white inline-flex px-4 py-1 mb-2 rounded-md ${message.owner ? 'justify-self-end' : 'justify-self-start'}`}>{message.body}</div>
                            ))}
                        </div>
                        <div className="message p-4 bg-gray-100 border-t-2 border-green-800">
                            <form>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-9">
                                        <input type="text" className="bg-white w-full px-4 py-2"/>
                                    </div>
                                    <div className="col-span-3">
                                        <input type="submit" value="Enviar"
                                               className='bg-red-400 px-4 py-2 w-full text-white'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}