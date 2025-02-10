const _f = () => {
    const btn = document.getElementById("colpref");
    const ls = localStorage;
    const pref = ls.getItem("colpref");
    const cl = document.body.classList;

    function setAuto() {
        const isDark = matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
        ls.removeItem("colpref");

        if (!cl.contains("auto")) {
            cl.add("auto");
        }

        cl.remove("dark", "light");
        cl.add(
            isDark
                ? "dark"
                : "light");
    }

    if (pref === "0") {
        cl.add("light");
    } else if (pref === "1") {
        cl.add("dark");
    } else {
        setAuto();
    }

    btn.addEventListener("click", () => {
        cl.remove("auto");

        if (cl.contains("dark")) {
            cl.replace("dark", "light");
            ls.setItem("colpref", "0");
        } else {
            cl.replace("light", "dark");
            ls.setItem("colpref", "1");
        }
    });

    btn.addEventListener("dblclick", setAuto);
};

if (document.readyState !== "loading") {
    _f()
} else {
    addEventListener("DOMContentLoaded", _f);
}