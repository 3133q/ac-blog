# 前缀和

适用于求出某个区间的和，通过累加前缀和例如sum[i]储存前i个元素的和

因此计算区间[l,r]的和时，只需计算sum[r]-sum[l-1]

## 代码实现

```cpp
for(int i=0;i<n;i++)
{
    if(i==0) y[i]=x[i];
    else y[i]=y[i-1]+x[i];
}
```

## 二维前缀和

### 介绍

![img](https://pica.zhimg.com/v2-164e5df46fcfaaa6a3bc9ce325b08f4a_1440w.jpg)

右侧标注橙色的二维前缀和元素，其值是左侧的原二维数组中标注橙色的所有元素的和。

### 代码实现

```cpp
for(int y=0;y<n;y++)//n行
    for(int x=0;x<m;x++)//m列
    {
        if(x==0&&y==0) b[y][x]=a[y][x];//左上角的值
        else if(x==0) b[y][x]=b[y-1][x]+a[y][x];//第一列
        else if(y==0) b[y][x]=b[y][x-1]+a[y][x];//第一行
        else b[y][x]=b[y-1][x]+b[y][x-1]-b[y-1][x-1]+a[y][x];
    }
```

### 拓展：partial_sum 函数

c++里有求区间之和的函数partial_sum

partial_sum(a.begin(),a.end(),s.begin())  计算前缀和

因此二维前缀和也可以分行列计算

```cpp
auto s=vector(n+1,vector<int>(m+1));
for(int i=1;i<=n;i++){
     partial_sum(a.begin(),a.end(),s.begin());
     for(int j=1;j<=m;j++)  s[i][j]=s[i][j]+s[i-1][j];
}
```

## 例题：成绩百分比

成绩百分比：班里共有n位同学，编号为1~n,考试中每个同学取得了一定的成绩，接下来进行m次询问，每次询问给出一位同学的编号，求这位同学的成绩在班上的占比

求法：不超过这名同学成绩的班级人数（包括他）/总人数 *100%

（2<=m,n<=100000,ai<=150)

**解法①**  先排序，然后采用单调栈的思路

**解法②**  正题，采用前缀和算法

由于成绩小于等于150，不算大，可以先桶排序每个分数对应的人数，然后采用前缀和算法来计算不超过该分数的人数

f[i]=f[i-1]+people[i]，i表示分数，people[i]表示考到该分数的人数

## 二维前缀和求子矩阵元素和

关于二维前缀和算法求(x1,y1)->(x2,y2) 之间元素之和

设

```
ps[i][j]已经计算好二维前缀和
```

公式： ps[x2] [y2]-ps[x1-1] [y2]-ps[x2] [y1-1]+ps[x1-1] [y1-1]

### 例题：[P1387 最大正方形 - 洛谷](https://www.luogu.com.cn/problem/P1387)

参考代码

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int n, m;
std::vector<std::vector<int>> a, ps;  // (n + 1) x (m + 1).

// Calculate the prefix sum of 2-d array.
void prefix_sum() {
  ps = a;
  for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= m; ++j)
      ps[i][j] += ps[i - 1][j] + ps[i][j - 1] - ps[i - 1][j - 1];
}

// Find the sum of elements in submatrix [x1, y1] to [x2, y2].
int query(int x1, int y1, int x2, int y2) {
  return ps[x2][y2] - ps[x1 - 1][y2] - ps[x2][y1 - 1] + ps[x1 - 1][y1 - 1];
}

int main() {
  std::cin >> n >> m;
  a.assign(n + 1, std::vector<int>(m + 1));

  for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++) std::cin >> a[i][j];

  prefix_sum();

  int ans = 0;
  for (int l = 1; l <= std::min(n, m); ++l)
    for (int i = l; i <= n; i++)
      for (int j = l; j <= m; j++)
        if (query(i - l + 1, j - l + 1, i, j) == l * l) ans = std::max(ans, l);

  std::cout << ans << std::endl;
  return 0;
}
```

尤其注意   计算矩阵的元素和时是dp[x1-1] [y2] ,  dp[x2] [y1-1] !!!!!!!

### 例题：[P1719 最大加权矩形 - 洛谷](https://www.luogu.com.cn/problem/P1719)

正方形只需要开一重for循环枚举边长即可，对比矩形，则需要两重for循环枚举长和宽

代码如下：

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
	int n,maxx=INT_MIN,x;
	std::cin>>n;
	vector<vector<int>>a(n+1,vector<int>(n+1));
	vector<vector<int>>dp(n+1,vector<int>(n+1));
	for(int i=1;i<=n;i++)
	 for(int j=1;j<=n;j++){
	 	std::cin>>x;
	 	dp[i][j]=dp[i-1][j]+dp[i][j-1]-dp[i-1][j-1]+x;
	 }
	for(int i=1;i<=n;i++)
	 for(int k1=0;k1<i;k1++)
	  for(int j=1;j<=n;j++)
	   for(int k2=0;k2<j;k2++){
	   	int sum=dp[i][j]-dp[i-k1-1][j]-dp[i][j-k2-1]+dp[i-k1-1][j-k2-1];
	   	maxx=max(maxx,sum);
	   }
	std::cout<<maxx;
	return 0;
}
```
