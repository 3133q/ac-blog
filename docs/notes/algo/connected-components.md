# 连通块

> 连通块其实运用范围挺广的，只要涉及从一个点或者一个数不断延伸，就可以采用连通块模型

## 简介

连通块本质就是连通起来的一系列点或者数，将他们包裹起来，来解决最终的问题，一般我们可以采用bfs，dfs或者并查集去解决此类问题，但DFS比较常用，接下来就从DFS来分析吧

## 模版（图论）

代码部分可以先看看：

```cpp
#include <iostream>
#include <vector>
using namespace std;
 
const int MAX_N = 1000;  // 假设最多1000个节点
vector<int> graph[MAX_N];  // 邻接表表示图
bool visited[MAX_N];       // 访问标记数组
 
// 深度优先搜索（DFS）
void dfs(int node) {
    visited[node] = true;  // 标记当前节点已访问
    for (int neighbor : graph[node]) {  // 遍历所有邻居节点
        if (!visited[neighbor]) {
            dfs(neighbor);  // 如果邻居节点未访问，继续DFS
        }
    }
}
 
int main() {
    int n, m;  // n为节点数，m为边数
    cin >> n >> m;
 
    // 读取图的边
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        graph[u].push_back(v);
        graph[v].push_back(u);  // 无向图，双向连接
    }
 
    int connected_components = 0;  // 记录连通块数目
 
    // 遍历所有节点
    for (int i = 1; i <= n; i++) {
        if (!visited[i]) {  // 如果节点i未被访问，说明发现了一个新的连通块
            dfs(i);  // 对该节点进行DFS
            connected_components++;  // 连通块数加1
        }
    }
 
    cout << connected_components << endl;
 
    return 0;
}
```

## 例题

### 例题一：奶牛选美

[2060. 奶牛选美 - AcWing题库](https://www.acwing.com/problem/content/description/2062/)

#### 题目概述

![image-20260419115814463](/images/image-20260419115814463.png)

#### 分析

可以转换一下思路，题目要我们求的是要涂色多少块才能将牛的两个斑点给连通起来，但如果正着想的话不太好分析，纯暴力还得一个个点去看，太麻烦，所以我们可以反着推，一共有两个斑点，数量不多，我们可以把两个斑点（连通块）里面的所有坐标整出来，然后遍历去算这两个斑点里面的点之间的距离，把最小的曼哈顿距离算出来，最后再减一就好了（因为我们算的是点的数量）

#### 代码

```cpp
#include<iostream>
#include<cstring>
#include<cmath>
#include<vector>
#include<climits>
using namespace std;
typedef pair<int, int> PII;
const int N = 55;
char s[N][N];//存图
vector<PII> points[2];//连通块
int dx[]={0,0,1,-1};//方向数组
int dy[]={1,-1,0,0};
int n,m;
int res=INT_MAX;//无穷大
void dfs(int a,int b,vector<PII>&p){
    s[a][b]='.';//走过此连通块的就置为'.'防止重复搜索
    p.push_back({a,b});//连通块所有的坐标
    for(int i=0;i<4;i++){
        int x=a+dx[i];
        int y=b+dy[i];
        if(x>=0&&y>=0&&x<n&&y<m&&s[x][y]=='X'){//符合条件就继续搜
            dfs(x,y,p);
        }
    }
}
int main()
{
    cin>>n>>m;
    for(int i=0;i<n;i++){
        cin>>s[i];
    }
    int k=0;
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            if(s[i][j]=='X'){//找到一个X就能找到此联通块
                dfs(i,j,points[k++]);
            }
        }
    }
    for(auto i:points[0]){//c++11遍历更简单
        for(auto j:points[1]){
            res=min(res,abs(i.first-j.first)+abs(i.second-j.second));//两个坐标差值
        }
    }//最后要减一，比如(1,1)与(1,3)之间只有一个(1,2)，做差为2，所以要减一
    cout<<res-1<<endl;
    return 0;
}
```

> 注意，连通块模型最重要的是走过一个点需要标记为1，就比如这题，在DFS的开头就得标'.'，防止重复搜索，这个不写问题非常大！

### 例题二：扫雷

[687. 扫雷 - AcWing题库](https://www.acwing.com/problem/content/689/)

> 哈哈哈，熟悉的扫雷游戏。。。

#### 题目概述

![image-20260419121713260](/images/image-20260419121713260.png)

#### 分析

本质上就是把扫雷游戏的全览图给你，让你分析最少要点多少次才能通关，我们可以这么分析，都知道，如果点到周边没有雷的点（也就是0点），那么它周围一片的0点全会出来，既然要最小，那就直接点一次就OK了，求一下0的连通块数量，然后累加到最终的答案里，另一种，如果点到不是0并且周围有雷的点，这个我们必须点，不然赢不了，最后一种就是包含在0连通块内，周围还有雷的点，这个直接包含在情况一中，不需要考虑

所以最终答案就是0连通块的数量+不是0并且周围有雷的点的数量

#### 代码

```cpp
#include<iostream>
using namespace std;
const int N=305;
int n,T;
char str[N][N];
int a[N][N];//标记(i,j)点附近有几个雷
void dfs(int x,int y){
	int t=a[x][y];
	a[x][y]=-1;
	if(t){
		return;
	}
	for(int i=x-1;i<=x+1;i++){
		for(int j=y-1;j<=y+1;j++){
			if(i>=0&&j>=0&&i<n&&j<n&&a[i][j]!=-1){
				dfs(i,j);
			}
		}
	}
}
int main(){
	cin>>T;
	for(int k=1;k<=T;k++){
		cin>>n;
		for(int j=0;j<n;j++){
			cin>>str[j];
		}
		int res=0;
		for(int i=0;i<n;i++){
			for(int j=0;j<n;j++){
				if(str[i][j]=='*'){//如果此点是雷标记为-1
					a[i][j]=-1;
				}else{
					a[i][j]=0;
					for(int l=i-1;l<=i+1;l++){
						for(int r=j-1;r<=j+1;r++){
							if(str[l][r]=='*'&&l>=0&&r>=0&&l<n&&r<n){//附近是雷且没有越界
								a[i][j]++;
							}
						}
					}
				}
			}
		}
		for(int i=0;i<n;i++){//求为0的连通块
			for(int j=0;j<n;j++){
				if(a[i][j]==0){
					res++;
					dfs(i,j);
				}
			}
		}
		for(int i=0;i<n;i++){//求不属于0连通块且不是雷的点
			for(int j=0;j<n;j++){
				if(a[i][j]!=-1){
					res++;
				}
			}
		}
		cout<<"Case #"<<k<<":"<<res<<endl;
	}
	return 0;
}
```

### 例题三：岛屿个数

[P9243 [蓝桥杯 2023 省 B\] 岛屿个数 - 洛谷](https://www.luogu.com.cn/problem/P9243)

> 上点小难度

#### 题目概述

![image-20260419122258377](/images/image-20260419122258377.png)

#### 分析

对于普通版的岛屿，是只要遍历一下求出连通块数量即可，但这题可不一样，他还要我们去除那些环岛，也就是被包在里边的岛屿。。。

其实也不会难，一种思路是开两次搜索，大搜索里边如果遇到一个点周围也是陆地的情况，那么直接连通块标记，求数量，如果是海洋的话，直接下一步搜索，当然，这里得使用8个方向搜索，不然会忽略一些情况

还有一种思路是，在DFS判断完岛屿连通块时，再用一次check函数，直接bfs，去看看这个点你能不能通过海洋到达边界，如果可以的话，那就没问题，计数器加一，不然就不行。。

##### 思路一

```cpp
#include <iostream>
#include <cstring>
using namespace std;
const int N = 60;
int g[N][N];
bool st[N][N];
int dx4[] = {0, 0, 1, -1}, dy4[] = {1, -1, 0, 0};								//四个方向的向量
int dx8[] = {-1, -1, -1, 0, 1, 1, 1, 0}, dy8[] = {-1, 0, 1, 1, 1, 0, -1, -1};	//八个方向的向量
int cnt, T, m, n;
 
inline void dfs1(int x, int y) {
	st[x][y] = true;
	for (int i = 0; i < 4; i++) {
		int nx = x + dx4[i], ny = y + dy4[i];
		//没有走过，符合陆地的范围并且是陆地
		if (!st[nx][ny] && x >= 1 && x <= m && y >= 1 && y <= n && g[nx][ny]) dfs1(nx, ny);
	}
}
 
inline void dfs2(int x, int y) {		//八方向搜索
	st[x][y] = true;
	for (int i = 0; i < 8; i++) {
		int nx = x + dx8[i], ny = y + dy8[i];
		//没有走过，符合海洋的范围
		if (!st[nx][ny] && nx >=0 && nx <= m+1 && ny >= 0 && ny <= n+1) {
			if (!g[nx][ny]) dfs2(nx, ny);		//下一步是海洋继续搜索
			else if (g[nx][ny]) {				//下一步是陆地就将相邻的所有陆地设置为走过的状态
				dfs1(nx, ny);
				cnt += 1;						//并且岛屿数量加一
			}
		}
	}
}
 
int main() {
	ios::sync_with_stdio(false);				//取消IO同步流
	cin.tie(0);									//解除cin&cout绑定
	cin >> T;
	while (T--) {
		cin >> m >> n;
		memset(g, 0, sizeof g);					//重新分配地图
		memset(st, false, sizeof st);			//重新分配地图状态
		cnt = 0;
		for (int i = 1; i <= m; i++) {
			for (int j = 1; j <= n; j++) {
				char x;cin >> x;
				g[i][j] = x - '0';
			}
		}
		dfs2(0, 0);
		cout << cnt << endl;
	}
}
```

##### 思路二

```cpp
#include<iostream>
#include<queue>
using namespace std;
typedef long long LL;
const int MAX = 100;
int T,n,m, idx[MAX][MAX],re,f;
char h[MAX][MAX];
 
void dfs(int a, int b) {
	int dx[4] = { -1,1,0,0}, dy[4] = { 0,0,-1,1 };  //4个方向
	for (int i = 0; i < 4; i++) {
		int x = a + dx[i], y = b + dy[i];
		if (x < 0 || y < 0 || x >= n || y >= m) continue;
		if (!idx[x][y]&&h[x][y] == '1') {
			idx[x][y] = 1;
			dfs(x, y);
		}
	}
}
 
void check(int a, int b) {
	queue<pair<int,int>> q;
	q.push({a,b});
	int d[MAX][MAX] = { 0 };
	d[a][b] = 1;
	while (!q.empty()) {
		auto it = q.front();
		q.pop();
		int a = it.first, b = it.second;
		int dx[8] = { -1,-1,0,1,1, 1,0,-1}, dy[8] = { 0,1,1,1,0,-1,-1,-1 };  //8个方向
		for (int i = 0; i < 8; i++) {
			int x = a + dx[i], y = b + dy[i];
			if (x < 0 || y < 0 || x >= n || y >= m) {
				f = 1;                                     //可以到达边界
				continue;
			}
			if (!d[x][y] && h[x][y] == '0') {
				d[x][y] = 1;
				q.push({ x,y });
			}
		}
	}
}
int main() {
	cin >> T;
	while (T--) {
		cin >> n >> m;
		re = 0;
		f = 0;
		for (int i = 0; i < n; i++) {
			for (int j = 0; j < m; j++) {
				idx[i][j] = 0;             //初始化输入
				cin >> h[i][j];
			}
		}
		for (int i = 0; i < n; i++) {
			for (int j = 0; j < m; j++) {
				if (!idx[i][j]&&h[i][j] == '1') {      //判断
					idx[i][j] = 1;        //标记
					dfs(i, j);        //深搜
					f = 0;
					check(i, j);        //广搜
					if(f) re++;
				}
			}
		}
		cout << re << endl;
	}
	return 0;
}
```

## 集训赛题目

最后给出两道当时集训赛的题目

### 例题四：Lake Counting

[P1596 [USACO10OCT\] Lake Counting S - 洛谷](https://www.luogu.com.cn/problem/P1596?contestId=307703)

分析就省了，毕竟思路完全一样。。。

#### 代码

```cpp
#include<iostream>
#include<cstring>
#include<algorithm>
#include<climits>
using namespace std;
int n,m;
char a[500][500],v[500][500];
int dx[8]={0,1,1,1,0,-1,-1,-1};
int dy[8]={-1,-1,0,1,1,1,0,-1};
int total=0;
void dfs(int x,int y,int t){
	if(x<1||x>n||y<1||y>m||a[x][y]!='W') return ;
	a[x][y]='.';
	for(int i=0;i<8;i++){
		int xx=x+dx[i];
		int yy=y+dy[i];
		if(xx>=1&&xx<=n&&yy>=1&&yy<=m&&a[xx][yy]=='W') {
			dfs(xx,yy,t);
		}
	}
}
int main(){
	std::cin>>n>>m;
	for(int i=1;i<=n;i++)
	  for(int j=1;j<=m;j++)
		std::cin>>a[i][j];
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++){
			if(a[i][j]=='W') dfs(i,j,total++);
		}
	}
	std::cout<<total;
	return 0;
}
```

### 例题五：求细胞数量

[P1451 求细胞数量 - 洛谷](https://www.luogu.com.cn/problem/P1451?contestId=307703)

同根同源。。。

#### 代码

```cpp
#include<iostream>
#include<cstring>
#include<algorithm>
#include<climits>
using namespace std;
int n,m;
int dx[4]={0,1,0,-1};
int dy[4]={-1,0,1,0};
int a[300][300],total=0;
void dfs(int x,int y){
	if(x<1||x>n||y<1||y>m) return ;
	if(!a[x][y]) return ; 
	a[x][y]=0; 
	dfs(x+1,y);
    dfs(x-1,y);
    dfs(x,y+1);
    dfs(x,y-1);
}
int main(){
	string s;
	std::cin>>n>>m;
	for(int i=1;i<=n;i++){
		std::cin>>s;
		for(int j=1;j<=m;j++) a[i][j]=s[j-1]-'0';
	}
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++){
			if(a[i][j]) {
				total++;
				dfs(i,j);
			}
		}
	}
	std::cout<<total;
	return 0;
}
```
