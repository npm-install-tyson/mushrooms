import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	StyleSheet,
	useColorScheme,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import SearchInput from "@/components/SearchInput";
import MushroomCard from "@/components/MushroomCard";

export default function Index() {
	//Collect Device's Theme
	const colorScheme = useColorScheme();

	// Mushroom State
	const [data, setData] = useState<dbProps[]>([]);
	const [mushrooms, setMushroom] = useState<dbProps[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [text, onChangeText] = useState("");

	// Connect DB
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

	// Fetch Mushrooms from DB
	const fetchData = useCallback(async () => {
		const mushroomData: dbProps[] = await db.getAllAsync(
			`SELECT * FROM mushrooms ORDER BY common_name ASC`
		);
		setMushroom(mushroomData);
		setData(mushroomData);
	}, []);

	//Refresh the Screen
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchData();
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
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
		fetchData();
	}, [fetchData]);

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

	type mushroomProps = {
		common_name: string;
	};

	useEffect(() => {
		if (text) {
			const filterData = data.filter(({ common_name }: mushroomProps) =>
				common_name.toLowerCase().includes(text.toLowerCase())
			);
			setMushroom(filterData);
		} else {
			setMushroom(data);
		}
	}, [text]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{/* Search Bar */}
			<SearchInput
				colorScheme={colorScheme}
				text={text}
				onChangeText={onChangeText}
			/>
			{/* Mushroom Data */}
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
					<MushroomCard
						id={item.m_id}
						image_url={item.image_url}
						common_name={item.common_name}
						scientific_name={item.scientific_name}
						location={item.location}
						shortlisted={item.shortlisted}
						shortlistHandler={shortlistHandler}
					/>
				)}
				keyExtractor={(item: any) => item.m_id}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
	},
});
