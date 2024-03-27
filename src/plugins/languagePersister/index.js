export const languagePersister = store => {
	store.subscribe((mutation, state) => {
		localStorage.setItem('lang', JSON.stringify(state.languageStore.lang)),
      	localStorage.setItem('translate', JSON.stringify(state.languageStore.translate))
	});
};