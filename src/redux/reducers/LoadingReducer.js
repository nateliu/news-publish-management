export const LoadingReducer = (prevState = { isLoading: false }, action) => {
    // console.log(action);
    const { type } = action;
    switch (type) {
        case 'change_loading':
            let newState = { ...prevState };
            newState.isLoading = !newState.isLoading;
            return newState;
        default:
            return prevState;
    }
}