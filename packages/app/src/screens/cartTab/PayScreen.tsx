import React, { useContext, useEffect } from "react";
// UI import
import { Icon, Text, ThemeContext } from "react-native-elements";
import { CreditCardInput } from "react-native-credit-card-input";
import { ButtonValid, MainView, Loader } from "../../components";
import { ScrollView } from "react-native-gesture-handler";
// Hooks imports
import { payScreenVM } from "../../Hooks";
// Navigation imports
import { PayScreenProps } from "../../Navigator/Stacks";

export default function PayScreen({ navigation, route }: PayScreenProps) {
  const { theme } = useContext(ThemeContext);

  const {
    setAmount,
    form,
    fetch,
    fetchIsProcessing,
    error,
  } = payScreenVM.useInitAuthFetch({ navigation, route });

  useEffect(() => {
    setAmount(route.params.amount);
  }, []);

  return (
    <MainView>
      <ScrollView>
        <CreditCardInput
          {...form}
          allowScroll={true}
          invalidColor={theme.colors.error}
          labelStyle={{ color: theme.colors.secondary }}
          inputStyle={{ color: theme.colors.primary }}
        />
        <ButtonValid
          title="PAY"
          onPress={fetch}
          icon={
            <Icon name="ios-wallet" type="ionicon" size={15} color="#ffffff" />
          }
        />
        <Loader animating={fetchIsProcessing} />
        <Text
          style={{
            fontSize: 12,
            alignSelf: "center",
            color: theme.colors.error,
          }}
        >
          {error}
        </Text>
      </ScrollView>
    </MainView>
  );
}
