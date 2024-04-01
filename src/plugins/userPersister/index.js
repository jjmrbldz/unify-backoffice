export const userPersister = store => {
	store.subscribe((mutation, state) => {
		localStorage.setItem('user', JSON.stringify(
			{
				user_id		: state.userStore.user_id,
				username	: state.userStore.username,
				token		: state.userStore.token,
			}
		))
	});
};