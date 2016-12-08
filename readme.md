# Simple matrix lib

### init
```js
  var arr = [0,0,0, 0,0,0, 0,0,3];
  var someMatrix = new Matrix(arr, [3,3], 'example name');
```

### Operations

```js
  var a = Matrix.random(4,1,5, 'Random matrix A'); // Create new matrix 4x4 with random val[i,j]
  Matrix.add(a,a).print(); //
```

**List of operators with 2 matrix**
1. Matrix.add(matrix-1, matrix-2)
2. Matrix.multiple(matrix-1, matrix-1)

**List of actions for single matrix**
1. m.pow(val)
2. m.getElement(row, col)
```js
  var arr = [0,0,1, 0,0,2, 0,0,3];
  var someMatrix = new Matrix(arr, 3,'Matrix A'); // 3 is short notation. Full notation: [3,3]
  someMatrix.getElement(0,3); // => [1,2,3]
```
  
