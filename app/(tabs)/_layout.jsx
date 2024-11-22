import { StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const _layout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarActiveTintColor: "#d50630",
				headerTitleAlign: "center",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Mushrooms",
					tabBarLabel: "Home",
					tabBarIcon: ({ focused, color }) => (
						<TabBarIcon
							name={focused ? "home" : "home-outline"}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="shortlists"
				options={{
					title: "My Shortlists",
					tabBarLabel: "Shortlists",
					tabBarIcon: ({ focused, color }) => (
						<TabBarIcon
							name={focused ? "bookmarks" : "bookmarks-outline"}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default _layout;

const styles = StyleSheet.create({});
