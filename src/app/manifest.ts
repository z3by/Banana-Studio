import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Banana Studio",
        short_name: "Banana Studio",
        description: "Generate high-quality prompts for your AI portrait edits.",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b", // zinc-950
        theme_color: "#eab308", // yellow-500
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/apple-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
