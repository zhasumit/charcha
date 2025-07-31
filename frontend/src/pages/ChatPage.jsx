import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'

import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import { StreamChat } from 'stream-chat'
import { customToast } from '../lib/customToast'
import ChatLoader from '../components/ChatLoader'
import CallButton from '../components/CallButton'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
    const { id: targetUserId } = useParams()

    const [chatClient, setChatClient] = useState(null)
    const [channel, setChannel] = useState(null)
    const [loading, setLoading] = useState(true)

    const { authUser } = useAuthUser()

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser
    })

    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser) return
            try {
                // Initialize the chat clients (create the instance of the clients)
                const client = StreamChat.getInstance(STREAM_API_KEY);
                // get the current user connected to the clients
                await client.connectUser(
                    {
                        id: authUser._id,
                        name: authUser.fullName,
                        image: authUser.profilePic,
                    },
                    tokenData.token
                );

                // same channel regardless of who creates the channel (so sort it first) (id1-id2) 
                const channelId = [authUser._id, targetUserId].sort().join("-");

                // create a messaging channel fo the user and the target user 
                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId],
                });

                // listen for the incoming changes (watch it)
                await currChannel.watch();
                setChatClient(client);
                setChannel(currChannel);
            } catch (error) {
                console.error("Error initializing chat:", error);
                customToast.error("Could not connect to chat. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        initChat()
    }, [tokenData, authUser, targetUserId])

    const handleVideoCall = () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;
            channel.sendMessage({
                text: `I've started a video call. Join me here: ${callUrl}`,
            });
            customToast.success("Video call link sent!");
        }
    };

    if (loading || !chatClient || !channel) return <ChatLoader />;
    return (
        <div className="h-[93vh]">
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <div className="w-full relative">
                        <CallButton handleVideoCall={handleVideoCall} />
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput focus />
                        </Window>
                    </div>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    )
}

export default ChatPage