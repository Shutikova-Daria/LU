
function generateMatrix() {
    let size = document.getElementById("matrixSize").value;
    let container = document.getElementById("matrixContainer");
    container.innerHTML = "";

    for (let i = 0; i < size; i++) {
        let row = document.createElement("div");
        row.classList.add("matrix-row");

        for (let j = 0; j < size; j++) {
            let input = document.createElement("input");
            input.type = "number";
            input.id = `A-${i}-${j}`;
            row.appendChild(input);
        }

        let bInput = document.createElement("input");
        bInput.type = "number";
        bInput.id = `B-${i}`;
        bInput.placeholder = "b";
        row.appendChild(bInput);

        container.appendChild(row);
    }
}

function luDecomposition(A) {
    let n = A.length;
    let L = Array(n).fill().map(() => Array(n).fill(0));
    let U = Array(n).fill().map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let k = i; k < n; k++) {
            let sum = 0;
            for (let j = 0; j < i; j++) sum += L[i][j] * U[j][k];
            U[i][k] = A[i][k] - sum;
        }

        for (let k = i; k < n; k++) {
            if (i === k) L[i][i] = 1;
            else {
                let sum = 0;
                for (let j = 0; j < i; j++) sum += L[k][j] * U[j][i];
                L[k][i] = (A[k][i] - sum) / U[i][i];
            }
        }
    }
    return { L, U };
}

function forwardSubstitution(L, b) {
    let y = Array(b.length).fill(0);
    for (let i = 0; i < b.length; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) sum += L[i][j] * y[j];
        y[i] = b[i] - sum;
    }
    return y;
}

function backwardSubstitution(U, y) {
    let x = Array(y.length).fill(0);
    for (let i = y.length - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < y.length; j++) sum += U[i][j] * x[j];
        x[i] = (y[i] - sum) / U[i][i];
    }
    return x;
}

function solveLU() {
    let size = document.getElementById("matrixSize").value;
    let A = [];
    let B = [];

    for (let i = 0; i < size; i++) {
        A.push([]);
        for (let j = 0; j < size; j++) {
            A[i].push(parseFloat(document.getElementById(`A-${i}-${j}`).value));
        }
        B.push(parseFloat(document.getElementById(`B-${i}`).value));
    }

    let { L, U } = luDecomposition(A);
    let y = forwardSubstitution(L, B);
    let x = backwardSubstitution(U, y);

    let output = "Розв’язок:\n";
    x.forEach((val, i) => output += `x${i + 1} = ${val.toFixed(4)}\n`);
    document.getElementById("output").innerText = output;
}
