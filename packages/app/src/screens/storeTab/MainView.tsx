import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from "react-native";

// UI imports
import { Text } from "react-native-elements";
import { ButtonValid, ButtonCancel } from "../../components/Buttons";
// Redux import
import { useStore } from "../../Redux/store";
// LocalStorage imports
import { readStorage } from "../../Resources";

// fetch api
import betService from "../../Services/betService";
import { SafeAreaView } from "react-native-safe-area-context";
import { MatchCard } from "../../components";

export default function MainView({ navigation }) {
  const { state, dispatch } = useStore();
  const [ upcomingMatchs, setUpcomingMatchs ] = useState<Match[]>([]);
  const [ token, setToken ] = useState<string>();

  readStorage("token").then(storageToken => setToken(storageToken));

  useEffect(() => {
    betService
      .getUpcomingMatchs(token)
      .then(fetchedMatchs => {
        console.log("data", fetchedMatchs.data.length);
        setUpcomingMatchs(fetchedMatchs.data)
      })
  }, [token])

  return (
    <View style={{ flex: 1 }}>
      { state.user != null ? (
          <ScrollView>
            {
              upcomingMatchs.map(match => {
                return(
                  <MatchCard key={match.id} match={match} canBet={true} />
                )
              })
            }
            <Text>{"\n"}</Text>
          </ScrollView>
        ) : (
          <Text>!! YOU MUST BE LOGGED !!</Text>
        )}
    </View>
  );
}
