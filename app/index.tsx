import { Link, Stack, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Text>Home Screen</Text>
      <Button
        title="Search flights"
        onPress={() => {
          router.push({
            pathname: "search",
            params: { direction: "to" }
          });
        }}
      />
      <Link href="/search?direc=asdf">link text</Link>
    </View>
  );
}
