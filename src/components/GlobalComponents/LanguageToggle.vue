<template>
    <Button class="header-item lang-btn" text rounded @click="(event) => this.$refs.langPanel.toggle(event)">
        <Image :src="langIcon" class="lang-icon"/>
    </Button>
    <OverlayPanel class="lang-panel" ref="langPanel">
        <Button text @click="handleLang('en', enIcon, $event)" class="lang-btn text-body" label col="English">
            <Image :src="enIcon" class="lang-icon" /> 
            <span class="lang-title">English</span>   
        </Button>
        <Button text @click="handleLang('kr', krIcon, $event)" class="lang-btn text-body" label col="한국인">
            <Image :src="krIcon" class="lang-icon" />
            <span class="lang-title">한국인</span>   
        </Button>
        <Button text @click="handleLang('cn', cnIcon, $event)" class="lang-btn text-body" label col="中国人">
            <Image :src="cnIcon" class="lang-icon" />
            <span class="lang-title">中国人</span>     
        </Button>
        <Button text @click="handleLang('jp', jpIcon, $event)" class="lang-btn text-body" label col="日本語">
            <Image :src="jpIcon" class="lang-icon" /> 
            <span class="lang-title">日本語</span>      
        </Button>
        <Button text @click="handleLang('vn', vnIcon, $event)" class="lang-btn text-body" label col="Tiếng Việt">
            <Image :src="vnIcon" class="lang-icon" />    
            <span class="lang-title">Tiếng Việt</span>   
        </Button>
        <Button text @click="handleLang('la', laIcon, $event)" class="lang-btn text-body" label col="ຄົນລາວ">
            <Image :src="laIcon" class="lang-icon" />    
            <span class="lang-title">ຄົນລາວ</span>   
        </Button>
    </OverlayPanel>
</template>

<style lang="scss" scoped>
    
</style>

<script>
import en from '@/assets/img/flags/en.jpg'
import kr from '@/assets/img/flags/kr.jpg'
import cn from '@/assets/img/flags/cn.png'
import jp from '@/assets/img/flags/jp.png'
import vn from '@/assets/img/flags/vn.jpg'
import la from '@/assets/img/flags/la.png'

export default {
    data() {
        return {
            langIcon: null,
            enIcon: en,
            krIcon: kr,
            cnIcon: cn,
            jpIcon: jp,
            vnIcon: vn,
            laIcon: la,
        }
    },
    mounted() {
        this.handleLastLang();
        var s = setTimeout(() => {
            clearTimeout(s)
        }, 300)
    },
    methods: {
        handleLastLang() {
            const selectedLang = this.$store.state.languageStore.lang
            switch (selectedLang) {
                case "en":
                    console.log('aa');
                    this.langIcon = en;
                    break;
                case "kr":
                    this.langIcon = kr;
                    break;
                case "cn":
                    this.langIcon = cn;
                    break;
                case "jp":
                    this.langIcon = jp;
                    break;
                case "vn":
                    this.langIcon = vn;
                    break;
                case "la":
                    this.langIcon = la;
                    break;
            }

            return this.langIcon
        },
        handleLang(lang, icon, event) {
            this.langIcon = icon;
            this.$store.dispatch('languageStore/setLang', lang)
            this.$refs.langPanel.toggle(event)
        },
    }
}
</script>