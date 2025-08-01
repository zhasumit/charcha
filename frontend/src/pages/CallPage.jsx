import React, { useEffect, useState } from 'react';
import useAuthUser from '../hooks/useAuthUser';
import { getStreamToken } from '../lib/api';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import PageLoader from "../components/PageLoader";
import { customToast } from '../lib/customToast';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
const CallPage = () => {
    const { id: callId } = useParams()
    const [client, setClient] = useState(null)
    const [call, setCall] = useState(null)
    const [isConnecting, setIsConnecting] = useState(true)

    const { authUser, isLoading } = useAuthUser()

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser,
    });

    useEffect(() => {
        const initCall = async () => {
            if (!tokenData?.token || !authUser || !callId) return;
            try {
                // make the instance of the user and the client to make callInstance
                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic,
                };

                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token,
                });

                const callInstance = videoClient.call("default", callId);
                await callInstance.join({ create: true });
                console.log("Joined call successfully");
                customToast.success(`Call Started!!!`);

                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.error("Error joining call:", error);
                customToast.error("Could not join the call. Please try again.");
            } finally {
                setIsConnecting(false);
            }
        };
        initCall();
    }, [tokenData, authUser, callId]);

    if (isLoading || isConnecting) return <PageLoader />;

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-base-200">
            <div className="relative w-full max-w-4xl">
                {client && call ? (
                    <StreamVideo client={client}>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full text-error">
                        <p>Could not initialize call. Please refresh or try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    const navigate = useNavigate();

    if (callingState === CallingState.LEFT) return navigate("/");

    return (
        <StreamTheme>
            <div className="str-chat__container bg-base-100 shadow-lg rounded-lg overflow-hidden">
                <SpeakerLayout />
            </div>
            <CallControls className="bg-base-200 p-4" />
        </StreamTheme>
    );
};

export default CallPage;
