import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
}

const initialState = {
  sidebarShow: true,
  user: '',
  subscription: '',
  userSubscriptionId: '',
  userAddons: ''
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'user':
      return { ...state, ...rest }
    case 'getSubscription':
      return { ...state, ...rest }
    case 'userSubscriptionId':
      return { ...state, ...rest }
    case 'userAddons':
      return { ...state, ...rest }
    default:
      return state
  }
}

const persistedReducer = persistReducer(persistConfig, changeState)

const store = createStore(persistedReducer)
const persistor = persistStore(store);
export { store, persistor }
