import { createStore } from "vuex";

import lightThemeStore from './theme'
import languageStore from './lang'
import userStore from './user'
import betSummStore from './summary'
import { userPersister } from "@/plugins/userPersister";
import { languagePersister } from "@/plugins/languagePersister";
import { lightThemePersister } from "@/plugins/lightThemePersister";

export default createStore({
    modules: {
        userStore,
        lightThemeStore,
        languageStore,
        betSummStore,
    },
    plugins: [userPersister, lightThemePersister, languagePersister]
})