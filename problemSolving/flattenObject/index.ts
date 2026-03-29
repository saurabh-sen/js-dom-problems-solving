console.log('Problem Solving - Flatten Object');

interface IFlattenParam {
    [key: string]: string | number | Array<number> | IFlattenParam
}

const flatten = (obj: IFlattenParam) => {
    const result = {};
    const dfs = (obj, prevPath) => {
        Object.keys(obj).forEach(item => {
            const value = obj[item];
            const key = prevPath ? prevPath + '.' + item : item;
            if (Array.isArray(value)) {
                value.forEach((item, i) => {
                    const copykey = key + '.' + i;
                    if (typeof item !== 'object') {
                        result[copykey] = item;
                    } else dfs(item, copykey)
                })
            } else if (typeof value == 'object') {
                dfs(value, key);
            } else {
                result[key] = value;
            }
        })
    }
    dfs(obj, '');
    return result;
}

const nested = {
    A: "12",
    B: 23,
    C: {
        P: 23,
        O: {
            L: 56
        },
        Q: [1, 2]
    }
};
console.log(flatten(nested));

// Output:
//     {
//     "A": "12"
//     "B": 23,
//     "C.O.L": 56,
//     "C.P": 23,
//     "C.Q.0": 1,
//     "C.Q.1": 2,
//     }