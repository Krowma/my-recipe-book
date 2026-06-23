import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useDatabaseFilters } from "@/hooks/use-database-filters";
import { Tag } from '@/types/recipe.types';
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';


interface FilterBarProps {
    selectedTags: Tag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}


export default function FilterBar({ selectedTags, setSelectedTags }: FilterBarProps) {
    const { suggestions, fetchMatchingTags, clearSuggestions } = useDatabaseFilters();

    const [input, setInput] = useState<string>('');

    // Fetch match results dynamically as the user types
    useEffect(() => {
        if (input.trim().length < 1) {
            clearSuggestions();
            return;
        }
        
        fetchMatchingTags(input);
        
        return () => { };
    }, [input]);

    // Action: User clicks a suggestion or presses enter
    const addTag = (tagName: string) => {
        const cleanName = tagName.trim().toLowerCase();
        const matchingTags = suggestions.filter(t => t.name === cleanName);
        if(matchingTags.length > 0)
        {
            const newTag = matchingTags[0];
            const existingTags = selectedTags.filter(t => t.id == newTag.id);
            if (newTag && existingTags.length === 0) {
                setSelectedTags([...selectedTags, newTag]);
            }
        }

        setInput('');
        clearSuggestions();
    };

    return(
        <ThemedView style={styles.filterBarContainer}>
            {/* Input to enter tags */}
            <ThemedView style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Type to search..."
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => addTag(input)}
                />

                {/* Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                    <ThemedView style={styles.dropdown}>
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.name}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.dropdownItem} 
                                    onPress={() => addTag(item.name)}>
                                    <ThemedText type="small">{item.name}</ThemedText>
                                </TouchableOpacity>
                            )}
                        />
                    </ThemedView>
                )}
            </ThemedView>

            {/* Display selected tags */}
            <ThemedView style={styles.filtersContainer}>
                <ThemedText type="default">Filter by :</ThemedText>
                {
                    selectedTags.map((tag, index) => (
                        <ThemedView key={tag.id} style={styles.filterElement}>
                            <ThemedText type="small">{tag.name}</ThemedText>
                            <TouchableOpacity onPress={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>
                                <ThemedText type="small"> ×</ThemedText>
                            </TouchableOpacity>    
                        </ThemedView>
                    ))
                }
            </ThemedView>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    filterBarContainer: {
        flexDirection: "column",
        gap: Spacing.three,
        paddingHorizontal: Spacing.four,
    },
    filtersContainer: {
        flexDirection: "row",
        gap: Spacing.one,
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    filterElement: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingHorizontal: Spacing.two,
        paddingVertical: 6,
        marginRight: Spacing.one,
        marginBottom: Spacing.one,
        alignItems: 'center',
    },

    inputWrapper: {
        zIndex: 10, // Keeps dropdown floating over content below it
        position: 'relative',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    
    dropdown: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});