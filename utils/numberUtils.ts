export const formatCompactNumber = (number: number): string => {
    if (number == null) return '0';
    try {
        // Using Intl.NumberFormat for robust, locale-aware number formatting
        const formatter = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        });
        return formatter.format(number);
    } catch (e) {
        // Fallback for older browsers or environments that don't support Intl.NumberFormat with notation
        if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        if (number >= 1_000_000) return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (number >= 1_000) return (number / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return number.toString();
    }
}
