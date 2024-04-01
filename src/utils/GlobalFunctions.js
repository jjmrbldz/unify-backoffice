import ToastEventBus from 'primevue/toasteventbus';
const timezone      = "Asia/Manila"

const GF = {
    getDateTime : (data, type) => {
        if(data) {
            try {
                let dt          = new Date(data);
                let newdt       = dt.toLocaleString('en-US', { timeZone: timezone, hourCycle: 'h23', year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
                let str_date    = newdt.split(", ");
                let _d          = str_date[0].split("/");

                let _t          = str_date[1].split(":");
                if(type) {
                    if(type === 'date') {

                        let datetime    = _d[2]+"-"+_d[0]+"-"+_d[1];
                        return datetime;

                    } else if(type === 'time') {

                        let datetime    = _t[0]+":"+_t[1]+":"+_t[2];
                        return datetime;

                    } else if(type === 'monthDate') {

                        dt = dt.toLocaleString('en-US', { timeZone: timezone, hourCycle: 'h23', year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
                        dt = dt.split(", ");
                        dt = dt[0].split("/");
                        
                        let datetime    = _d[0];
                    
                        return datetime;
                    } else {
                        '-'
                    }
                } else {
                    let datetime    = _d[2]+"-"+_d[0]+"-"+_d[1]+" "+_t[0]+":"+_t[1]+":"+_t[2];
                    return datetime;
                }

            } catch(error) {
                console.error(error)
                return '-'
            }
            
        } else {
            return '-'
        }
    },
    scrollToTop: () => {
        window.scrollTo({
            top     : 0,
            behavior: 'smooth',
        });
    },
    setUrlQueryParams: (router,params) => {
        router.push({query: params })
    },
    getURLParams: (route) => {
        let params;
        if (Object.entries(route).length !== 0) {
            params  = route;
        }
        return params;
    },
    userInfoWindow: (x, y) => {
        x.preventDefault();
        // let URL = `sub/information?user_account=${z}`;
        // let URL = x.target.getAttribute('href');
        let windowName      =  `User info ${new Date()}`;
        let left            = (screen.width - 990) / 2;
        let top             = (screen.height - 700) / 2;
        let windowFeatures  = "width=1280, height=700, scrollbars=yes, top=" + top + ", left=" + left;
        windowNew = window.open(`${y}`, windowName, windowFeatures);
    },
    removeHyphen: (text) => { // Convert '-' to ' '
        var newText = text.replace(/-/g, ' ').toLowerCase();
        
        return newText
    },
    removeTUnderScore: (text) => { // Convert 'T_' to ' '
        var newText = text.replace(/T_/g, '').toUpperCase();
        
        return newText
    },
    removeUnderScore: (text) => { // Convert '_' to ' '
        var newText = text.replace(/_/g, ' ');
        
        return newText
    },
    replaceCommaReverse: (text) => { // Convert ',' to ' '
        var path = text.split(",");
        if (path.length === 1) {
            return path
        } else {
            let arr = []
            for(let i = path.length - 1; i >= 1; i--){
                arr.push(parseInt(path[i]));
            }
            // var newPath = String(arr).replace(/,/g, ' ').toLowerCase();
            return arr
        }
        
    },
    convertDecimal: (no) => {
        if(no) {
            // console.log(no);
            let toInt = parseFloat(no);
            let newNo = toInt * 100;
            // console.log(newNo);
            return newNo
        } else {
            return '-'
        }
    },
    isJSONString: (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    rmStrBef_: (str) => {
        if(str) {
            if(str.includes("_")) {
                var rs = str.replace(/[^_]+_/, '')
                return rs
            } else {
                return str
            }
        } else {
            return str
        }
    },
    gtStrBef_: (str) => {
        var parts = str.split('_');
        if (parts.length > 1 && parts[0] !== "") {
            return parts[0];
        } else {
            return str;
        }
    },
    handleTextColor: (x) => {
        return x < 0 ? 'text-danger' : ''
    },
    customToast: (type, msg) => {
        console.log('Fire!', type, msg);
        ToastEventBus.emit('add', { severity: (type > 0) ? 'success' : (type === -1) ? 'warn' : 'error', detail: msg, life: 4000 });
    },
    formatNumComma(x) {
        return x >= 0 ? x.toLocaleString() : '-'
    },
    formatTwoDecimal(x) {
        return x >= 0 ? parseFloat(x).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'
    }
}

export default GF