import { TAB_HISTORY, USER_AUTH, USER_AUTH_ERROR, TAB_HISTORY_BACK, PAGE_LOADER, SEARCH_QUERY, RESET_TAB_HISTORY, CART_COUNT } from "./actionType";

export const userAuth = (data) => ({
  type: USER_AUTH,
  payload: data,
});

export const userAuthError = (message) => ({
  type: USER_AUTH_ERROR,
  payload: message,
});

export const userTabHistory = (data) => ({
  type: TAB_HISTORY,
  payload: data,
});

export const userTabBack = (data) => ({
  type: TAB_HISTORY_BACK,
  payload: data,
})
export const loaderOverlay = (pageLoading) => ({
  type: PAGE_LOADER,
  payload: pageLoading
})

export const searchQuery = (term) => ({
  type: SEARCH_QUERY,
  payload: term
})

export const clearTabHistory = () => ({
  type: RESET_TAB_HISTORY,
  payload: ['home']
})

export const cartCount = (count) => {
  return {
    type: CART_COUNT,
    payload: count
  }
}