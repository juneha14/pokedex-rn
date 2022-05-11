import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackRouteParamList, Screens } from "./Routes";

export function useRouteNavigation() {
  const navigation = useNavigation<StackNavigationProp<StackRouteParamList>>();
  return navigation;
}

export function useRouteParams<T extends Screens>(screen: T) {
  const params = useRoute<RouteProp<StackRouteParamList, typeof screen>>();
  return params;
}
