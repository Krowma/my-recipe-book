import { Timer } from "@/types/recipe.types";
import React from "react";
import { StyleProp, TextStyle } from 'react-native';
import { ThemedText } from "../themed-text";

export interface TimerParameters {
    timer: Timer | undefined;
    nowMs: number;
    duration: number;
    style?: StyleProp<TextStyle>;
}

export const TimerText = React.memo(({ timer, duration, nowMs, style }: TimerParameters) => {
    
    const geTimeSeconds = () : number =>  {
        if(!timer)
            return duration * 60;

        const startTimeMs = Date.parse(timer.started_at);
        const elapsedSeconds = Math.max(nowMs - startTimeMs, 0) / 1000;
        return Math.max(0, (timer.duration * 60) - elapsedSeconds);
    }

    const formatTime = (timeInSeconds: number) : string => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');;
        const seconds = Math.floor((timeInSeconds % 60)).toString().padStart(2, '0');
        return hours > 0 ? `${hours}h ${minutes}min ${seconds}s` : `${minutes}min ${seconds}s`;
    }
    
    return (
        <ThemedText style={ style }>{ formatTime(geTimeSeconds()) }</ThemedText>
    );
});

