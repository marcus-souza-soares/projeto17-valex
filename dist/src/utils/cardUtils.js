export function generateNameToCard(name) {
    var arrayName = name.split(" ");
    var newArrayName = [];
    for (var i = 0; i < arrayName.length; i++) {
        var name_1 = arrayName[i];
        if (i === 0 || i === arrayName.length - 1) {
            newArrayName.push(name_1.toUpperCase());
        }
        else {
            newArrayName.push(name_1[0].toUpperCase());
        }
    }
    return newArrayName.join(" ");
}
