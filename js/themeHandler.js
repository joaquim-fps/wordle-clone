function themeHandler() {
    let toggleThemeBtn = document.querySelector("#theme_button"),
        current_theme = getCookie("theme");

    document.body.classList.add(current_theme ? current_theme : "dark");

    function themeSwitch(e) {
        if (current_theme == "dark") {
            document.body.classList.add("light");
            document.body.classList.remove("dark");

            setCookie("theme", "light", 86400 * 7, "/");
            current_theme = "light";

            toggleThemeBtn.children[0].textContent = "brightness_2";
        } else {
            document.body.classList.add("dark");
            document.body.classList.remove("light");

            setCookie("theme", "dark", 86400 * 7, "/");
            current_theme = "dark";

            toggleThemeBtn.children[0].textContent = "brightness_high";
        }
    }

    toggleThemeBtn.addEventListener("click", themeSwitch);
}

function getCookie(k) {
    let c = String(document.cookie).split(";"),
        neq = k + "=";

    for (let i = 0; i < c.length; i++) {
        let d = c[i];

        while (d.charAt(0) === " ") {
            c[i] = c[i].substring(1, d.length);
        }

        if (c[i].indexOf(neq) === 0) {
            return decodeURIComponent(c[i].substring(neq.length, c[i].length));
        }
    }

    return null;
}

function setCookie(k, v, expira, path) {
    path = path || "/";

    let d = new Date();
    d.setTime(d.getTime() + expira * 1000);

    document.cookie =
        encodeURIComponent(k) +
        "=" +
        encodeURIComponent(v) +
        "; expires=" +
        d.toUTCString() +
        "; path=" +
        path;
}

themeHandler();
