
export const parseDurationToMs = (duration) => {
    const match = duration?.match(/^(\d+)(s|m|h|d)$/);

    if (!match) {
        throw new Error(
            "Invalid duration format. Use s, m, h, or d (e.g. 7d)."
        );
    }

    const value = Number(match[1]);
    const unit = match[2];

    if (!Number.isSafeInteger(value) || value <= 0) {
        throw new Error("Duration must be a positive safe integer.");
    }

    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    const durationInMs = value * multipliers[unit];

    if (!Number.isSafeInteger(durationInMs)) {
        throw new Error("Duration is too large.");
    }

    return durationInMs;
};
