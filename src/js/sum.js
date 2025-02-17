export default function sum(...arg) {
    return arg.reduce((p, v) => p + v, 0);
}
