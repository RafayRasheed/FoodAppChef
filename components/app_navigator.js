import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StartupNavigator } from "./startup/startup_navigator"
import { HomeBottomNavigator } from "./home/home_bottom_navigator"
import { AccountNavigator } from "./account/account_navigation"
import { ImageViewer } from "./common/image_viewer"
import { AccountNavigator2 } from "./account1/acc_stack"
import { storage } from "./common"
import { createStackNavigator } from "@react-navigation/stack"
import { containFirstTime, containLogin } from "./functions/storageMMKV"
import { ItemDetails } from "./home/item_detail_screen"
import { Search } from "./home/search_screen"
import { ItemSearch } from "./home/item_search_screen"
import { RestaurantMoreDetails } from "./home/rest_more_info_screen"
import { ProfileInfo } from "./profile/profile_info"
import { RestaurantEdit } from "./profile/restaurant_edit"
import { RestaurantDetail } from "./home/restaurant_detail_screen"
import { ItemEdit } from "./profile/item_edit"
import { OrderDetails } from "./orders/order_detail_screen"

const AppTAB = createStackNavigator()

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <AppTAB.Navigator
                // initialRouteName="StartupNavigator"
                initialRouteName={containFirstTime() ? containLogin() ? 'HomeBottomNavigator' : "AccountNavigator" : "StartupScreen"}
                screenOptions={{
                    animation: 'fade',
                    headerShown: false
                }}
            >
                <AppTAB.Screen component={StartupNavigator} name="StartupNavigator" />
                <AppTAB.Screen component={AccountNavigator2} name="AccountNavigator" />
                <AppTAB.Screen component={HomeBottomNavigator} name="HomeBottomNavigator" />
                <AppTAB.Screen component={ImageViewer} name="ImageViewer" />

                {/* Home */}
                <AppTAB.Screen component={RestaurantDetail} name="RestaurantDetail" />
                <AppTAB.Screen component={RestaurantMoreDetails} name="RestaurantMoreDetails" />
                <AppTAB.Screen component={ItemDetails} name="ItemDetails" />
                <AppTAB.Screen component={Search} name="Search" />
                <AppTAB.Screen component={ItemSearch} name="ItemSearch" />


                {/* PROFILE */}
                <AppTAB.Screen component={ProfileInfo} name="ProfileInfo" />
                <AppTAB.Screen component={RestaurantEdit} name="RestaurantEdit" />
                <AppTAB.Screen component={ItemEdit} name="ItemEdit" />

                <AppTAB.Screen component={OrderDetails} name="OrderDetails" />


            </AppTAB.Navigator>
        </NavigationContainer>
    )
}