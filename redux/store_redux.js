const { configureStore } = require("@reduxjs/toolkit");
import cartReducer from './cart_reducer'
import category_reducer from './category_reducer';
import favoriteReducer from './favorite_reducer';
import order_reducer from './order_reducer';
import profile_reducer from './profile_reducer';

const storeRedux = configureStore({
    reducer: {
        cart: cartReducer,
        favorite: favoriteReducer,
        profile: profile_reducer,
        mainCategories: category_reducer,
        orders: order_reducer,


    }
})

export default storeRedux