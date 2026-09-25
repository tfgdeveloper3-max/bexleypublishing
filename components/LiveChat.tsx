"use client";

import { useEffect } from "react";

interface TawkAPI {
    onLoad?: () => void;
    onChatMessageAgent?: (message: string) => void;
    maximize?: () => void;
    customStyle?: Record<string, unknown>;
    [key: string]: unknown;
}

declare global {
    interface Window {
        Tawk_API?: TawkAPI;
        Tawk_LoadStart?: Date;
    }
}

const TAWK_SRC = "https://embed.tawk.to/6ab6c95db36b4b344430c4ec/1k3d055nf";

export default function LiveChat() {
    useEffect(() => {
        const Tawk_API: TawkAPI = (window.Tawk_API = window.Tawk_API || {});
        window.Tawk_LoadStart = new Date();

        Tawk_API.customStyle = {
            zIndex: 998,
            visibility: {
                desktop: { position: "br", xOffset: 20, yOffset: 20 },
                mobile: { position: "br", xOffset: 10, yOffset: 10 },
            },
        };

        Tawk_API.onLoad = () => {
            Tawk_API.maximize?.();
        };

        Tawk_API.onChatMessageAgent = () => {
            Tawk_API.maximize?.();
        };

        if (document.getElementById("tawk-script")) return;

        const s1 = document.createElement("script");
        s1.id = "tawk-script";
        s1.async = true;
        s1.src = TAWK_SRC;
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");
        document.body.appendChild(s1);
    }, []);

    return null;
}