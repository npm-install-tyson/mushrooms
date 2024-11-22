import {
	FlatList,
	Image,
	Pressable,
	RefreshControl,
	SafeAreaView,
	StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { Link, useFocusEffect } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useSQLiteContext } from "expo-sqlite";

const shortlists = () => {
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

	const [mushrooms, setMushroom] = useState<dbProps[]>([]);

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchData();
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const fetchData = useCallback(async () => {
		const data: dbProps[] = await db.getAllAsync(
			`SELECT * FROM mushrooms WHERE shortlisted = "true" ORDER BY common_name ASC `
		);
		setMushroom(data);
	}, []);

	useFocusEffect(
		useCallback(() => {
			// Refresh data when the tab/screen becomes focused
			fetchData();
			// Optional cleanup
			return () => {};
		}, [])
	);

	useEffect(() => {
		onRefresh();
		fetchData();
	}, [fetchData, onRefresh]);

	const shortlistHandler = async (id: number) => {
		const mushroom: any = await db.getFirstAsync(
			`SELECT * FROM mushrooms WHERE m_id = ${id}`
		);

		if (mushroom.shortlisted === "true") {
			await db.runAsync(
				"UPDATE mushrooms SET shortlisted = ? WHERE m_id = ?",
				"false",
				id
			);

			alert(`${mushroom.common_name} is removed from shortlists`);
			fetchData();
		} else {
			await db.runAsync(
				"UPDATE mushrooms SET shortlisted = ? WHERE m_id = ?",
				"true",
				id
			);
			alert(`${mushroom.common_name} is shortlisted`);
			fetchData();
		}
	};

	type ItemProps = {
		id: number;
		image_url: string;
		common_name: string;
		scientific_name: string;
		location: string;
		shortlisted: string;
	};

	const Item = ({
		id,
		image_url,
		common_name,
		scientific_name,
		location,
		shortlisted,
	}: ItemProps) => (
		<ThemedView style={styles.listContainer}>
			<Link
				href={{
					pathname: "/details/[id]",
					params: { id: id },
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
							<ThemedView>
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

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{mushrooms && mushrooms.length > 0 && (
				<FlatList
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					data={mushrooms}
					renderItem={({ item }) => (
						<Item
							id={item.m_id}
							image_url={item.image_url}
							common_name={item.common_name}
							scientific_name={item.scientific_name}
							location={item.location}
							shortlisted={item.shortlisted}
						/>
					)}
					keyExtractor={(item: any) => item.m_id}
				/>
			)}
			{mushrooms.length < 1 && (
				<ThemedView
					style={{
						display: "flex",
						flex: 1,
						justifyContent: "center",
					}}
				>
					<ThemedText style={{ textAlign: "center" }}>
						There is no shortlisted mushroom.
					</ThemedText>
					<ThemedText style={{ textAlign: "center" }}>
						Try to add some.
					</ThemedText>
				</ThemedView>
			)}
		</SafeAreaView>
	);
};

export default shortlists;

const styles = StyleSheet.create({
	container: {
		display: "flex",
	},
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
	},
	imgContainer: {},
	image: { width: 100, height: 100, borderRadius: 10 },
	contentBox: {
		display: "flex",
		flexDirection: "row",
		columnGap: 15,
	},
	textList: {
		display: "flex",
		paddingVertical: 5,
		justifyContent: "space-between",
	},
	shortlist: {
		paddingHorizontal: 10,
		paddingVertical: 15,
		position: "absolute",
		right: 0,
	},
	input: {
		height: 40,
		margin: 10,
		borderWidth: 1,
		padding: 10,
		borderRadius: 10,
		borderColor: "#d50630",
	},
});
