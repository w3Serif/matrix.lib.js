var Matrix = (function(){
    // EXAMPLE:
    //      var arr = [0,0,0, 0,0,0, 0,0,3];
    //      var someMatrix = new Matrix(arr,[3,3],'example name');
    /*
        var a = Matrix.random(4,1,5);
        a.print();
        var arr = [1,2,3,4];
        var b = new Matrix(arr,[1,4]);
        console.log(Matrix.add(a,a).print());
        console.log(Matrix.add(a,a).print());
    */
    function Matrix(matrix, dim, name){
        dim = dim || [1,matrix.length];
        if (typeof dim == 'number'){
          var tmp = dim;
          dim = [];
          dim[0] = dim[1] = tmp;
        }
        if ((dim[0] * dim[1]) != matrix.length) throw 'Constructor: Dimension is not correct!';
        for ( var i = 0, len = matrix.length; i < len; i++){
          if (typeof matrix[i] != 'number') throw 'Constructor: Some elements is not a number!'
        }
        this.matrix = matrix;
        this.dim    = dim;
        this.name   = name;
        this.length = matrix.length;
    };
    Matrix.prototype = {
        constructor: Matrix,
        toString: function(){
            if (this.matrix.length>50){
                this.print();
            }
            else return '['+this.matrix+']';
        },
        transpose: function(arg){
            var n = [],
                m = this.matrix,
                c = this.dim[1];
            for(var i=0;i<c;i++){
                for(var j=0;j<m.length;j+=c){
                    n.push(m[j+i]);
                }
            }
            if (!arg){
                this.matrix = n;
                this.dim = [c,this.dim[0]];
            } else {
                return new Matrix(n,[c,this.dim[0]]);
            }

        },
        pow: function(val){
            if (!Matrix.validator('sqr',this)) throw 'Matrix.pow: Определенно только для квадратных матриц вида 2x2, 3x3 и т.д.';
            var val = val || 1;
            for (var i=0;i<val;i++){
                this.matrix = Matrix.multiple(this,this).matrix;
            }
        },
        getMCord: function(id){
            return [Math.floor(id / this.dim[1])+1, id % this.dim[1] + 1];
        },
        /**
         * Select smome element/row/column from matrix
         * mcord[i,j]           	-- element
         * mcord[i] || mcord[i,0]   -- row
         * mcord[0,j]               -- column
         *
         * returns {Number} or {Array}
         * @param mcord {Array} [i,j]
         */
        getElement: function(mcord){
            var isArr = (Matrix.classOf(mcord)=='array');
            var r = (isArr)?mcord[0]:arguments[0],
                c = (isArr)?mcord[1]:arguments[1],
                cols=this.dim[1],
                elem;
            if (r && c){
                elem = this.matrix[(r-1)*cols+(c-1)];
            } else if (r && !c){
                elem = [];
                for (var i=0;i<cols;++i){
                    elem.push(this.matrix[(r-1)*cols+i]);
                }
            } else if (c && !r){
                elem = [];
                for (var i=0;i<this.dim[0];++i){
                    elem.push(this.matrix[(c-1)+cols*i]);
                }
            } else throw 'Can\'t get element';
            return elem;
        },
        delElements: function(mcord){
            var isArr = (Matrix.classOf(mcord)=='array');
            var r = (isArr)?mcord[0]:arguments[0],
                c = (isArr)?mcord[1]:arguments[1],
                cols=this.dim[1],
                elems = [];
            if (r && c) {
                throw "incorrect operation!";
            } else if (r && !c){
                // del row
                for (var i=0;i<cols;i++){
                    var e = this.matrix.splice((r-1)*cols, 1);
                    elems.push(e[0]);
                }
                this.dim[0]--;
            } else if (c && !r){
                for (var i=0; i<this.dim[0]; i++){
                    var idx = (i*cols)+(c-i)-1;
                    var e = this.matrix.splice(idx, 1);
                    elems.push(e[0]);
                }
                this.dim[1]--;
            }
            this.length = this.matrix.length;
            return elems;

        },
        makeOpposite: function(idelem){
            console.log('was',this.matrix[idelem]);
            if (this.matrix[idelem] == 1) this.matrix[idelem] = 0;
            if (this.matrix[idelem] == 0) this.matrix[idelem] = 1;
            console.log('new',this.matrix[idelem]);
        },
		// TODO:
        getDeterminant: function(){},
        print: function(val){
            var val = (val)?(val+'\n'):val || '';
            var str=val;
            var ln = this.matrix.length;
            var c=this.dim[1];
            for (var j=0;j<ln;j+=c){
                var s='';
                for(var i=0;i<c;i++){
                    s = (this.matrix[i+j].toString().length==1)?' ':'';
                    str+=s+this.matrix[i+j]+''+(((i+1)==c)?'\n':',');
                }
            }
            console.log(str);
        }
    };

    Matrix.validator = function(args){
        var countArgs=arguments.length,
            i=0;
        if (typeof arguments[0]=='string'){i=1;}
        for (;i<countArgs-1;i++){
            if (!(arguments[i] instanceof Matrix)) throw 'Validator: element: [' + arguments[i] + '] is not available!';
            if (i==countArgs) break;
            switch (arguments[0]){
                case 'sqr': if (arguments[i].dim[0]!=arguments[i].dim[1])    return false; break;
                case 'dim': if (arguments[i].dim[0]!=arguments[i+1].dim[0]  || arguments[i].dim[1]!=arguments[i+1].dim[1]) return false; break;
                case 'rxc': if (arguments[i].dim[1]!=arguments[i+1].dim[0]) throw 'Validator: Для умножения, число строк 1й матрицы должно быть равно числу столбцов 2й матрицы.'; break;
            }
        }
        return true;
    };
    Matrix.add       = function(args){
        var  m1 = arguments[0], m2 = arguments[1];
        if (this.validator(m1,m2)){
            if (!this.validator('dim',m1,m2)) throw 'Matrix.add: dimensions is not equaled!';
            var length = m1.length;
            var m = [];
            for(var i=0;i<length;i++){
                m.push(m1.matrix[i]+m2.matrix[i]);
            }
            return new Matrix(m,[m1.dim[0],m1.dim[1]]);
        }
    };
    Matrix.multiple  = function(m1,m2){
        function multipleVectors(v1,v2){
//            if(!(classOf(v1)=='array' && classOf(v2)=='array')) throw 'MultipleVectors: need array Vector';
            var elem = 0;
            for (var i=0;i<v1.length;i++) elem+=v1[i]*v2[i];
            return elem;
        }
        if (!this.validator('rxc',m1,m2)) return false;
        var newArray = [],
            rows = m1.dim[0];
        for(var i=1;i<=rows;i++){
            var v1 = m1.getElement(i,0);
            for(var j=1;j<=rows;j++){
                newArray.push(multipleVectors(v1,m2.getElement(0,j)));
            }
        }
        var dim = [m1.dim[0],m2.dim[1]];
        return new Matrix(newArray, dim);

    };
    Matrix.math      = function(expression,args){
        /*
		 * TODO:
         * Instance: "(A+B)^2",A,B
         * expression {string}
         * args {object}
         */
    };
    Matrix.random    = function(dim,minVal,maxVal){
        var arr = [];
        var sDim = dim*dim;
        for (var i=0;i<sDim;i++){
            arr.push(Math.floor(Math.random()*(maxVal-minVal+1))+minVal);
        }
        return new Matrix(arr,dim);
    };
    Matrix.classOf = function(arg){
        if(arg === null) return 'null';
        if(arg === undefined) return 'undefined';
        return Object.prototype.toString.call(arg).slice(8,-1).toLowerCase();
    }
    return Matrix;

})();
