import {
	Image,
	RefreshControl,
	ScrollView,
	StyleSheet,
	useColorScheme,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useSQLiteContext } from "expo-sqlite";

const index = () => {
	const db = useSQLiteContext();

	type dbProps = {
		m_id: number;
		common_name: string;
		scientific_name: string;
		species: string;
		description: string;
		habitat: string;
		edibility: string;
		location: string;
		image_url: string;
		shortlisted: string;
	};

	const { id } = useLocalSearchParams();

	const [mushroom, setMushroom] = useState<dbProps>();

	const fetchData = useCallback(async () => {
		const data: any = await db.getFirstAsync(
			`SELECT * FROM mushrooms WHERE m_id = ${id}`
		);

		setMushroom(data);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const colorSchrme = useColorScheme();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			style={[
				styles.container,
				{
					// Try setting `flexDirection` to `"row"`.
					flexDirection: "column",
				},
			]}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			{mushroom && (
				<>
					<ThemedView>
						<Image
							source={{
								uri: mushroom.image_url,
							}}
							style={styles.image}
						/>
					</ThemedView>
					<ThemedView style={styles.content}>
						<ThemedView style={styles.inlineContent}>
							<ThemedView
								style={{
									display: "flex",
									flexDirection: "row",
								}}
							>
								<ThemedText style={{ fontWeight: "bold" }}>
									{mushroom.common_name}
								</ThemedText>
								<ThemedText
									style={{ fontSize: 12, fontWeight: "300" }}
								>
									, a species of
								</ThemedText>
								<ThemedText
									style={{
										fontStyle: "italic",
										fontSize: 14,
									}}
								>
									&nbsp;{mushroom.species}
								</ThemedText>
							</ThemedView>
							<ThemedView
								style={{
									display: "flex",
									flexDirection: "row",
								}}
							>
								<ThemedText
									style={{ fontWeight: "300", fontSize: 14 }}
								>
									Habitat:
								</ThemedText>
								<ThemedText
									style={{
										fontStyle: "italic",
										fontSize: 14,
									}}
								>
									&nbsp;{mushroom.habitat}
								</ThemedText>
							</ThemedView>
							<ThemedView
								style={{
									display: "flex",
									flexDirection: "row",
								}}
							>
								<ThemedText
									style={{ fontWeight: "300", fontSize: 14 }}
								>
									Scientific name:
								</ThemedText>
								<ThemedText
									style={{
										fontStyle: "italic",
										fontSize: 14,
									}}
								>
									&nbsp;{mushroom.scientific_name}
								</ThemedText>
							</ThemedView>
						</ThemedView>
						<ThemedView
							style={[
								styles.gap,
								{
									backgroundColor:
										colorSchrme === "dark"
											? "#0a0a0a"
											: "#e1cdc2",
								},
							]}
						></ThemedView>
						<ThemedView style={styles.descriptionBox}>
							<ThemedView style={styles.descriptionTitle}>
								<TabBarIcon
									name={
										mushroom.edibility.toLowerCase() ===
										"edible"
											? "restaurant-outline"
											: mushroom.edibility.toLowerCase() ===
											  "choice edible"
											? "restaurant-outline"
											: mushroom.edibility
													.toLowerCase()
													.includes("toxic")
											? "skull-outline"
											: "warning-outline"
									}
									color={"#d50630"}
									size={25}
								/>
								<ThemedText
									style={{
										fontWeight: "bold",
									}}
								>
									{mushroom.edibility}
								</ThemedText>
							</ThemedView>
							<ThemedView>
								<ThemedText style={{ fontSize: 14 }}>
									{mushroom.description}
								</ThemedText>
							</ThemedView>
						</ThemedView>
						<ThemedView
							style={[
								styles.gap,
								{
									backgroundColor:
										colorSchrme === "dark"
											? "#0a0a0a"
											: "#e1cdc2",
								},
							]}
						></ThemedView>
					</ThemedView>
				</>
			)}
		</ScrollView>
	);
};

export default index;

const styles = StyleSheet.create({
	container: {
		display: "flex",
	},
	image: { width: "100%", height: 250 },
	content: {
		borderTopRightRadius: 15,
		borderTopLeftRadius: 15,
		marginTop: -30,
		display: "flex",
		flexDirection: "column",
		rowGap: 20,
	},
	inlineContent: {
		marginTop: 20,
		marginHorizontal: 20,
	},
	descriptionTitle: {
		display: "flex",
		flexDirection: "row",
		columnGap: 6,
	},
	gap: {
		height: 2,
	},
	descriptionBox: {
		marginHorizontal: 20,
		display: "flex",
		rowGap: 10,
	},
});
