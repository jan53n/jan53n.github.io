addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("colpref");
    const ls = localStorage;
    const lss = (v) => ls.setItem("colpref", v);
    const pref = ls.getItem("colpref");
    const cl = document.body.classList;
    const [d, l, a] = ["dark", "light", "auto"];

    if (pref === "0") {
        cl.add(l);
    } else if (pref === "1") {
        cl.add(d);
    } else if (pref === null) {
        cl.add(a);

        if (
            matchMedia
                ?.('(prefers-color-scheme: dark)')
                ?.matches) {
            cl.add(d);
        } else {
            cl.add(l);
        }
    }

    btn.addEventListener("click", () => {
        if (cl.contains(a)) {
            cl.remove(a);
        }

        if (cl.contains(d)) {
            cl.replace(d, l);
            lss("0");
        } else {
            cl.replace(l, d);
            lss("1");
        }
    });

    btn.addEventListener("dblclick", () => {
        ls.removeItem("colpref");

        if (!cl.contains(a)) {
            cl.add(a);
        }
    });
});