import { Theme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { fonts } from "@react-navigation/native/src/theming/fonts";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	// useEffect(() => {
	// 	// Prevent the splash screen from auto-hiding
	// 	SplashScreen.preventAutoHideAsync();

	// 	if (loaded) {
	// 		SplashScreen.hideAsync();
	// 	}
	// }, [loaded]);

	// if (!loaded) {
	// 	return null;
	// }

	const myDarkTheme: Theme = {
		dark: true,
		colors: {
			primary: "rgb(213, 6 , 48)",
			background: "rgb(18, 18, 18)",
			card: "rgb(18, 18, 18)",
			text: "rgb(213, 6, 48)",
			border: "rgb(39, 39, 41)",
			notification: "rgb(255, 69, 58)",
		},
		fonts,
	};

	const myDefaultTheme: Theme = {
		dark: false,
		colors: {
			primary: "rgb(213, 6 , 48)",
			background: "rgb(255, 255, 255)",
			card: "rgb(255, 255, 255)",
			text: "rgb(213, 6, 48)",
			border: "rgb(216, 216, 216)",
			notification: "rgb(255, 59, 48)",
		},
		fonts,
	};

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? myDarkTheme : myDefaultTheme}
		>
			<SQLiteProvider
				databaseName="mushroom.db"
				assetSource={{
					assetId: require("@/assets/data/mushroomApp.db"),
				}}
				useSuspense
			>
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
							headerTitle: "Home",
						}}
					/>
					<Stack.Screen
						name="details/[id]"
						options={{
							headerShown: true,
							headerTitle: "Details",
							headerTitleAlign: "center",
						}}
					/>
					<Stack.Screen name="+not-found" />
				</Stack>
			</SQLiteProvider>
		</ThemeProvider>
	);
}

// async function migrateDbIfNeeded(db: SQLiteDatabase) {}
