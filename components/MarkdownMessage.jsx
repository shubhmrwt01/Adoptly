import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";

export default function MarkdownMessage({ text }) {
    return (
        <Markdown style={markdownStyles}>{text}</Markdown>
    );
}

const markdownStyles = StyleSheet.create({
    body: {
        color: "#2d2d2d",
        fontSize: 14,
        lineHeight: 22,
    },
    strong: {
        fontWeight: "700",
        color: "#1a1a1a",
    },
    em: {
        fontStyle: "italic",
        color: "#444",
    },
    bullet_list: {
        marginVertical: 4,
    },
    ordered_list: {
        marginVertical: 4,
    },
    list_item: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 3,
    },
    bullet_list_icon: {
        color: "#f5a623",   // your app's yellow/orange accent
        fontSize: 16,
        marginRight: 6,
        marginTop: 2,
    },
    ordered_list_icon: {
        color: "#f5a623",
        fontSize: 14,
        fontWeight: "700",
        marginRight: 6,
        marginTop: 2,
    },
    heading1: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a1a1a",
        marginVertical: 6,
    },
    heading2: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
        marginVertical: 4,
    },
    heading3: {
        fontSize: 15,
        fontWeight: "600",
        color: "#444",
        marginVertical: 4,
    },
    paragraph: {
        marginVertical: 4,
    },
    hr: {
        backgroundColor: "#e0e0e0",
        height: 1,
        marginVertical: 8,
    },
    blockquote: {
        backgroundColor: "#fff8ec",
        borderLeftColor: "#f5a623",
        borderLeftWidth: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginVertical: 6,
        borderRadius: 4,
    },
    code_inline: {
        backgroundColor: "#f4f4f4",
        color: "#c0392b",
        fontFamily: "monospace",
        paddingHorizontal: 4,
        borderRadius: 4,
        fontSize: 13,
    },
    fence: {
        backgroundColor: "#f4f4f4",
        borderRadius: 8,
        padding: 10,
        marginVertical: 6,
        fontSize: 13,
        fontFamily: "monospace",
        color: "#333",
    },
    link: {
        color: "#f5a623",
        textDecorationLine: "underline",
    },
});