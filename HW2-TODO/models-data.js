var points = []; //顶点的属性：坐标数组
var colors = []; //顶点的属性：颜色数组

const VertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 0.0, 0.5, 0.0, 1.0 ),  // light-green        
    vec4( 0.0, 0.0, 0.5, 1.0 ),  // light-blue
    vec4( 0.5, 0.0, 0.0, 1.0 ),  // light-red
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.5, 0.5, 0.5, 1.0 )   // grey
];// 常量颜色

/****************************************************
 * 坐标轴模型：X轴，Y轴，Z轴的顶点位置和颜色,(-1,1)范围内定义 
 ****************************************************/
function vertextsXYZ()
{
    const len = 0.9;
    var XYZaxis = [
        vec4(-len,  0.0,  0.0, 1.0), // X
        vec4( len,  0.0,  0.0, 1.0),
        vec4( len, 0.0, 0.0, 1.0),
        vec4(len-0.01, 0.01, 0.0, 1.0),
        vec4(len, 0.0, 0.0, 1.0),
        vec4(len-0.01, -0.01, 0.0, 1.0),
        
        vec4( 0.0, -len,  0.0, 1.0), // Y
        vec4( 0.0,  len,  0.0, 1.0),
        vec4( 0.0, len,0.0, 1.0),
        vec4(0.01, len-0.01, 0.0, 1.0),
        vec4(0.0, len, 0.0, 1.0),
        vec4(-0.01, len-0.01, 0.0, 1.0),
        
        vec4( 0.0,  0.0, -len, 1.0), // Z
        vec4( 0.0,  0.0,  len, 1.0),
        vec4( 0.0, 0.0, len, 1.0),
        vec4( 0.01, 0.0,  len-0.01, 1.0),
        vec4( 0.0, 0.0, len, 1.0),
        vec4( -0.01,0.0,  len-0.01, 1.0)
    ];
    
    var XYZColors = [
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
    ];
    
    for (var i = 0; i < XYZaxis.length; i++){    
        points.push(XYZaxis[i]);
        var j = Math.trunc(i/6); // JS取整运算Math.trunc//每个方向轴用6个顶点
        colors.push(XYZColors[j]);
    }
}

/****************************************************
 * 立方体模型生成
 ****************************************************/
function generateCube()
{
    quad( 1, 0, 3, 2 ); //Z正-前
    quad( 4, 5, 6, 7 ); //Z负-后
    
    quad( 2, 3, 7, 6 ); //X正-右
    quad( 5, 4, 0, 1 ); //X负-左
    
    quad( 6, 5, 1, 2 ); //Y正-上
    quad( 3, 0, 4, 7 ); //Y负-下
} 

function quad(a, b, c, d) 
{
	const vertexMC = 0.5; // 顶点分量X,Y,Z到原点距离
    var vertices = [
        vec4( -vertexMC, -vertexMC,  vertexMC, 1.0 ), //Z正前面左下角点V0，顺时针四点0~3
        vec4( -vertexMC,  vertexMC,  vertexMC, 1.0 ),
        vec4(  vertexMC,  vertexMC,  vertexMC, 1.0 ),
        vec4(  vertexMC, -vertexMC,  vertexMC, 1.0 ),
        vec4( -vertexMC, -vertexMC, -vertexMC, 1.0 ),   //Z负后面左下角点V4，顺时针四点4~7
        vec4( -vertexMC,  vertexMC, -vertexMC, 1.0 ),
        vec4(  vertexMC,  vertexMC, -vertexMC, 1.0 ),
        vec4(  vertexMC, -vertexMC, -vertexMC, 1.0 )
    ];

    var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        points.push(vertices[indices[i]]);  // 保存一个顶点坐标到定点给数组vertices中        
        colors.push(VertexColors[a]); // 立方体每面为单色
    }
}

/****************************************************
 * 球体模型生成：由四面体递归生成
 ****************************************************/
function generateSphere(){
    // 细分次数和顶点
    const numTimesToSubdivide = 5; // 球体细分次数
    var va = vec4(0.0, 0.0, -1.0, 1.0);
    var vb = vec4(0.0, 0.942809, 0.333333, 1.0);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1.0);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1.0);
    
    function triangle(a, b, c) {
        points.push(a);
        points.push(b);
        points.push(c);
        
        colors.push(vec4(0.0, 1.0, 1.0, 1.0));
        colors.push(vec4(1.0, 0.0, 1.0, 1.0));
        colors.push(vec4(0.0, 1.0, 0.0, 1.0));
    };

    function divideTriangle(a, b, c, count) {
        if ( count > 0 ) {
            var ab = mix( a, b, 0.5);
            var ac = mix( a, c, 0.5);
            var bc = mix( b, c, 0.5);

            ab = normalize(ab, true);
            ac = normalize(ac, true);
            bc = normalize(bc, true);

            divideTriangle(  a, ab, ac, count - 1 );
            divideTriangle( ab,  b, bc, count - 1 );
            divideTriangle( bc,  c, ac, count - 1 );
            divideTriangle( ab, bc, ac, count - 1 );
        }
        else {
            triangle( a, b, c );
        }
    }

    function tetrahedron(a, b, c, d, n) {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    };

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide); // 递归细分生成球体
}

/****************************************************
* TODO1: 墨西哥帽模型生成，等距细分得z,x，函数计算得到y
****************************************************/
/****************************************************
* 墨西哥帽模型生成：基于高斯函数的3D曲面
****************************************************/
function generateHat()
{
    // 网格划分参数（行和列）
    var nRows = 21;    // 行数（+1），实际网格数为nRows-1
    var nColumns = 21; // 列数（+1），实际网格数为nColumns-1
    var scale = 2.0;   // 坐标范围缩放因子（-1.0到1.0）

    // 存储每个网格点的高度数据
    var data = new Array(nRows);
    for(var i = 0; i < nRows; i++) {
        data[i] = new Array(nColumns);
    }

    // 计算网格点坐标和高度（墨西哥帽函数）
    for (var i = 0; i < nRows; i++) {
        for (var j = 0; j < nColumns; j++) {
            // 将网格索引转换为坐标 (-1.0 到 1.0)
            var x = (i / (nRows - 1) * 2 - 1) * scale;
            var z = (j / (nColumns - 1) * 2 - 1) * scale;
            
            // 计算径向距离
            var r = Math.sqrt(x * x + z * z);
            
            // 墨西哥帽函数 (基于高斯二阶导数)
            // 公式: y = (1 - 2r²) * e^(-r²)
            if (r < 0.001) {
                // 避免r=0时的计算问题
                data[i][j] = 1.0;
            } else {
                data[i][j] = (1 - 2 * r * r) * Math.exp(-r * r);
            }
        }
    }

    // 定义颜色数组（用于渐变效果）
    const hatColors = [
        vec4(0.2, 0.2, 0.8, 1.0),  // 深蓝色（低谷）
        vec4(0.0, 0.6, 1.0, 1.0),  // 天蓝色
        vec4(0.0, 1.0, 0.6, 1.0),  // 青绿色
        vec4(1.0, 1.0, 0.0, 1.0),  // 黄色（峰值）
    ];

    // 生成网格面（每个网格分为两个三角形）
    for (var i = 0; i < nRows - 1; i++) {
        for (var j = 0; j < nColumns - 1; j++) {
            // 计算当前网格四个顶点的坐标
            // 顶点1: (i,j)
            var x1 = (i / (nRows - 1) * 2 - 1) * scale;
            var z1 = (j / (nColumns - 1) * 2 - 1) * scale;
            var y1 = data[i][j];
            
            // 顶点2: (i+1,j)
            var x2 = ((i+1) / (nRows - 1) * 2 - 1) * scale;
            var z2 = (j / (nColumns - 1) * 2 - 1) * scale;
            var y2 = data[i+1][j];
            
            // 顶点3: (i+1,j+1)
            var x3 = ((i+1) / (nRows - 1) * 2 - 1) * scale;
            var z3 = ((j+1) / (nColumns - 1) * 2 - 1) * scale;
            var y3 = data[i+1][j+1];
            
            // 顶点4: (i,j+1)
            var x4 = (i / (nRows - 1) * 2 - 1) * scale;
            var z4 = ((j+1) / (nColumns - 1) * 2 - 1) * scale;
            var y4 = data[i][j+1];

            // 根据高度计算颜色（归一化高度到0-1范围）
            // 墨西哥帽函数的取值范围约为[-0.367, 1.0]，这里做简单归一化
            function getColor(y) {
                const minY = -0.4;
                const maxY = 1.0;
                const normY = Math.max(0, Math.min(1, (y - minY) / (maxY - minY)));
                const idx = Math.min(hatColors.length - 1, Math.floor(normY * hatColors.length));
                return hatColors[idx];
            }

            // 第一个三角形 (1,2,3)
            points.push(vec4(x1, y1, z1, 1.0));
            colors.push(getColor(y1));
            
            points.push(vec4(x2, y2, z2, 1.0));
            colors.push(getColor(y2));
            
            points.push(vec4(x3, y3, z3, 1.0));
            colors.push(getColor(y3));

            // 第二个三角形 (1,3,4)
            points.push(vec4(x1, y1, z1, 1.0));
            colors.push(getColor(y1));
            
            points.push(vec4(x3, y3, z3, 1.0));
            colors.push(getColor(y3));
            
            points.push(vec4(x4, y4, z4, 1.0));
            colors.push(getColor(y4));
        }
    }
}
/****************************************************
 * 复杂场景生成：组合房屋、屋顶、树木等模型
 ****************************************************/
function generateScene() {
    // 1. 重置顶点和颜色数组（清空原有数据）
    points = [];
    colors = [];
    // 先添加坐标轴
    vertextsXYZ();

    // 2. 绘制地面（一个扁平的立方体）
    drawCube(
        0, -0.75, 0,       // 位置(x, y, z)
        10, 0.1, 10,        // 尺寸(x, y, z)
        vec4(0.3, 0.7, 0.2, 1.0)  // 颜色（绿色）
    );
    // 石子路（从房屋通向场景边缘）
    drawPath();
    drawChimney();
    drawWindows();
    // 3. 绘制房屋主体（立方体）
    drawCube(
        0, 0, 0,          // 位置
        2, 1.5, 2,        // 尺寸（宽×高×深）
        vec4(0.8, 0.6, 0.4, 1.0)  // 颜色（棕色）
    );

    // 4. 绘制屋顶（金字塔/四面体）
    drawPyramid(
        0, 0.75, 0,        // 位置（屋顶底部中心与房屋顶部对齐）
        2.2, 1,           // 底座尺寸、高度
        vec4(0.6, 0.2, 0.2, 1.0)  // 颜色（红色）
    );
    drawDoor();

    // 5. 绘制树木（树干+树冠）
    // 树1
    drawCube(0.5, -0.3, 3, 0.3, 0.8, 0.3, vec4(0.5, 0.3, 0.1, 1.0)); // 树干
    drawSphere(0.5, 0.3, 3, 0.6, vec4(0.2, 0.6, 0.2, 1.0));          // 树冠（球体缩放）
    // 树2
    drawCube(-3, -0.3, 1, 0.3, 1, 0.3, vec4(0.5, 0.3, 0.1, 1.0));    // 树干
    drawSphere(-3, 0.4, 1, 0.7, vec4(0.2, 0.6, 0.2, 1.0));             // 树冠

    // 6. 新增：小灌木丛（房屋周围）
    drawBush(1.5, -0.5, 1, 0.4);
    drawBush(-1.5, -0.5, -1, 0.3);
    drawBush(4, -0.5, -1, 0.7);
    drawBush(-3, -0.5, 2, 0.6);
    drawBush(-3, -0.5, -2, 0.8);

}

/****************************************************
 * 工具函数：绘制带位置、尺寸、颜色的立方体
 * @param x, y, z：立方体中心位置
 * @param sx, sy, sz：x/y/z方向的尺寸（缩放）
 * @param color：立方体颜色
 ****************************************************/
function drawCube(x, y, z, sx, sy, sz, color) {
    const vertexMC = 0.5; // 基础立方体半边长（本地坐标）
    var vertices = [
        vec4(-vertexMC, -vertexMC, vertexMC, 1.0),  // 前下左
        vec4(-vertexMC, vertexMC, vertexMC, 1.0),   // 前上左
        vec4(vertexMC, vertexMC, vertexMC, 1.0),    // 前上右
        vec4(vertexMC, -vertexMC, vertexMC, 1.0),   // 前下右
        vec4(-vertexMC, -vertexMC, -vertexMC, 1.0), // 后下左
        vec4(-vertexMC, vertexMC, -vertexMC, 1.0),  // 后上左
        vec4(vertexMC, vertexMC, -vertexMC, 1.0),   // 后上右
        vec4(vertexMC, -vertexMC, -vertexMC, 1.0)   // 后下右
    ];

    // 对顶点进行缩放和位移（模型变换：先缩放再平移）
    function transform(v) {
        return vec4(
            v[0] * sx + x,  // x方向：缩放+平移
            v[1] * sy + y,  // y方向：缩放+平移
            v[2] * sz + z,  // z方向：缩放+平移
            1.0
        );
    }

    // 绘制6个面（复用quad函数的索引逻辑）
    const quads = [
        [1, 0, 3, 2], // 前
        [4, 5, 6, 7], // 后
        [2, 3, 7, 6], // 右
        [5, 4, 0, 1], // 左
        [6, 5, 1, 2], // 上
        [3, 0, 4, 7]  // 下
    ];
    for (const q of quads) {
        const indices = [q[0], q[1], q[2], q[0], q[2], q[3]]; // 两个三角形
        for (const i of indices) {
            points.push(transform(vertices[i])); // 应用变换
            colors.push(color); // 统一颜色
        }
    }
}

/****************************************************
 * 工具函数：绘制金字塔（四面体）
 * @param x, y, z：底座中心位置
 * @param baseSize：底座尺寸
 * @param height：高度
 * @param color：颜色
 ****************************************************/
function drawPyramid(x, y, z, baseSize, height, color) {
    const h = height; // 金字塔高度
    const s = baseSize / 2; // 底座半边长

    // 金字塔的4个顶点（本地坐标）
    const vertices = [
        vec4(-s, 0, -s, 1.0), // 底座左下后
        vec4(s, 0, -s, 1.0),  // 底座右下后
        vec4(s, 0, s, 1.0),   // 底座右下前
        vec4(-s, 0, s, 1.0),  // 底座左下前
        vec4(0, h, 0, 1.0)    // 顶端
    ];

    // 对顶点进行位移（平移到目标位置）
    function transform(v) {
        return vec4(v[0] + x, v[1] + y, v[2] + z, 1.0);
    }

    // 绘制4个侧面（每个侧面是一个三角形）
    const triangles = [
        [0, 1, 4], // 后侧面
        [1, 2, 4], // 右侧面
        [2, 3, 4], // 前侧面
        [3, 0, 4]  // 左侧面
    ];
    for (const t of triangles) {
        for (const i of t) {
            points.push(transform(vertices[i]));
            colors.push(color);
        }
    }
}

/****************************************************
 * 工具函数：绘制带位置和缩放的球体
 * @param x, y, z：位置
 * @param scale：缩放因子
 * @param color：颜色
 ****************************************************/
function drawSphere(x, y, z, scale, color) {
    const numSubdiv = 4; // 细分次数（控制精度）
    // 四面体初始顶点（单位球）
    const va = vec4(0.0, 0.0, -1.0, 1.0);
    const vb = vec4(0.0, 0.942809, 0.333333, 1.0);
    const vc = vec4(-0.816497, -0.471405, 0.333333, 1.0);
    const vd = vec4(0.816497, -0.471405, 0.333333, 1.0);

    // 递归细分三角形并添加顶点
    function divideTriangle(a, b, c, count) {
        if (count > 0) {
            const ab = normalize(mix(a, b, 0.5));
            const ac = normalize(mix(a, c, 0.5));
            const bc = normalize(mix(b, c, 0.5));
            divideTriangle(a, ab, ac, count - 1);
            divideTriangle(ab, b, bc, count - 1);
            divideTriangle(bc, c, ac, count - 1);
            divideTriangle(ab, bc, ac, count - 1);
        } else {
            // 对顶点进行缩放和位移
            const transform = (v) => vec4(
                v[0] * scale + x,
                v[1] * scale + y,
                v[2] * scale + z,
                1.0
            );
            points.push(transform(a));
            points.push(transform(b));
            points.push(transform(c));
            colors.push(color);
            colors.push(color);
            colors.push(color);
        }
    }

    // 生成球体
    divideTriangle(va, vb, vc, numSubdiv);
    divideTriangle(vd, vc, vb, numSubdiv);
    divideTriangle(va, vd, vb, numSubdiv);
    divideTriangle(va, vc, vd, numSubdiv);
}


/****************************************************
 * 新增元素：石子路（从房屋到场景边缘）
 ****************************************************/
function drawPath() {
    const pathColor = vec4(0.6, 0.6, 0.6, 1.0); // 灰色石子路

    // 主路：从房屋正面延伸到场景边缘（Z轴负方向）
    drawCube(
        0, -0.7, -2,  // 位置（稍微高于地面，避免重叠）
        1.2, 0.2, 8,  // 尺寸（宽1.2，长8，薄0.02）
        pathColor
    );


}
/****************************************************
 * 新增元素：灌木丛（简化为多个球体组合）
 ****************************************************/
function drawBush(x, y, z, scale) {
    const bushColor = vec4(0.1, 0.5, 0.1, 1.0); // 深绿色
    // 用3个球体组合成灌木丛形状
    drawSphere(x, y, z, scale, bushColor);
    drawSphere(x + scale*0.5, y, z + scale*0.3, scale*0.7, bushColor);
    drawSphere(x - scale*0.4, y, z - scale*0.5, scale*0.6, bushColor);
}
function drawDoor() {
    // 门：棕色，位于房屋正面中间
    drawCube(0, -0.3, -1.01, 0.6, 1.0, 0.05, vec4(0.5, 0.2, 0.1, 1.0));
    // 门把手
    drawCube(0.2, -0.1,-1.03, 0.05, 0.05, 0.05, vec4(0.8, 0.6, 0.0, 1.0));
}
function drawChimney() {
    // 烟囱主体
    drawCube(0.5, 1.2, 0.5, 0.4, 0.8, 0.4, vec4(0.5, 0.5, 0.5, 1.0)); // 灰色烟囱
    // 烟囱顶部（略微外扩）
    drawCube(0.5, 1.6, 0.5, 0.5, 0.1, 0.5, vec4(0.4, 0.4, 0.4, 1.0));
}
function drawWindows() {
    const frameColor = vec4(0.2, 0.2, 0.2, 1.0); // 窗框颜色
    const glassColor = vec4(0.8, 0.9, 1.0, 0.7); // 玻璃颜色（半透明）

    // 正面窗户（门的上方）
    drawCube(0, 0.5, 1.01, 0.8, 0.5, 0.05, frameColor); // 窗框
    drawCube(0, 0.5, 1.02, 0.7, 0.4, 0.01, glassColor); // 玻璃

    // 侧面窗户（左右各一个）
    drawCube(1.01, 0.3, 0, 0.05, 0.5, 0.6, frameColor); // 右侧窗框
    drawCube(1.02, 0.3, 0, 0.01, 0.4, 0.5, glassColor); // 右侧玻璃
    drawCube(-1.01, 0.3, 0, 0.05, 0.5, 0.6, frameColor); // 左侧窗框
    drawCube(-1.02, 0.3, 0, 0.01, 0.4, 0.5, glassColor); // 左侧玻璃
}