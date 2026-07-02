import { TIMERS_QUERIES } from '@/database/queries/timers-queries';
import { Instruction, Timer } from '@/types/recipe.types';
import { randomUUID } from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import strftime from 'strftime';

export function useDatabaseTimers() {
    const db = useSQLiteContext();
    const [recipeTimers, setRecipeTimers] = useState<Timer[]>([]);
    const [allTimers, setAllTimers] = useState<Timer[]>([]);

    const fetchAllTimers = useCallback(async () => {
        try {
            const result: Timer[] = await db.getAllAsync<Timer>(TIMERS_QUERIES.GET_ALL_TIMERS);
            setAllTimers(result);

            /*result.map(e => { 
                console.log("timer = { duration:" + e.duration + " }");
            });*/
        } catch (error) {
            console.error("[db] Failed to fetch recipe timers :", error);
        }
    }, [db]);

    const fetchAllRecipeTimers = useCallback(async (recipeId: string) => {
        try {
            const result: Timer[] = await db.getAllAsync<Timer>(TIMERS_QUERIES.GET_ALL_RECIPE_TIMERS, recipeId);
            setRecipeTimers(result);

            /*result.map(e => { 
                console.log("timer = { duration:" + e.duration + " }");
            });*/
        } catch (error) {
            console.error("[db] Failed to fetch recipe timers :", error);
        }
    }, [db]);

    const createTimer = async (recipeId: string, instruction: Instruction) => {
        try {
            await db.runAsync(TIMERS_QUERIES.INSERT_TIMER, [randomUUID(), recipeId, instruction.id, instruction.timer_duration, strftime('%Y-%m-%dT%H:%M:%SZ')]);
            await fetchAllRecipeTimers(recipeId);
        } catch (error) {
            console.error("[db] Failed to create recipe timers :", error);
        }
    };

    const deleteTimerByInstruction = async (recipeId: string, instructionId: string) => {
        try {
            recipeTimers.map(e => console.log("Timers :" + e.duration));
            const timer = recipeTimers.find(e => e.instruction_id == instructionId);
            if(timer)
            {
                console.log("Delete :" + timer.duration);
                await db.runAsync(TIMERS_QUERIES.DELETE_TIMER, timer.id);
                await fetchAllRecipeTimers(recipeId);
            }
        } catch (error) {
            console.error("[db] Failed to delete recipe timer :", error);
        }
    };

    const deleteTimerById = async (timerId: string) => {
        try {
            await db.runAsync(TIMERS_QUERIES.DELETE_TIMER, timerId);
            await fetchAllTimers();
        } catch (error) {
            console.error("[db] Failed to delete recipe timer :", error);
        }
    };

    const deleteTimerByRecipe = async (recipeId: string) => {
        try {
            for(const timer of allTimers) {
                if(timer.recipe_id === recipeId)
                    await db.runAsync(TIMERS_QUERIES.DELETE_TIMER, timer.id);
            }
            
            await fetchAllTimers();
        } catch (error) {
            console.error("[db] Failed to delete recipe timer :", error);
        }
    };

    const getTimerForInstruction = (instructionId: string) : Timer | undefined => {
        return recipeTimers.find(e => e.instruction_id == instructionId);
    }

    return { recipeTimers, allTimers, getTimerForInstruction, fetchAllTimers, fetchAllRecipeTimers, createTimer, deleteTimerByRecipe, deleteTimerByInstruction, deleteTimerById };
}