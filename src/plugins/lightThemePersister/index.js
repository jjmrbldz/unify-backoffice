export const lightThemePersister = store => {
	store.subscribe((mutation, state) => {
		localStorage.setItem('lightTheme', state.lightThemeStore.lightTheme)
	});
};