function setCookie(cname, cvalue, exdays, path = "/") {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires="+d.toUTCString();
    const domain = getCookieDomain();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path + ";" + domain + ";";
}
  
function deleteCookie(cname, path = "/") {
    const d = new Date();
    d.setTime(d.getTime() - (24 * 60 * 60 * 1000));
    const expires = "expires="+d.toUTCString();
    const domain = getCookieDomain();
    document.cookie = cname + "=;" + expires + ";path=" + path + ";" + domain + ";";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getCookieDomain() {
    return "alexmiha.de";
}