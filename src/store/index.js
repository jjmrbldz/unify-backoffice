import { createStore } from "vuex";

import lightThemeStore from './theme'
import languageStore from './lang'
import userStore from './user'
import { userPersister } from "@/plugins/userPersister";
import { languagePersister } from "@/plugins/languagePersister";
import { lightThemePersister } from "@/plugins/lightThemePersister";

export default createStore({
    modules: {
        userStore,
        lightThemeStore,
        languageStore,
    },
    plugins: [userPersister, lightThemePersister, languagePersister]
})