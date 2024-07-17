try {
    (function(w, d) {
        zaraz.debug = (dK="")=>{
            document.cookie = `zarazDebug=${dK}; path=/`;
            location.reload()
        }
        ;
        window.zaraz._al = function(da, db, dc) {
            w.zaraz.listeners.push({
                item: da,
                type: db,
                callback: dc
            });
            da.addEventListener(db, dc)
        }
        ;
        zaraz.preview = (dd="")=>{
            document.cookie = `zarazPreview=${dd}; path=/`;
            location.reload()
        }
        ;
        zaraz.i = function(dE) {
            const dF = d.createElement("div");
            dF.innerHTML = unescape(dE);
            const dG = dF.querySelectorAll("script");
            for (let dH = 0; dH < dG.length; dH++) {
                const dI = d.createElement("script");
                dG[dH].innerHTML && (dI.innerHTML = dG[dH].innerHTML);
                for (const dJ of dG[dH].attributes)
                    dI.setAttribute(dJ.name, dJ.value);
                d.head.appendChild(dI);
                dG[dH].remove()
            }
            d.body.appendChild(dF)
        }
        ;
        zaraz.f = async function(eo, ep) {
            const eq = {
                credentials: "include",
                keepalive: !0,
                mode: "no-cors"
            };
            if (ep) {
                eq.method = "POST";
                eq.body = new URLSearchParams(ep);
                eq.headers = {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
            return await fetch(eo, eq)
        }
        ;
        window.zaraz._p = async bO=>new Promise((bP=>{
            if (bO) {
                bO.e && bO.e.forEach((bQ=>{
                    try {
                        new Function(bQ)()
                    } catch (bR) {
                        console.error(`Error executing script: ${bQ}\n`, bR)
                    }
                }
                ));
                Promise.allSettled((bO.f || []).map((bS=>fetch(bS[0], bS[1]))))
            }
            bP()
        }
        ));
        zaraz.pageVariables = {};
        zaraz.__zcl = zaraz.__zcl || {};
        zaraz.track = async function(dh, di, dj) {
            return new Promise(((dk,dl)=>{
                const dm = {
                    name: dh,
                    data: {}
                };
                for (const dn of [localStorage, sessionStorage])
                    Object.keys(dn || {}).filter((dq=>dq.startsWith("_zaraz_"))).forEach((dp=>{
                        try {
                            dm.data[dp.slice(7)] = JSON.parse(dn.getItem(dp))
                        } catch {
                            dm.data[dp.slice(7)] = dn.getItem(dp)
                        }
                    }
                    ));
                Object.keys(zaraz.pageVariables).forEach((dr=>dm.data[dr] = JSON.parse(zaraz.pageVariables[dr])));
                Object.keys(zaraz.__zcl).forEach((ds=>dm.data[`__zcl_${ds}`] = zaraz.__zcl[ds]));
                dm.data.__zarazMCListeners = zaraz.__zarazMCListeners;
                //
                zarazData.c = d.cookie;
                //
                dm.data = {
                    ...dm.data,
                    ...di
                };
                dm.zarazData = zarazData;
                fetch("https://hfb.horsefiretablet.com/cdn-cgi/zaraz/t", {
                    credentials: "include",
                    keepalive: !0,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dm)
                }).catch((()=>{
                    //
                    return fetch("https://hfb.horsefiretablet.com/cdn-cgi/zaraz/t", {
                        credentials: "include",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dm)
                    })
                }
                )).then((function(du) {
                    zarazData._let = (new Date).getTime();
                    du.ok || dl();
                    return 204 !== du.status && du.json()
                }
                )).then((async dt=>{
                    await zaraz._p(dt);
                    "function" == typeof dj && dj()
                }
                )).finally((()=>dk()))
            }
            ))
        }
        ;
        zaraz.set = function(dv, dw, dx) {
            try {
                dw = JSON.stringify(dw)
            } catch (dy) {
                return
            }
            prefixedKey = "_zaraz_" + dv;
            sessionStorage && sessionStorage.removeItem(prefixedKey);
            localStorage && localStorage.removeItem(prefixedKey);
            delete zaraz.pageVariables[dv];
            if (void 0 !== dw) {
                dx && "session" == dx.scope ? sessionStorage && sessionStorage.setItem(prefixedKey, dw) : dx && "page" == dx.scope ? zaraz.pageVariables[dv] = dw : localStorage && localStorage.setItem(prefixedKey, dw);
                zaraz.__watchVar = {
                    key: dv,
                    value: dw
                }
            }
        }
        ;
        for (const {m: dz, a: dA} of zarazData.q.filter((({m: dB})=>["debug", "set"].includes(dB))))
            zaraz[dz](...dA);
        for (const {m: dC, a: dD} of zaraz.q)
            zaraz[dC](...dD);
        delete zaraz.q;
        delete zarazData.q;
        zaraz.fulfilTrigger = function(ew, ex, ey, ez) {
            zaraz.__zarazTriggerMap || (zaraz.__zarazTriggerMap = {});
            zaraz.__zarazTriggerMap[ew] || (zaraz.__zarazTriggerMap[ew] = "");
            zaraz.__zarazTriggerMap[ew] += "*" + ex + "*";
            zaraz.track("__zarazEmpty", {
                ...ey,
                __zarazClientTriggers: zaraz.__zarazTriggerMap[ew]
            }, ez)
        }
        ;
        zaraz._processDataLayer = eh=>{
            for (const ei of Object.entries(eh))
                zaraz.set(ei[0], ei[1], {
                    scope: "page"
                });
            if (eh.event) {
                if (zarazData.dataLayerIgnore && zarazData.dataLayerIgnore.includes(eh.event))
                    return;
                let ej = {};
                for (let ek of dataLayer.slice(0, dataLayer.indexOf(eh) + 1))
                    ej = {
                        ...ej,
                        ...ek
                    };
                delete ej.event;
                eh.event.startsWith("gtm.") || zaraz.track(eh.event, ej)
            }
        }
        ;
        window.dataLayer = w.dataLayer || [];
        const eg = w.dataLayer.push;
        Object.defineProperty(w.dataLayer, "push", {
            configurable: !0,
            enumerable: !1,
            writable: !0,
            value: function(...el) {
                let em = eg.apply(this, el);
                zaraz._processDataLayer(el[0]);
                return em
            }
        });
        dataLayer.forEach((en=>zaraz._processDataLayer(en)));
        zaraz._cts = ()=>{
            zaraz._timeouts && zaraz._timeouts.forEach((cZ=>clearTimeout(cZ)));
            zaraz._timeouts = []
        }
        ;
        zaraz._rl = function() {
            w.zaraz.listeners && w.zaraz.listeners.forEach((c$=>c$.item.removeEventListener(c$.type, c$.callback)));
            window.zaraz.listeners = []
        }
        ;
        history.pushState = function() {
            try {
                zaraz._rl();
                zaraz._cts && zaraz._cts()
            } finally {
                History.prototype.pushState.apply(history, arguments);
                setTimeout((()=>{
                    zarazData.l = d.location.href;
                    zarazData.t = d.title;
                    zaraz.pageVariables = {};
                    zaraz.__zarazMCListeners = {};
                    zaraz.track("__zarazSPA")
                }
                ), 100)
            }
        }
        ;
        history.replaceState = function() {
            try {
                zaraz._rl();
                zaraz._cts && zaraz._cts()
            } finally {
                History.prototype.replaceState.apply(history, arguments);
                setTimeout((()=>{
                    zarazData.l = d.location.href;
                    zarazData.t = d.title;
                    zaraz.pageVariables = {};
                    zaraz.track("__zarazSPA")
                }
                ), 100)
            }
        }
        ;
        zaraz._c = y=>{
            const {event: z, ...A} = y;
            zaraz.track(z, {
                ...A,
                __zarazClientEvent: !0
            })
        }
        ;
        zaraz._syncedAttributes = ["altKey", "clientX", "clientY", "pageX", "pageY", "button"];
        zaraz.__zcl.track = !0;
        d.addEventListener("visibilitychange", (B=>{
            zaraz._c({
                event: "visibilityChange",
                visibilityChange: [{
                    state: d.visibilityState,
                    timestamp: (new Date).getTime()
                }]
            }, 1)
        }
        ));
        zaraz.__zcl.visibilityChange = !0;
        zaraz.__zarazMCListeners = {
            "google-analytics_v4_HeXm": ["visibilityChange"]
        };
        zaraz._p({
            "e": ["(function(w,d){w.zarazData.executed.push(\"Pageview\");})(window,document)", "(function(w,d){;d.cookie=unescape('google-analytics_v4_HeXm__engagementDuration%3D0%3B%20Domain%3Dhorsefiretablet.com%3B%20Path%3D/%3B%20Max-Age%3D31536000000');d.cookie=unescape('google-analytics_v4_HeXm__engagementStart%3D1707053827066%3B%20Domain%3Dhorsefiretablet.com%3B%20Path%3D/%3B%20Max-Age%3D31536000000');d.cookie=unescape('google-analytics_v4_HeXm__counter%3D73%3B%20Domain%3Dhorsefiretablet.com%3B%20Path%3D/%3B%20Max-Age%3D31536000000');d.cookie=unescape('google-analytics_v4_HeXm__ga4sid%3D105926027%3B%20Domain%3Dhorsefiretablet.com%3B%20Path%3D/%3B%20Max-Age%3D1800');d.cookie=unescape('google-analytics_v4_HeXm__session_counter%3D2%3B%20Domain%3Dhorsefiretablet.com%3B%20Path%3D/%3B%20Max-Age%3D31536000000');d.cookie=unescape('google-analytics_v4_HeXm__ga4%3D75c3b94d-60c4-4220-bb8a-72ce058eda85%3B%20Domain%3Dhorsefiretablet.com%3B%20Path%3D/%3B%20Max-Age%3D31536000000');d.cookie=unescape('google-analytics_v4_HeXm__let%3D1707053827066%3B%20Domain%3Dhorsefiretablet.com%3B%20Path%3D/%3B%20Max-Age%3D31536000000')})(window, document)"],
            "f": [["https://stats.g.doubleclick.net/g/collect?t=dc&aip=1&_r=3&v=1&_v=j86&tid=G-GC608J9SEF&cid=75c3b94d-60c4-4220-bb8a-72ce058eda85&_u=KGDAAEADQAAAAC%7E&z=1359545610", {}]]
        })
    }
    )(window, document)
} catch (e) {
    throw fetch("https://hfb.horsefiretablet.com/cdn-cgi/zaraz/t"),
    e;
}
