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
