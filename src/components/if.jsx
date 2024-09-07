export default function If({condition, children, replacement}) {
    if (condition) {
        return children;
    }
    return replacement;
}