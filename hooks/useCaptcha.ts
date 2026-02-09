import React, { useState } from "react";

export function useCaptcha() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const onCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    };
    return { captchaToken, onCaptchaChange };
}
