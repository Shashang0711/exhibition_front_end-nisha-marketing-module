import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import changeState from '../redux/reducers/authReducer';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
const persistConfig = {
    key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, changeState)
const store = createStore(persistedReducer)
const persistor = persistStore(store);
export { store, persistor }
