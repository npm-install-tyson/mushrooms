import { StyleSheet, TextInput } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";

export default function SearchInput({ colorScheme, text, onChangeText }: any) {
	return (
		<ThemedView>
			<TextInput
				returnKeyType="search"
				inputMode="search"
				style={[
					styles.input,
					colorScheme === "dark"
						? { color: "#ecd7ce", borderColor: "#ecd7ce" }
						: { color: "#784631", borderColor: "#784631" },
				]}
				value={text}
				onChangeText={onChangeText}
				placeholder="Search mushroom"
				keyboardAppearance={"default"}
				inlineImageLeft="search_icon"
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 10,
		borderWidth: 1,
		padding: 10,
		borderRadius: 10,
	},
});
