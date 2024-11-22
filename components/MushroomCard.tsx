import { Image, Pressable, StyleSheet, TouchableHighlight } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { TabBarIcon } from "./navigation/TabBarIcon";

type ItemProps = {
	id: number;
	image_url: string;
	common_name: string;
	scientific_name: string;
	location: string;
	shortlisted: string;
	shortlistHandler: any;
};

export default function MushroomCard({
	id,
	image_url,
	common_name,
	scientific_name,
	location,
	shortlisted,
	shortlistHandler,
}: ItemProps) {
	return (
		<ThemedView style={styles.listContainer}>
			<Link
				href={{
					pathname: "/details/[id]",
					params: { id },
				}}
			>
				<ThemedView style={styles.list}>
					<ThemedView style={styles.imgContainer}>
						<Image
							source={{
								uri: image_url,
							}}
							style={styles.image}
						/>
					</ThemedView>
					<ThemedView style={styles.contentBox}>
						<ThemedView style={styles.textList}>
							<ThemedView
								style={{ backgroundColor: "transparent" }}
							>
								<ThemedText
									style={{
										fontWeight: "bold",
									}}
								>
									{common_name}
								</ThemedText>
								<ThemedText
									style={{
										fontStyle: "italic",
										fontWeight: "400",
										fontSize: 15,
									}}
								>
									{scientific_name}
								</ThemedText>
							</ThemedView>
							<ThemedView
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									alignContent: "center",
									columnGap: 2,
									backgroundColor: "transparent",
								}}
							>
								<TabBarIcon
									name="location-outline"
									color={"#d50630"}
									size={20}
								/>
								<ThemedText
									style={{
										fontSize: 14,
									}}
								>
									{location}
								</ThemedText>
							</ThemedView>
						</ThemedView>
					</ThemedView>
				</ThemedView>
			</Link>
			<Pressable
				style={styles.shortlist}
				onPress={() => shortlistHandler(id)}
			>
				<TabBarIcon
					name={
						shortlisted === "true" ? "bookmark" : "bookmark-outline"
					}
					color={"#d50630"}
					size={25}
				/>
			</Pressable>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	listContainer: {
		display: "flex",
		flexDirection: "row",
		position: "relative",
	},
	list: {
		flexDirection: "row",
		columnGap: 15,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: "transparent",
	},
	imgContainer: { backgroundColor: "transparent" },
	image: { width: 100, height: 100, borderRadius: 10 },
	contentBox: {
		display: "flex",
		flexDirection: "row",
		columnGap: 15,
		backgroundColor: "transparent",
	},
	textList: {
		display: "flex",
		paddingVertical: 5,
		justifyContent: "space-between",
		backgroundColor: "transparent",
	},
	shortlist: {
		paddingHorizontal: 10,
		paddingVertical: 15,
		position: "absolute",
		right: 0,
	},
});
