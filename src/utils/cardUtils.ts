
export function generateNameToCard(name: string): string {
    const arrayName: string[] = name.split(" ");
    let newArrayName = [];
    for(let i = 0; i < arrayName.length; i++){
        const name = arrayName[i]
        if(i === 0 || i === arrayName.length - 1) { 
            newArrayName.push(name.toUpperCase());
        } else {
            newArrayName.push(name[0].toUpperCase());
        }
    }
    return newArrayName.join(" ");
}
