import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const colors = [
    "bg-[#47556950] border-[#475569]",
    "bg-[#ef444450] border-[#ef4444]",
    "bg-[#22c55e50] border-[#22c55e]",
    "bg-[#6366f150] border-[#6366f1]",
    "bg-[#FFF83A50] border-[#FFF83A]",
    "bg-[#FF3AB050] border-[#FF3AB0]",
    "bg-[#d946ef50] border-[#d946ef]",
];

export const getColor = (color) => {
    if (color >= 0 && color < colors.length) {
        return colors[color];
    }
    return colors[0];
};

export const chatColors = [
    "bg-[#47556970] border-[#47556975]",
    "bg-[#ef444470] border-[#ef444475]",
    "bg-[#22c55e70] border-[#22c55e75]",
    "bg-[#6366f170] border-[#6366f175]",
    "bg-[#FFF83A70] border-[#FFF83A75]",
    "bg-[#FF3AB070] border-[#FF3AB075]",
    "bg-[#d946ef70] border-[#d946ef75]",
];

export const getChatColor = (color) => {
    if (color >= 0 && color < chatColors.length) {
        return chatColors[color];
    }
    return chatColors[0];
};
