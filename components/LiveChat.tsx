"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
    interface Window {
        __lc: any;
        LiveChatWidget: any;
        LC_API: any;
    }
}

export default function LiveChat() {
    useEffect(() => {
        const setupListeners = () => {
            window.LiveChatWidget.on("ready", () => {
                window.LiveChatWidget.call("maximize");
            });

            window.LiveChatWidget.on("new_event", (event: any) => {
                if (
                    ["message", "rich_message", "file"].includes(event.type) &&
                    event.author?.type !== "customer"
                ) {
                    window.LiveChatWidget.call("maximize");
                }
            });
        };

        // Widget pehle se load ho chuka hai
        if (window.LiveChatWidget) {
            setupListeners();
        } else {
            // Widget baad mein load hoga
            window.__lc = window.__lc || {};
            const prev = window.__lc.asyncInit;
            window.__lc.asyncInit = () => {
                if (prev) prev();
                setupListeners();
            };
        }
    }, []);

    return (
        <>
            <style>{`
        #chat-widget-container {
          right: 20px !important;
          z-index: 998 !important;
        }
      `}</style>

            <Script id="livechat-settings" strategy="beforeInteractive">
                {`
          window.__lc = window.__lc || {};
          window.__lc.license = 19067595;
          window.__lc.chat_between_groups = false;
          window.__lc.params = [{ name: "Page", value: window.location.href }];
        `}
            </Script>

            <Script
                id="livechat-widget"
                src="https://cdn.livechatinc.com/tracking.js"
                strategy="afterInteractive"
            />
        </>
    );
}