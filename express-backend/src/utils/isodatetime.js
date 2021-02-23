export const getDateIsoTzOffset = () => {
    const date = new Date()
    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = num => {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    }
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}


// Date.prototype.toIsoString = function() {
//     var tzo = -this.getTimezoneOffset(),
//         dif = tzo >= 0 ? '+' : '-',
//         pad = function(num) {
//             var norm = Math.floor(Math.abs(num));
//             return (norm < 10 ? '0' : '') + norm;
//         };
//     return this.getFullYear() +
//         '-' + pad(this.getMonth() + 1) +
//         '-' + pad(this.getDate()) +
//         'T' + pad(this.getHours()) +
//         ':' + pad(this.getMinutes()) +
//         ':' + pad(this.getSeconds()) +
//         dif + pad(tzo / 60) +
//         ':' + pad(tzo % 60);
// }
//
// var dt = new Date();
// console.log(dt.toIsoString());
