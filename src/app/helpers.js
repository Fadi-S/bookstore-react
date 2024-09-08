import {closeNotification, openLoginForm, showNotification} from "../features/page/page_slice";

export function useConvertPrice(priceInPennies) {
    return (priceInPennies / 100).toFixed(2);
}

export function useParseDate(date) {
    date = new Date(Date.parse(date));
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function notify(message, dispatch, title="Success", type='success', timeout = 3000) {
    dispatch(showNotification({message, type, show: true, title}));
    setTimeout(() => dispatch(closeNotification()), timeout);
}

export function handleAddToCart(dispatch, error, addedSuccessfully, navigate) {
    if(error) {
        if(error.status === 403 || error.status === 401) {
            notify("You need to login to add items to cart", dispatch, "Error", "error");

            dispatch(openLoginForm());
            return;
        }

        notify(error?.data?.message, dispatch, "Error", "error");
    }

    if(addedSuccessfully) {
        navigate("/cart");
    }
}